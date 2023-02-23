using MongoDB.Bson;
using ToDoAPI.DTOs;
using ToDoAPI.Helpers;
using ToDoAPI.Helpers.Models;
using ToDoAPI.Models;
using ToDoAPI.Models.ItemList;
using FileInfo = ToDoAPI.Models.ItemList.FileInfo;

namespace ToDoAPI.Services
{
    public class ItemListService
    {
        private readonly MongoCRUD db;
        private readonly string ItemListCollection;
        private readonly string FileDataCollection;
        public ItemListService()
        {
            ItemListCollection = "ItemList";
            FileDataCollection = "FileData";
            db = new MongoCRUD();
        }
        public async Task<bool> AddList(NewListDTO newList, string email)
        {

            var nameExist = await db.FindFirstAsync<ItemList>(ItemListCollection, new MongoFilterHelper("Name", newList.Name));

            if (nameExist != null)
                return false;

            var list = new ItemList
            {
                Id = ObjectId.GenerateNewId(),
                Name = newList.Name.Trim(),
                Email = email.Trim(),
                Finished = false,
                FinishDate = newList.FinishDate,
                CreatedDate = DateTime.Now,
                Items = new List<Item>(),
                Files = new List<FileInfo>()
            };

            await db.InsertOneAsync(ItemListCollection, list);
            return true;
        }
        public async Task<List<ItemList>> GetListsByEmail(string email)
        {
            return await db.FindManyAsync<ItemList>(ItemListCollection, new MongoFilterHelper("Email", email));
        }



        public async Task<List<ItemList>> GetListsByEmailAsync(string email)
        {
            return await db.FindManyAsync<ItemList>(ItemListCollection, new MongoFilterHelper("Email", email));
        }

        public async Task<ItemList> GetListById(string id)
        {
            return await db.FindFirstByIdAsync<ItemList>(ItemListCollection, id);
        }
        public async Task UpdateList(string id, ItemList list)
        {
            await db.FindOneAndReplaceAsync<ItemList>(ItemListCollection, id, list);
        }
        public async Task DeleteList(string id)
        {
            var files = db.FindFirstByIdAsync<ItemList>(ItemListCollection, id).Result.Files;

            foreach (var file in files)
            {
                await db.DeleteOneAsync<FileData>(FileDataCollection, file.FileId.ToString());
            }

            await db.DeleteOneAsync<ItemList>(ItemListCollection, id);
        }

        //Items 

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


        //Files


        public async Task<List<FileInfo>> AddFile(string listId, List<IFormFile> files)
        {
            var list = await db.FindFirstByIdAsync<ItemList>(ItemListCollection, listId);




            var filesInfoList = new List<FileInfo>();
            var filesDataList = new List<FileData>();

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

                        var fileData = new FileData()
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
                await db.InsertOneAsync<FileData>(FileDataCollection, item);
            };
            return filesInfoList;

        }

        public async Task<bool> DeleteFile(string listId, string fileId)
        {
            var list = await db.FindFirstByIdAsync<ItemList>(ItemListCollection, listId);
            if (list == null) return false;


            var file = list.Files.Find(x => x.FileId == ObjectId.Parse(fileId));
            list.Files.Remove(file);

            await db.DeleteOneAsync<FileData>(FileDataCollection, fileId);
            await db.FindOneAndReplaceAsync<ItemList>(ItemListCollection, listId, list);

            return true;
        }

        public async Task<FileData> GetFile(string fileId)
        {
            return await db.FindFirstByIdAsync<FileData>(FileDataCollection, fileId);
        }
    }
}
