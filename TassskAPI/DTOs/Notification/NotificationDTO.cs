using MongoDB.Bson;
using ToDoAPI.Models.User;

namespace TassskAPI.DTOs.Notification
{
    public class NotificationDTO
    {
        public string Id { get; set; }
        public string Type { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Header { get; set; }
        public string Body { get; set; }
        public bool IsReaded { get; set; }  
        public string Sender { get; set; }
        public string Receiver { get; set; }
        public PriviligesDTO Privileges { get; set; }
    }
    public class PriviligesDTO
    {
        public string ListObjectId { get; set; }
        public PermissionModel ListPermission { get; set; }

    }
}
