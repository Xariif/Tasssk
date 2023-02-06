using System;
using MongoDB.Bson;

namespace ToDoAPI.Models
{
    public class FileData
    {
        public ObjectId Id { get; set; }
        public string FileString { get; set; }
    }
}

