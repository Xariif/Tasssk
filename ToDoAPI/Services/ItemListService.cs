using MongoDB.Bson;
using ToDoAPI.DTOs;
using ToDoAPI.Helpers;
using ToDoAPI.Models.ItemList;

namespace ToDoAPI.Services
{
    public class ItemListService
    {
        private readonly MongoCRUD db;
        private readonly string collectionName;
        public ItemListService()
        {
            collectionName = "ItemList";
            db = new MongoCRUD();
        }
        public bool AddList(NewListDTO newList, string email)
        {

            var listsNames = db.FindListsByEmail<ItemList>(collectionName, email).Select(x => x.Name);

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

            db.InsertRecord(collectionName, list);
            return true;
        }
        public List<ItemList> GetListsByEmail(string email)
        {
            return db.FindListsByEmail<ItemList>(collectionName, email);
        }
        public ItemList GetListById(ObjectId id)
        {
            return db.FindFisrtById<ItemList>(collectionName, id);
        }
        public void UpdateList(ObjectId id, ItemList list)
        {
            db.UpsertRecord<ItemList>(collectionName, id, list);
        }
        public void DeleteList(ObjectId id)
        {
            db.DeleteRecord<ItemList>(collectionName, id);
        }

        //Items 

        public void AddItem(string listId, string itemName)
        {
            var list = db.FindFisrtById<ItemList>(collectionName, ObjectId.Parse(listId));

            var item = new Item
            {
                Finished = false,
                Id = ObjectId.GenerateNewId(),
                Name = itemName,
                CreatedAt = DateTime.Now
            };

            list.Items.Add(item);

            db.UpsertRecord(collectionName, ObjectId.Parse(listId), list);
        }

        public void DeleteItem(string listId, string itemId)
        {
            var list = db.FindFisrtById<ItemList>(collectionName, ObjectId.Parse(listId));

            list.Items.RemoveAll(x => x.Id == ObjectId.Parse(itemId));

            db.UpsertRecord(collectionName, ObjectId.Parse(listId), list);
        }
        public bool UpdateItem(string listId, Item item)
        {
            try
            {
                var list = db.FindFisrtById<ItemList>(collectionName, ObjectId.Parse(listId));

                list.Items.RemoveAll(x => x.Id == item.Id);
                list.Items.Add(item);

                db.UpsertRecord(collectionName, ObjectId.Parse(listId), list);
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
            var list = db.FindFisrtById<ItemList>(collectionName, ObjectId.Parse(listId));


            var filesList = new List<File64>();

            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    using (var ms = new MemoryStream())
                   {
                        file.CopyTo(ms);
                        var fileBytes = ms.ToArray();
                        string stringBase64 = Convert.ToBase64String(fileBytes);

                        var fileDTO = new File64
                        {
                            Id = ObjectId.GenerateNewId(),
                            Name = file.FileName,
                            Type = file.ContentType,
                            Size = file.Length,
                            Base64 = stringBase64
                        };

                        filesList.Add(fileDTO);

                    }
                }

            }


           

            list.Files.AddRange(filesList);

            db.UpsertRecord(collectionName, ObjectId.Parse(listId), list);
        }
    }
}
