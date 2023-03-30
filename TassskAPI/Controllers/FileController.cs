using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TassskAPI.DTOs.Core;
using TassskAPI.DTOs.File;
using TassskAPI.Models;
using TassskAPI.Services;
using ToDoAPI.Controllers;
using ToDoAPI.Services;

namespace TassskAPI.Controllers
{
    public class FileController : BaseAPIController
    {
        private readonly FileService _fileService;

        public FileController(FileService fileService)
        {
            _fileService = fileService;
        }
        [Authorize]
        [HttpGet("GetFiles")]
        public async Task<ReturnResult<List<FileDTO>>> GetFiles(string listId)
        {
            var result = new ReturnResult<List<FileDTO>>()
            {
                Code = ResultCodes.Ok,
                Message = "Files",
                Data = new List<FileDTO>() 
            };
            try
            {

                result.Data = await _fileService.GetFiles(listId);

                return result;

            }
            catch (Exception)
            {
                SetReturnResult(result, ResultCodes.BadRequest, "File by id fail", null);
                return result;
            }
        }
        [Authorize]
        [HttpGet("DownloadFile")]
        public async Task<ReturnResult<FilesData>> DownloadFile(string fileId)
        {
            var result = new ReturnResult<FilesData>()
            {
                Code = ResultCodes.Ok,
                Message = "File Data",
            };
            try
            {

                result.Data = await _fileService.DownloadFile(fileId);
                return result;

            }
            catch (Exception)
            {
                SetReturnResult(result, ResultCodes.BadRequest, "File download fail", null);
                return result;
            }
        }

        [Authorize]
        [HttpPost("CreateFile")]
        public async Task<ReturnResult<List<FileDTO>>> CreateFile(string listId, List<IFormFile> formData)
        {
            var result = new ReturnResult<List<FileDTO>>()
            {
                Code = ResultCodes.Ok,
                Message = "File created",
                Data = new List<FileDTO>()
            };

            try
            {
                result.Data = await _fileService.CreateFile(listId, formData);            
                return result;
            }
            catch (Exception)
            {
                SetReturnResult(result, ResultCodes.BadRequest, "File create fail", null);

                return result;
            }


        }
        [Authorize]
        [HttpDelete("DeleteFile")]
        public async Task<ReturnResult<bool>> DeleteFile(string fileId)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Ok,
                Message = "File deleted",
                Data = true
            };
            try
            {

                await _fileService.DeleteFile(fileId);

                return result;

            }
            catch (Exception)
            {
                SetReturnResult(result, ResultCodes.BadRequest, "File delete fail", false);
                return result;
            }
        }
    }
}
