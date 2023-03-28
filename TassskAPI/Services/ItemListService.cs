using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;
using MongoDB.Driver;
using TassskAPI.DTOs.ItemList;
using TassskAPI.Helpers.Models;
using TassskAPI.Models.Notification;
using ToDoAPI.DTOs;
using ToDoAPI.Helpers;
using ToDoAPI.Helpers.Models;
using ToDoAPI.Models;
using ToDoAPI.Models.ItemList;
using ToDoAPI.Models.User;
using FileInfo = ToDoAPI.Models.ItemList.FileInfo;

namespace ToDoAPI.Services
{
    public class ItemListService
    {
        private readonly MongoCRUD db;
        private readonly string ItemListCollection;
        private readonly string FileDataCollection;
        private readonly string UserCollection;

        public ItemListService()
        {
            ItemListCollection = "ItemList";
            FileDataCollection = "FileData";
            UserCollection = "User";
            db = new MongoCRUD();
        }
        #region List
        public async Task<bool> AddList(NewListDTO newList, string email)
        {
            var filterHelper = new MongoFilterHelper
            {
                FilterField = "Name",
                FilterValue = newList.Name
            };

            var nameExist = await db.FindFirstAsync<ItemList>(ItemListCollection, filterHelper);

            if (nameExist != null)
                return false;

            var list = new ItemList
            {
                Id = ObjectId.GenerateNewId(),
                Name = newList.Name.Trim(),
                Finished = false,
                FinishDate = newList.FinishDate,
                CreatedDate = DateTime.Now,
            };
            //Create document in ItemList
            await db.InsertOneAsync(ItemListCollection, list);

            var privilages = new Privileges
            {
                ListObjectId = list.Id,
                ListPermission = new PermissionModel
                {
                    Owner = true,
                    Read = true,
                    Write = true,
                    Modify = true,
                    Delete = true,
                }
            };

            //Add access to user
            var nestedHelper = new MongoNestedArrayHelper<Privileges>
            {
                FilterField = "Email",
                FilterValue = email,

                NestedArray = "Priviliges",
                NestedObject = privilages
            };
            await db.PushObjectToNestedArrayAsync(UserCollection, nestedHelper);

            return true;
        }
        public async Task<List<ItemList>> GetListsByEmail(string email)
        {
            var filter = new MongoFilterHelper
            {
                FilterField = "Email",
                FilterValue = email
            };


            var user = await db.FindFirstAsync<User>(UserCollection, filter);
            var listsIds = user.Privileges.Select(x => x.ListObjectId).ToList();

            var result = new List<ItemList>();


            foreach (var id in listsIds)
            {
                var list = await db.FindFirstByIdAsync<ItemList>(ItemListCollection, id.ToString());
                result.Add(list);
            }

            return result;
        }



        public async Task<List<ItemList>> GetListsByEmailAsync(string email)
        {
            var filter = new MongoFilterHelper
            {
                FilterField = "Email",
                FilterValue = email
            };
            return await db.FindManyAsync<ItemList>(ItemListCollection, filter);
        }

        public async Task<ItemList> GetListById(string id)
        {
            return await db.FindFirstByIdAsync<ItemList>(ItemListCollection, id);
        }
        public async Task UpdateList(string id, ItemList list)
        {
            await db.FindOneAndReplaceAsync<ItemList>(ItemListCollection, id, list);
        }
        public async Task DeleteList(string email, string id)
        {
            var files = db.FindFirstByIdAsync<ItemList>(ItemListCollection, id).Result.Files;

            foreach (var file in files)
            {
                await db.DeleteOneAsync<FilesData>(FileDataCollection, file.FileId.ToString());
            }
            await db.DeleteOneAsync<ItemList>(ItemListCollection, id);


            var usersFilter = new MongoNestedArrayHelper<User>
            {
                FilterField = "ListObjectId",
                FilterValue = id,
                NestedArray = "Privileges"
            };
            var users = await db.FindByIdInNestedArrayAsync<User, Privileges>(UserCollection, usersFilter);


            foreach (var user in users)
            {

                var pullFilter = new MongoNestedArrayHelper<Privileges>
                {
                    FilterField = "Email",
                    FilterValue = user.Email,
                    NestedArray = "Privileges",
                    NestedObject = user.Privileges.FirstOrDefault(x => x.ListObjectId == ObjectId.Parse(id))
                };
                var res = await db.PullObjectFromNestedArrayAsync(UserCollection, pullFilter);
            }
        }
        #endregion
        #region Item
        //Item

