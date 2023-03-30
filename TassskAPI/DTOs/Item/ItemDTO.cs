namespace TassskAPI.DTOs.Item
{
    public class ItemDTO
    {
        public string Id { get; set; }
        public string ListId { get; set; }
        public bool Finished { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Name { get; set; }

    }
}
