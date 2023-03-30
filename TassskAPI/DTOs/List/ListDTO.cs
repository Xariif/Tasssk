using MongoDB.Bson.Serialization.Attributes;

namespace TassskAPI.DTOs.List
{

    public class ListDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public bool Finished { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime FinishDate { get; set; }
        public List<PrivilegesDTO> Privileges { get; set; }
    }


    public class PrivilegesDTO
    {
        public string UserId { get; set; }
        public bool Owner { get; set; }
        public bool Read { get; set; }
        public bool Write { get; set; }
        public bool Modify { get; set; }
        public bool Delete { get; set; }

    }
}