        public async Task AddItem(string listId, string itemName)
        {
            var list = await db.FindFirstByIdAsync<ItemList>(ItemListCollection, listId);

            var item = new Item
            {
                Finished = false,
                Id = ObjectId.GenerateNewId(),
                Name = itemName,
                CreatedAt = DateTime.Now
            };

            list.Items.Add(item);

            await db.FindOneAndReplaceAsync(ItemListCollection, listId, list);
        }

        public async Task DeleteItem(string listId, string itemId)
        {
            var list = await db.FindFirstByIdAsync<ItemList>(ItemListCollection, listId);

            list.Items.RemoveAll(x => x.Id == ObjectId.Parse(itemId));

            await db.FindOneAndReplaceAsync(ItemListCollection, listId, list);
        }
        public async Task<bool> UpdateItem(string listId, Item item)
        {
            try
            {
                var list = await db.FindFirstByIdAsync<ItemList>(ItemListCollection, listId);

                list.Items.RemoveAll(x => x.Id == item.Id);
                list.Items.Add(item);

                await db.FindOneAndReplaceAsync(ItemListCollection, listId, list);
                return true;
            }
            catch
            {
                return false;
            }
        }

        #endregion
        #region File

        //Files


        public async Task<List<FileInfo>> AddFile(string listId, List<IFormFile> files)
        {
            var list = await db.FindFirstByIdAsync<ItemList>(ItemListCollection, listId);




            var filesInfoList = new List<FileInfo>();
            var filesDataList = new List<FilesData>();

            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    using (var ms = new MemoryStream())
                    {
                        file.CopyTo(ms);
                        var fileBytes = ms.ToArray();
                        string stringBase64 = Convert.ToBase64String(fileBytes);
                        ObjectId fileId = ObjectId.GenerateNewId();
                        var fileInfo = new FileInfo()
                        {
                            Id = ObjectId.GenerateNewId(),
                            Name = file.FileName,
                            Type = file.ContentType,
                            Size = file.Length,
                            FileId = fileId
                        };

                        var fileData = new FilesData()
                        {
                            Id = fileId,
                            FileString = stringBase64
                        };

                        filesInfoList.Add(fileInfo);
                        filesDataList.Add(fileData);
                    }
                }

            }

            list.Files.AddRange(filesInfoList);

            await db.FindOneAndReplaceAsync(ItemListCollection, listId, list);


