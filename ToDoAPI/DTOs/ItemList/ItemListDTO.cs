using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ToDoAPI.DTOs.ItemList
{
    public class ItemListDTO
    {

        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public bool Finished { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime FinishDate { get; set; }
        public List<ItemDTO> Items { get; set; } = new List<ItemDTO>();

    }
    public class ItemDTO
    {

        public string Id { get; set; }
        public bool Finished { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
