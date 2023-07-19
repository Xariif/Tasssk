using MongoDB.Bson;
using MongoDB.Driver;
using TassskAPI.DTOs.Item;
using TassskAPI.DTOs.List;
using TassskAPI.DTOs.Notification;
using TassskAPI.Models;
using File = TassskAPI.Models.File;

namespace TassskAPI.Services
{
    public class ListService : BaseService
    {
        #region List operations
        public async Task<UserListsDTO> GetLists(string email, string? selectedListId)
        {
            var user = await db.GetCollection<User>(UserCollection).Find(x => x.Email == email).FirstOrDefaultAsync();

            var lists = await db.GetCollection<List>(ListCollection)
                 .Find(Builders<List>.Filter
                 .ElemMatch(x => x.Privileges, z => z.Email == user.Email && z.Read == true))
                 .ToListAsync();


            var userListsDTO = new List<UserListDTO>();

            foreach (var list in lists)
            {
                UserListDTO userListDTO = new()
                {
                    Id = list.Id.ToString(),
                    Name = list.Name,
                    Finished = list.Finished,
                    CreatedDate = list.CreatedDate,
                    FinishDate = list.FinishDate,
                    CanDelete = list.Privileges.Where(x => x.Email == email).Select(z => z.Delete).FirstOrDefault(),
                    CanEdit = list.Privileges.Where(x => x.Email == email).Select(z => z.Modify).FirstOrDefault(),
                    Items = db.GetCollection<Item>(ItemCollection).Find(x => x.ListId == list.Id).ToListAsync()
                    .Result.Select(z => new ItemDTO { Id = z.Id.ToString(), CreatedAt = z.CreatedAt, Finished = z.Finished, ListId = z.ListId.ToString(), Name = z.Name }).ToList(),
                    IsSelected =
                    selectedListId == null && lists.First() == list ? true : selectedListId != null && lists.Any(x => x.Id == ObjectId.Parse(selectedListId)) && list == lists.First(x => x.Id == ObjectId.Parse(selectedListId)) ? true : false
                    ,
                    IsOwner = list.Privileges.Where(x => x.Email == email).Select(z => z.Owner).FirstOrDefault()

                };
                userListsDTO.Add(userListDTO);
            }

            UserListsDTO res = new()
            {
                Lists = userListsDTO
            };

            return res;
        }
        public async Task<string> CreateList(NewListDTO newList, string email)
        {
            var user = await db.GetCollection<User>(UserCollection).Find(x => x.Email == email).FirstOrDefaultAsync();

            var lists = await db.GetCollection<List>(ListCollection)
                 .Find(Builders<List>.Filter
                 .ElemMatch(x => x.Privileges, z => z.Email == user.Email))
                 .ToListAsync();

            if (lists.Select(x => x.Name).FirstOrDefault() == newList.Name)
            {
                return null;
            }

            var list = new List
            {
                Id = ObjectId.GenerateNewId(),
                Name = newList.Name.Trim(),
                Finished = false,
                FinishDate = newList.FinishDate,
                CreatedDate = DateTime.Now,
                Privileges = new List<Privileges>()
            };

            var privilages = new Privileges()
            {
                Email = user.Email,
                Owner = true,
                Delete = true,
                Modify = true,
                Read = true,
                Write = true
            };

            list.Privileges.Add(privilages);

            await db.GetCollection<List>(ListCollection).InsertOneAsync(list);

            return list.Id.ToString();
        }
        public async Task<bool> UpdateList(ListDTO updateList, string email)
        {
            var user = await db.GetCollection<User>(UserCollection).Find(x => x.Email == email).FirstOrDefaultAsync();

            var list = await db.GetCollection<List>(ListCollection)
                 .Find(x => x.Id == ObjectId.Parse(updateList.Id)).FirstOrDefaultAsync();

            list.Name = updateList.Name;
            list.Finished = updateList.Finished;
            list.FinishDate = updateList.FinishDate;

            var res = await db.GetCollection<List>(ListCollection).ReplaceOneAsync(Builders<List>.Filter.Eq(x => x.Id, ObjectId.Parse(updateList.Id)), list);
            return res.IsAcknowledged;
        }
        public async Task<bool> DeleteList(string id, string email)
        {
            var user = await db.GetCollection<User>(UserCollection).Find(x => x.Email == email).FirstOrDefaultAsync();

            var list = await db.GetCollection<List>(ListCollection).Find(x => x.Id == ObjectId.Parse(id)).FirstOrDefaultAsync();

            if (list == null)
                return false;

            var privileges = list.Privileges.Where(x => x.Email == email).FirstOrDefault();



            if (privileges.Owner)
            {
                var files = await db.GetCollection<File>(FileCollection).Find(x => x.ListId == ObjectId.Parse(id)).ToListAsync();

                foreach (var file in files)
                {
                    await db.GetCollection<FilesData>(FileDataCollection).DeleteOneAsync(x => x.Id == file.FileId);
                    await db.GetCollection<File>(FileCollection).DeleteOneAsync(x => x.Id == file.Id);
                };

                await db.GetCollection<Item>(ItemCollection).DeleteManyAsync(x => x.ListId == ObjectId.Parse(id));
                var res = await db.GetCollection<List>(ListCollection).DeleteOneAsync(x => x.Id == ObjectId.Parse(id));
                return res.IsAcknowledged;
            }
            else
            {
                list.Privileges.Remove(privileges);
                var res = await db.GetCollection<List>(ListCollection).ReplaceOneAsync(Builders<List>.Filter.Eq(x => x.Id, ObjectId.Parse(id)), list);
                return res.IsAcknowledged;
            }
        }
        #endregion

