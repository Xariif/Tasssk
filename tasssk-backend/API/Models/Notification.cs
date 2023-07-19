using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using Microsoft.EntityFrameworkCore;

namespace TassskAPI.Models
{
    public class Notification
    {
        public ObjectId Id { get; set; } = ObjectId.GenerateNewId();
        public string Header { get; set; }
        public string Body { get; set; }
        public string Type { get; set; }
        public bool IsReaded { get; set; } = false;
        public string Sender { get; set; }
        public string Receiver { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
   
    public class InviteNotification : Notification
    {        
        public ObjectId ListId { get; set; }
        public Privileges Privileges{ get; set; }
    }
}

