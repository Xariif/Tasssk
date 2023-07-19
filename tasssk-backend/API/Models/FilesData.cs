using System;
using MongoDB.Bson;

namespace TassskAPI.Models
{
    public class FilesData
    {
        public ObjectId Id { get; set; }
        public string FileString { get; set; }
    }
}

