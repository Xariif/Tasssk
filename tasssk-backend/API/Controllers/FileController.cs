using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TassskAPI.DTOs.File;
using TassskAPI.Models;
using TassskAPI.Services;

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
        public async Task<ActionResult<List<FileDTO>>> GetFiles(string listId)
        {           
            try
            {
                var res = await _fileService.GetFiles(listId);
                return Ok(res);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
           
        }
        [Authorize]
        [HttpGet("DownloadFile")]
        public async Task<ActionResult<FilesData>> DownloadFile(string fileId)
        {
            try
            {
                var res = await _fileService.DownloadFile(fileId);
                return Ok(res);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }          
        }

        [Authorize]
        [HttpPost("CreateFile")]
        public async Task<ActionResult<List<FileDTO>>> CreateFile(string listId, List<IFormFile> formData)
        {
            try
            {
                var res = await _fileService.CreateFile(listId, formData);
                return Ok(res);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }            
        }
        [Authorize]
        [HttpDelete("DeleteFile")]
        public async Task<ActionResult<bool>> DeleteFile(string fileId)
        {
            try
            {
                var res = await _fileService.DeleteFile(fileId);
                return Ok(res);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }          
        }
    }
}
