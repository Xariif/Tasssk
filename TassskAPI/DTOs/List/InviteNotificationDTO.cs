using MongoDB.Bson;
using TassskAPI.Models;

namespace TassskAPI.DTOs.List
{
    public class InviteNotificationDTO
    {
        public string ListId { get; set; }
        public Privileges Privileges { get; set; }
    }
}
