namespace TassskAPI.DTOs.ItemList
{
    public class UserPrivilagesDTO
    {
        public string Email { get; set; }
        public string ListId { get; set; }

        public bool Owner { get; set; }
        public bool Read { get; set; }
        public bool Write { get; set; }
        public bool Modify { get; set; }
        public bool Delete { get; set; }
    }
}
