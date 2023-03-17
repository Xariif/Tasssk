using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection.Metadata.Ecma335;
using TassskAPI.Models.Notification;
using ToDoAPI.Models.ItemList;

namespace ToDoAPI.Models.User
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public ObjectId Id { get; set; }
        public string Email { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }

        public DateTime BirthDate { get; set; }
        public bool DarkMode { get; set; } = false;
        public List<Notification> Notifications { get; set; } = new List<Notification>();
        public List<Priviliges> Priviliges { get; set; } = new List<Priviliges>();

    }

    public class Priviliges
    {
        public ObjectId ListObjectId { get; set; }
        public PermissionModel ListPermission { get; set; }

    }
    public class PermissionModel
    {
        public bool Owner { get; set; }
        public bool Read { get; set; }
        public bool Write { get; set; }
        public bool Modify { get; set; }
        public bool Delete { get; set; }
    }



}