        #region Invites
        public async Task<string> SendInvite(SendInviteDTO sendInviteDTO, string email)
        {
            var user = await db.GetCollection<User>(UserCollection).Find(x => x.Email == sendInviteDTO.Receiver).FirstOrDefaultAsync();
            if (user == null)
            {
                throw new ArgumentException(message: "User not exist");
            }
            if (user.Email == email)
            {
                throw new ArgumentException(message: "You can't send invite to yourself");
            }

            var list = await db.GetCollection<List>(ListCollection).Find(x => x.Id == ObjectId.Parse(sendInviteDTO.ListId)).FirstOrDefaultAsync();

            if (list.Privileges.Any(x => x.Email == sendInviteDTO.Receiver))
            {
                throw new ArgumentException(message: "User already is assigned to following list");
            }


            var filter = new BsonDocument
            {
                { "Receiver", sendInviteDTO.Receiver },
                { "Type", "Invite" },
                {"ListId", new ObjectId(sendInviteDTO.ListId) }
            };
            var usernotifications = await db.GetCollection<BsonDocument>(NotificationCollection).Find(filter).ToListAsync();

            if (usernotifications.Any())
            {
                throw new ArgumentException(message: "User already have pending invite to this list");
            }


            NotificationService notificationService = new NotificationService();
            await notificationService.CreateInviteNotification(list.Name, sendInviteDTO.ListId, email, sendInviteDTO.Receiver);
            return "Invite sent";
        }
        public async Task<string> AcceptInvite(AcceptInviteDTO acceptInviteDTO)
        {
            var list = await db.GetCollection<List>(ListCollection).Find(x => x.Id == ObjectId.Parse(acceptInviteDTO.ListId)).FirstOrDefaultAsync();

            if (list == null) { throw new ArgumentException(message: "List no longer exist"); }

            if (list.Privileges.Any(x => x.Email == acceptInviteDTO.Privileges.Email))
            {
                throw new ArgumentException(message: "You are already assigned to that list");
            }

            list.Privileges.Add(acceptInviteDTO.Privileges);

            var res = await db.GetCollection<List>(ListCollection)
                 .ReplaceOneAsync(Builders<List>.Filter.Eq(x => x.Id, ObjectId.Parse(acceptInviteDTO.ListId)), list);
            return "Invitation accepted";
        }
        #endregion


        public async Task<List<ListPrivileges>> ListPrivileges(string listId, string email)
        {
            var list = await db.GetCollection<List>(ListCollection).Find(x => x.Id == ObjectId.Parse(listId)).FirstOrDefaultAsync();

            var user = list.Privileges.FirstOrDefault(x => x.Email == email);

            if (user.Owner == false)
            {
                return null;
            }


            var result = list.Privileges.Select(x =>
                new ListPrivileges
                {
                    Email = x.Email,
                    IsOwner = x.Owner
                }
            ).ToList();

            //Jak bd rozbudowywać uprawnienia dodać więcej parametrów

            return result;
        }
        public async Task<string> RemoveAccess(string listId, string receiver, string sender)
        {
            var list = await db.GetCollection<List>(ListCollection).Find(x => x.Id == ObjectId.Parse(listId)).FirstOrDefaultAsync();

            if (list.Privileges.Find(x => x.Email == sender).Owner == false)
                throw new ArgumentException(message: "You are not owner");


            list.Privileges.Remove(list.Privileges.First(x => x.Email == receiver));

            await db.GetCollection<List>(ListCollection).ReplaceOneAsync(Builders<List>.Filter.Eq(x => x.Id, ObjectId.Parse(listId)), list);



            NotificationService notificationService = new NotificationService();
            await notificationService.CreateNotification(sender,receiver, "Privleges removed", "Privileges to list " + list.Name + " has been removed by it's owner");

            return "Privileges removed";
        }
    }
}
