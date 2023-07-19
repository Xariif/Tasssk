using MongoDB.Bson;

namespace TassskAPI.DTOs.Notification
{
    public class NotificationDTO
    {
        public string Id { get; set; } 
        public string Header { get; set; }
        public string Body { get; set; }
        public string Type { get; set; }
        public bool IsReaded { get; set; }
        public string Receiver { get; set; }
        public DateTime CreatedAt { get; set; }
        
    }
}
