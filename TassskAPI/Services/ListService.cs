using MongoDB.Bson;
using MongoDB.Driver;
using TassskAPI.DTOs;
using TassskAPI.DTOs.List;
using TassskAPI.DTOs.Notification;
using TassskAPI.Models;
using File = TassskAPI.Models.File;

namespace TassskAPI.Services
{
    public class ListService : BaseService
    {
        public async Task<List<ListDTO>> GetLists(string email)
        {
            var user = await db.GetCollection<User>(UserCollection).Find(x => x.Email == email).FirstOrDefaultAsync();

            var lists = await db.GetCollection<List>(ListCollection)
                 .Find(Builders<List>.Filter
                 .ElemMatch(x => x.Privileges, z => z.UserId == user.Id))
                 .ToListAsync();

            return lists.Select(x => new ListDTO
            {

                Id = x.Id.ToString(),
                CreatedDate = x.CreatedDate,
                FinishDate = x.FinishDate,
                Finished = x.Finished,
                Name = x.Name,
                Privileges = x.Privileges.Select(y => new PrivilegesDTO
                {
                    UserId = y.UserId.ToString(),
                    Delete = y.Delete,
                    Modify = y.Modify,
                    Owner = y.Owner,
                    Read = y.Read,
                    Write = y.Write
                }).ToList(),
            }).ToList();
        }


        public async Task<bool> CreateList(NewListDTO newList, string email)
        {
            var user = await db.GetCollection<User>(UserCollection).Find(x => x.Email == email).FirstOrDefaultAsync();

            var lists = await db.GetCollection<List>(ListCollection)
                 .Find(Builders<List>.Filter
                 .ElemMatch(x => x.Privileges, z => z.UserId == user.Id))
                 .ToListAsync();

            if (lists.Select(x => x.Name).FirstOrDefault() == newList.Name)
            {
                return false;
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
                UserId = user.Id,
                Owner = true,
                Delete = true,
                Modify = true,
                Read = true,
                Write = true
            };

            list.Privileges.Add(privilages);

            await db.GetCollection<List>(ListCollection).InsertOneAsync(list);

            return true;
        }
        public async Task<bool> UpdateList(ListDTO updateList, string email)
        {
            var user = await db.GetCollection<User>(UserCollection).Find(x => x.Email == email).FirstOrDefaultAsync();

            var list = await db.GetCollection<List>(ListCollection)
                 .Find(x => x.Id == ObjectId.Parse(updateList.Id)).FirstOrDefaultAsync();

            list.Name = updateList.Name;
            list.Finished = updateList.Finished;
            list.FinishDate = updateList.FinishDate;
            list.Privileges = updateList.Privileges.Select(x => new Privileges()
            {
                UserId = ObjectId.Parse(x.UserId),
                Delete = x.Delete,
                Modify = x.Modify,
                Read = x.Read,
                Write = x.Write
            }).ToList();

            var res = await db.GetCollection<List>(ListCollection).ReplaceOneAsync(Builders<List>.Filter.Eq(x => x.Id, ObjectId.Parse(updateList.Id)), list);
            return res.IsAcknowledged;
        }

        public async Task<bool> DeleteList(string id, string email)
        {
            var user = await db.GetCollection<User>(UserCollection).Find(x => x.Email == email).FirstOrDefaultAsync();

            var list = await db.GetCollection<List>(ListCollection).FindAsync(x => x.Id == ObjectId.Parse(id));

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
        public async Task<bool> SendInvite(SendInviteDTO sendInviteDTO, string email)
        {
            var user = await db.GetCollection<User>(UserCollection).Find(x => x.Email == sendInviteDTO.Receiver).FirstOrDefaultAsync();

            var list = await db.GetCollection<List>(ListCollection).Find(x => x.Id == ObjectId.Parse(sendInviteDTO.ListId)).FirstOrDefaultAsync();


            var notification = new InviteNotification
            {
                Type = "Invite",
                Header = $"New invite!",
                Body = $"You've got invite to \"{list.Name}\" list from {email}!",
                Receiver = sendInviteDTO.Receiver,
                CreatedAt = DateTime.Now,
                ListId = sendInviteDTO.ListId,
                Privileges = new Privileges
                {
                    UserId = user.Id,
                    Owner = false,
                    Read = true,
                    Write = true,
                    Modify = true,
                    Delete = true
                }
            };

            await db.GetCollection<InviteNotification>(NotificationCollection).InsertOneAsync(notification);
            return true;
        }
        public async Task<bool> AcceptInvite(AcceptInviteDTO acceptInviteDTO)
        {
            var list = await db.GetCollection<List>(ListCollection).Find(x => x.Id == ObjectId.Parse(acceptInviteDTO.ListId)).FirstOrDefaultAsync();

            list.Privileges.Add(acceptInviteDTO.Privileges);


            var res = await db.GetCollection<List>(ListCollection)
                 .ReplaceOneAsync(Builders<List>.Filter.Eq(x => x.Id, ObjectId.Parse(acceptInviteDTO.ListId)), list);
            return res.IsAcknowledged;
        }
    }
}
