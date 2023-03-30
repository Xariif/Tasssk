using MongoDB.Bson;

namespace TassskAPI.Models
{
    public class File
    {
        public ObjectId Id { get; set; }
        public ObjectId ListId { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public long Size { get; set; }
        public ObjectId FileId { get; set; }
    }
}
