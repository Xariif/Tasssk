using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TassskAPI.DTOs.Core;
using TassskAPI.DTOs.User;
using ToDoAPI.DTOs;
using ToDoAPI.DTOs.User;
using ToDoAPI.Services;

namespace ToDoAPI.Controllers
{
    public class UserController : BaseAPIController
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }
        [AllowAnonymous]
        [HttpPost("Login")]
        public ReturnResult<UserDataDTO> Login(LoginDTO loginDTO)
        {
            var result = new ReturnResult<UserDataDTO>()
            {
                Code = ResultCodes.Ok,
                Message = "Logged in!",
                Data = new UserDataDTO()
            };


            var userData = _userService.Login(loginDTO);

            if (userData != null)
            {
                result.Data = userData;
                return result;
            }

            SetReturnResult(result, ResultCodes.BadRequest, "Wrong email or password!", userData);
            return result;
        }

        [AllowAnonymous]
        [HttpPost("Register")]
        public ReturnResult<string> Register(RegisterDTO registerDTO)
        {
            var result = new ReturnResult<string>()
            {
                Code = ResultCodes.Ok,
                Message = "Register success!",
                Data = null
            };
            var newUser = _userService.Register(registerDTO);
            if (newUser != null)
                return result;


            SetReturnResult(result, ResultCodes.BadRequest, "Cannot create account!", null);
            return result;
        }


        [Authorize]
        [HttpPost("ValidateToken")]
        public ReturnResult<bool> ValidateToken()
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Ok,
                Message = "Token is valid!",
                Data = true
            };
            return result;
        }

        [Authorize]
        [HttpDelete("DeleteAccount")]
        public ReturnResult<bool> DeleteAccount(string password)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.BadRequest,
                Message = "Account delete fail!",
                Data = false
            };


            var loginDTO = new LoginDTO()
            {
                Email = GetUserEmail(),
                Password = password
            };

            if (_userService.Login(loginDTO) == null)
                return result;

            _userService.DeleteAccount(GetUserEmail());
            SetReturnResult(result, ResultCodes.BadRequest, "Account deleted!", true);

            return result;
        }



        [Authorize]
        [HttpPost("ChangeTheme")]
        public ReturnResult<bool> ChangeTheme()
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Ok,
                Message = "Theme changed!",
                Data = _userService.ChangeTheme(GetUserEmail())
            };            
            return result;

        }
        [Authorize]
        [HttpPut("ChangePassword")]
        public ActionResult ChangePassword(ChangePasswordDTO changePasswordDTO)
        {
            var loginDTO = new LoginDTO()
            {
                Email = GetUserEmail(),
                Password = changePasswordDTO.OldPassword
            };
            if (_userService.Login(loginDTO) == null)
                return BadRequest("Wrong data!");

            _userService.ChangePassword(GetUserEmail(), changePasswordDTO.NewPassword);

            return Ok("Password changed!");
        }
        //[Authorize]
        //[HttpDelete("DeleteUser")]
        //public async Task<ActionResult> DeleteUser()
        //{
        //    try
        //    {
        //        await _userService.DeleteUser(GetUserEmail());
        //        return Ok("User Deleted");

        //    }

        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}
    }
}
