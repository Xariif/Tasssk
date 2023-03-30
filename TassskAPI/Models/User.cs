using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TassskAPI.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }
        public string Email { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public DateTime BirthDate { get; set; }
        public bool DarkMode { get; set; } = false;
    }
}