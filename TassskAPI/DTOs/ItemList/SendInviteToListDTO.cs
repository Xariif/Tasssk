using TassskAPI.DTOs.User;
using ToDoAPI.Models.User;

namespace TassskAPI.DTOs.ItemList
{
    public class SendInviteToListDTO
    {
        public string Sender { get; set; }
        public string Receiver { get; set; }
        public PrivilagesDTO Privileges { get; set; }
    }
}
