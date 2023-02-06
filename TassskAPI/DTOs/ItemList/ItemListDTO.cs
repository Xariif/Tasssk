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
        public List<FileInfoDTO> Files { get; set; } = new List<FileInfoDTO>();

    }
    public class ItemDTO
    {

        public string Id { get; set; }
        public bool Finished { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
    }
    public class FileInfoDTO
    {

        public string Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public long Size { get; set; }
        public string FileId { get; set; }
    }
}
