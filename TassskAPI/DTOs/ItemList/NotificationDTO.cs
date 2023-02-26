namespace TassskAPI.DTOs.ItemList
{
    public class NotificationDTO
    {
        public string Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Header { get; set; }
        public string Body { get; set; }
        public bool IsReaded { get; set; }
    }
}
