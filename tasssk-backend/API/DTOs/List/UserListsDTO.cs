using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using TassskAPI.DTOs.Item;

namespace TassskAPI.DTOs.List
{
    public class UserListsDTO
    {
        public List<UserListDTO> Lists { get; set; }
    }

    public class UserListDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public bool Finished { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime FinishDate { get; set; }
        public List<ItemDTO> Items { get; set; }
        public bool CanEdit { get; set; }
        public bool CanDelete { get; set; }
        public bool IsSelected { get; set; }
        public bool IsOwner { get; set; }
    }

}
