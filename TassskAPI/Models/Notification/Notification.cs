using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using ToDoAPI.Models.User;
using Microsoft.EntityFrameworkCore;

namespace TassskAPI.Models.Notification
{
    public class Notification
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; } = ObjectId.GenerateNewId();
        public string Type { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string Header { get; set; }
        public string Body { get; set; }
        public bool IsReaded { get; set; } = false;
        public string Sender { get; set; }
        public string Receiver { get; set; }
        public Priviliges Priviliges { get; set; }
    }
}

