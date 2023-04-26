using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TassskAPI.DTOs.Core;

namespace ToDoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseAPIController : ControllerBase
    {
        protected string GetUserEmail()
        {
            return this.User.Claims.First().Value;
        }

        protected void SetReturnResult<T>(ReturnResult<T> returnResult, ResultCodes code, string message, T data)
        {
            returnResult.Code = code;
            returnResult.Message = message;
            returnResult.Data = data;
        }
    }
}