            foreach (var item in filesDataList)
            {
                await db.InsertOneAsync<FilesData>(FileDataCollection, item);
            };
            return filesInfoList;

        }

        public async Task<bool> DeleteFile(string listId, string fileId)
        {
            var list = await db.FindFirstByIdAsync<ItemList>(ItemListCollection, listId);
            if (list == null) return false;


            var file = list.Files.Find(x => x.FileId == ObjectId.Parse(fileId));
            list.Files.Remove(file);

            await db.DeleteOneAsync<FilesData>(FileDataCollection, fileId);
            await db.FindOneAndReplaceAsync<ItemList>(ItemListCollection, listId, list);

            return true;
        }

        public async Task<FilesData> GetFile(string fileId)
        {
            return await db.FindFirstByIdAsync<FilesData>(FileDataCollection, fileId);
        }
        #endregion
        #region Privilages
        public async Task<bool> SendListInvite(SendInviteToListDTO inviteInfo)
        {
            MongoFilterHelper filterHelper = new MongoFilterHelper()
            {
                FilterField = "Email",
                FilterValue = inviteInfo.Receiver
            };
            var receiver = await db.FindFirstAsync<User>(UserCollection, filterHelper);

            if (receiver == null) { return false; };


            var listName = db.FindFirstByIdAsync<ItemList>(ItemListCollection, inviteInfo.Privileges.ListObjectId).Result.Name;

            var notification = new Notification
            {
                Type = "Invite",
                Receiver = inviteInfo.Receiver,
                Sender = inviteInfo.Sender,
                Header = $"New invite!",
                Body = $"You've got invite to {listName} list from {inviteInfo.Sender}!",
                CreatedAt = DateTime.Now,
                IsReaded = false,
                Privileges = new Privileges
                {
                    ListObjectId = ObjectId.Parse(inviteInfo.Privileges.ListObjectId),
                    ListPermission = new PermissionModel
                    {
                        Owner = false,
                        Read = inviteInfo.Privileges.ListPermission.Read,
                        Write = inviteInfo.Privileges.ListPermission.Write,
                        Modify = inviteInfo.Privileges.ListPermission.Modify,
                        Delete = inviteInfo.Privileges.ListPermission.Delete
                    }

                }
            };

            var helper = new MongoNestedArrayHelper<Notification>
            {
                FilterField = "Email",
                FilterValue = inviteInfo.Receiver,
                NestedArray = "Notifications",
                NestedObject = notification
            };

            await db.PushObjectToNestedArrayAsync(UserCollection, helper);

            return true;
        }


        public async Task<bool> AcceptListInvite(SendInviteToListDTO inviteInfo)
        {
            MongoFilterHelper filterHelper = new MongoFilterHelper()
            {
                FilterField = "Email",
                FilterValue = inviteInfo.Receiver
            };
            var receiver = await db.FindFirstAsync<User>(UserCollection, filterHelper);

            if (receiver == null) { return false; };

            var have = !receiver.Privileges.Where(x => x.ListObjectId == ObjectId.Parse(inviteInfo.Privileges.ListObjectId)).IsNullOrEmpty();

            if (have)
            {
                return false;
            }


            var pushFilter = new MongoNestedArrayHelper<Privileges>
            {
                FilterField = "Email",
                FilterValue = inviteInfo.Receiver,
                NestedArray = "Privileges",
                NestedObject = new Privileges
                {
                    ListObjectId = ObjectId.Parse(inviteInfo.Privileges.ListObjectId),
                    ListPermission = new PermissionModel
                    {
                        Owner = false,
                        Delete = inviteInfo.Privileges.ListPermission.Delete,
                        Modify = inviteInfo.Privileges.ListPermission.Modify,
                        Read = inviteInfo.Privileges.ListPermission.Read,
                        Write = inviteInfo.Privileges.ListPermission.Write,
                    }
                }
            };
            await db.PushObjectToNestedArrayAsync(UserCollection, pushFilter);
            return true;
        }

        public async Task<Privileges> GetUserPrivilages(string email, string listId)
        {
            try
            {
                var userFilter = new MongoFilterHelper
                {
                    FilterField = "Email",
                    FilterValue = email
                };

                var user = await db.FindFirstAsync<User>(UserCollection, userFilter);

                return user.Privileges.FirstOrDefault(x => x.ListObjectId == ObjectId.Parse(listId));

            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<List<UserPrivilagesDTO>> GetUsersListPrivilages(string email, string listId)
        {


            var userFilter = new MongoFilterHelper
            {
                FilterField = "Email",
                FilterValue = email
            };

            var user = await db.FindFirstAsync<User>(UserCollection, userFilter);
            var privileges = user.Privileges.FirstOrDefault(x => x.ListObjectId == ObjectId.Parse(listId));

            if (privileges.ListPermission.Owner == false)
                return null;

            var userPrivilegesFilter = new MongoNestedArrayHelper<User>
            {
                FilterField = "ListObjectId",
                FilterValue = listId,
                NestedArray = "Privileges"
            };
            var users = await db.FindByIdInNestedArrayAsync<User, Privileges>(UserCollection, userPrivilegesFilter);

            var data = users
              .Where(u => u.Privileges.Any(p => p.ListObjectId == ObjectId.Parse(listId)))
              .SelectMany(u => u.Privileges.Where(p => p.ListObjectId == ObjectId.Parse(listId)), (u, p) => new UserPrivilagesDTO
              {
                  Email = u.Email,
                  ListId = p.ListObjectId.ToString(),
                  Owner = p.ListPermission.Owner,
                  Read = p.ListPermission.Read,
                  Write = p.ListPermission.Write,
                  Modify = p.ListPermission.Modify,
                  Delete = p.ListPermission.Delete
              })
              .ToList();

            return data;
        }



        public async Task<bool> RemoveListPrivilages(RemovePrivilagesDTO removePrivilages, string email)
        {
            try
            {
                var userFilter = new MongoFilterHelper
                {
                    FilterField = "Email",
                    FilterValue = removePrivilages.Email
                };

                var user = await db.FindFirstAsync<User>(UserCollection, userFilter);

                var pullFilter = new MongoNestedArrayHelper<Privileges>
                {
                    FilterField = "Email",
                    FilterValue = removePrivilages.Email,
                    NestedArray = "Privileges",
                    NestedObject = user.Privileges.FirstOrDefault(x => x.ListObjectId == ObjectId.Parse(removePrivilages.ListId))
                };
                var res = await db.PullObjectFromNestedArrayAsync(UserCollection, pullFilter);

                return true;

            }
            catch (Exception ex)
            {
                return false;

            }
        }
        #endregion
    }
}