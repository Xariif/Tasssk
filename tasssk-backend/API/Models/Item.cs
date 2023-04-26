using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace TassskAPI.Models
{
    public class Item
    {
        [BsonId]
        public ObjectId Id { get; set; }
        public ObjectId ListId { get; set; }
        public bool Finished { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Name { get; set; }
    }
}
