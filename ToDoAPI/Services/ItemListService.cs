using MongoDB.Bson;
using ToDoAPI.DTOs;
using ToDoAPI.Helpers;
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
        public bool AddList(NewListDTO newList, string email)
        {

            var listsNames = db.FindListsByEmail<ItemList>(ItemListCollection, email).Select(x => x.Name);

            foreach (var listName in listsNames)
            {
                if (listName.Equals(newList.Name))
                    return false;
            }
            var list = new ItemList
            {
                Id = ObjectId.GenerateNewId(),
                Name = newList.Name.Trim(),
                Email = email.Trim(),
                Finished = false,
                FinishDate = newList.FinishDate,
                CreatedDate = DateTime.Now,
                Items = new List<Item>()
            };

            db.InsertRecord(ItemListCollection, list);
            return true;
        }
        public List<ItemList> GetListsByEmail(string email)
        {
            return db.FindListsByEmail<ItemList>(ItemListCollection, email);
        }
        public ItemList GetListById(ObjectId id)
        {
            return db.FindFisrtById<ItemList>(ItemListCollection, id);
        }
        public void UpdateList(ObjectId id, ItemList list)
        {
            db.UpsertRecord<ItemList>(ItemListCollection, id, list);
        }
        public void DeleteList(ObjectId id)
        {
            db.DeleteRecord<ItemList>(ItemListCollection, id);
        }

        //Items 

        public void AddItem(string listId, string itemName)
        {
            var list = db.FindFisrtById<ItemList>(ItemListCollection, ObjectId.Parse(listId));

            var item = new Item
            {
                Finished = false,
                Id = ObjectId.GenerateNewId(),
                Name = itemName,
                CreatedAt = DateTime.Now
            };

            list.Items.Add(item);

            db.UpsertRecord(ItemListCollection, ObjectId.Parse(listId), list);
        }

        public void DeleteItem(string listId, string itemId)
        {
            var list = db.FindFisrtById<ItemList>(ItemListCollection, ObjectId.Parse(listId));

            list.Items.RemoveAll(x => x.Id == ObjectId.Parse(itemId));

            db.UpsertRecord(ItemListCollection, ObjectId.Parse(listId), list);
        }
        public bool UpdateItem(string listId, Item item)
        {
            try
            {
                var list = db.FindFisrtById<ItemList>(ItemListCollection, ObjectId.Parse(listId));

                list.Items.RemoveAll(x => x.Id == item.Id);
                list.Items.Add(item);

                db.UpsertRecord(ItemListCollection, ObjectId.Parse(listId), list);
                return true;
            }
            catch
            {
                return false;
            }
        }


        //Files


        public void AddFile(string listId, List<IFormFile> files)
        { 
            var list = db.FindFisrtById<ItemList>(ItemListCollection, ObjectId.Parse(listId));


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

            db.UpsertRecord(ItemListCollection, ObjectId.Parse(listId), list);


            foreach (var item in filesDataList)
            {
                db.InsertRecord<FileData>(FileDataCollection, item);
            };

        }

        public bool DeleteFile(string listId, string fileId)
        {
            var list = db.FindFisrtById<ItemList>(ItemListCollection, ObjectId.Parse(listId));
            if (list == null) return false;


            var file = list.Files.Find(x=>x.FileId == ObjectId.Parse(fileId));
            list.Files.Remove(file);

            db.DeleteRecord<FileData>(FileDataCollection, ObjectId.Parse(fileId));
            db.UpsertRecord<ItemList>(ItemListCollection, ObjectId.Parse(listId), list);

            return true;
        }
    }
}
