using MongoDB.Bson;

namespace TassskAPI.DTOs.User
{
    public class PrivilagesDTO
    {
        public string ListObjectId { get; set; }
        public PermissionModelDTO ListPermission { get; set; }

    }
    public class PermissionModelDTO
    {
        public bool Owner { get; set; }
        public bool Read { get; set; }
        public bool Write { get; set; }
        public bool Modify { get; set; }
        public bool Delete { get; set; }
    }
}
