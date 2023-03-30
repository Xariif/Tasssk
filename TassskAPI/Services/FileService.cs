using MongoDB.Bson;
using MongoDB.Driver;
using TassskAPI.DTOs.File;
using TassskAPI.Models;
using ToDoAPI.DTOs.Event;
using File = TassskAPI.Models.File;

namespace TassskAPI.Services
{
    public class FileService : BaseService
    {
        public async Task<List<FileDTO>> GetFiles(string listId)
        {
            var files = await db.GetCollection<File>(FileCollection).Find(x => x.ListId == ObjectId.Parse(listId)).ToListAsync();

            return files.Select(x => new FileDTO
            {
                FileId = x.FileId.ToString(),
                Id = x.Id.ToString(),
                ListId = x.Id.ToString(),
                Name = x.Name,
                Size = x.Size,
                Type = x.Type,
            }).ToList();
        }

        public async Task<List<FileDTO>> CreateFile(string listId, List<IFormFile> files)
        {


            var filesInfoList = new List<File>();
            var filesDataList = new List<FilesData>();

            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    using (var ms = new MemoryStream())
                    {
                        file.CopyTo(ms);
                        var fileBytes = ms.ToArray();
                        string stringBase64 = Convert.ToBase64String(fileBytes);
                        ObjectId fileId = ObjectId.GenerateNewId();
                        var fileInfo = new File()
                        {
                            Id = ObjectId.GenerateNewId(),
                            Name = file.FileName,
                            Type = file.ContentType,
                            Size = file.Length,
                            FileId = fileId,
                            ListId = ObjectId.Parse(listId),
                        };

                        var fileData = new FilesData()
                        {
                            Id = fileId,
                            FileString = stringBase64
                        };

                        filesInfoList.Add(fileInfo);
                        filesDataList.Add(fileData);
                    }
                }

            }
            await db.GetCollection<File>(FileCollection).InsertManyAsync(filesInfoList);

            await db.GetCollection<FilesData>(FileDataCollection).InsertManyAsync(filesDataList);





            return filesInfoList.Select(x => new FileDTO
            {
                FileId = x.FileId.ToString(),
                Id = x.Id.ToString(),
                ListId = x.ListId.ToString(),
                Name = x.Name,
                Size = x.Size,
                Type = x.Type,
            }).ToList();

        }

        public async Task<bool> DeleteFile(string id)
        {
            var fileDataRes = await db.GetCollection<FilesData>(FileDataCollection).DeleteOneAsync(x => x.Id == ObjectId.Parse(id));
            var fileInfoRes = await db.GetCollection<File>(FileCollection).DeleteOneAsync(x => x.FileId == ObjectId.Parse(id));


            return fileInfoRes.IsAcknowledged;
        }
        public async Task<FilesData> DownloadFile(string id)
        {
          return await db.GetCollection<FilesData>(FileDataCollection).Find(x=>x.Id == ObjectId.Parse(id)).FirstOrDefaultAsync();
        }


    }
}
