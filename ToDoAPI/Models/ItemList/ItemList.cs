using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ToDoAPI.Models.ItemList
{
    public class ItemList
    {
        [BsonId]
        public ObjectId Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public bool Finished { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime FinishDate { get; set; }
        public List<Item> Items { get; set; } = new List<Item>();
        public List<File64> Files { get; set; } = new List<File64>();
    }
    public class Item
    {
        [BsonId]
        public ObjectId Id { get; set; }
        public bool Finished { get; set; }
        public DateTime CreatedAt { get; set; }  
        public string Name { get; set; }
    }

    public class File64
    {
        public ObjectId Id { get; set; }
        public string Name { get; set; }
        public string  Type { get; set; }
        public long Size { get; set; }
        public string Base64 { get; set; }
    }
}
