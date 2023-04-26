using TassskAPI.Models;

namespace TassskAPI.DTOs.Notification
{
    public class AcceptInviteDTO
    {
        public string ListId { get; set; }
        public Privileges Privileges { get; set; }
    }
}
