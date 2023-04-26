using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TassskAPI.Models
{
    public class List
    {
        [BsonId]
        public ObjectId Id { get; set; }
        public string Name { get; set; }
        public bool Finished { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime FinishDate { get; set; }
        public List<Privileges> Privileges { get; set;}
    }       


    public class Privileges
    {
        public string Email { get; set; }
        public bool Owner { get; set; }
        public bool Read { get; set; }
        public bool Write { get; set; }
        public bool Modify { get; set; }
        public bool Delete { get; set; }

    }
}
