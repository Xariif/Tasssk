using MongoDB.Bson;
using TassskAPI.DTOs.ItemList;
using TassskAPI.Helpers.Models;
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

            var privilages = new Priviliges
            {
                ListObjectId = list.Id,
                ListPermission = new PermissionModel
                {
                    Owner = true,
                    Share = true,
                    Read = true,
                    Write = true,
                    Modify = true,
                    Delete = true,
                }
            };

            //Add access to user
            var nestedHelper = new MongoNestedArrayHelper<Priviliges>
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

            //  var user = await db.FindManyAsync<User>(UserCollection, filter).Result.Select(x => x.Priviliges);

            var user = await db.FindFirstAsync<User>(UserCollection, filter);
            var listsIds = user.Priviliges.Select(x => x.ListObjectId).ToList();

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

            var userFilter = new MongoFilterHelper
            {
                FilterField = "Email",
                FilterValue = email
            };
            var user = await db.FindFirstAsync<User>(UserCollection, userFilter);

            var privilage = user.Priviliges.FirstOrDefault(x => x.ListObjectId == ObjectId.Parse(id));

            var nestedFilter = new MongoNestedArrayHelper<Priviliges>
            {
                FilterField = "Email",
                FilterValue = email,
                NestedArray = "Priviliges",
                NestedObject = privilage

            };
            await db.PullObjectFromNestedArrayAsync<Priviliges>(UserCollection, nestedFilter);
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

        #endregion
    }
}
