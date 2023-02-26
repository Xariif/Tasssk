using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TassskAPI.DTOs.Core;
using TassskAPI.DTOs.ItemList;
using TassskAPI.DTOs.User;
using ToDoAPI.DTOs;
using ToDoAPI.DTOs.User;
using ToDoAPI.Models.User;
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
        public async Task<ReturnResult<UserDataDTO>> Login(LoginDTO loginDTO)
        {
            var result = new ReturnResult<UserDataDTO>()
            {
                Code = ResultCodes.Ok,
                Message = "Logged in!",
                Data = new UserDataDTO()
            };

            var userData = await _userService.Login(loginDTO);

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
        public async Task<ReturnResult<bool>> DeleteAccount(string password)
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

            await _userService.DeleteAccount(GetUserEmail());
            SetReturnResult(result, ResultCodes.BadRequest, "Account deleted!", true);

            return result;
        }
        [Authorize]
        [HttpPost("ChangeTheme")]
        public async Task<ReturnResult<bool>> ChangeTheme()
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Ok,
                Message = "Theme changed!",
                Data = await _userService.ChangeTheme(GetUserEmail())
            };
            return result;

        }
        [Authorize]
        [HttpPut("ChangePassword")]
        public async Task<ActionResult> ChangePassword(ChangePasswordDTO changePasswordDTO)
        {
            var loginDTO = new LoginDTO()
            {
                Email = GetUserEmail(),
                Password = changePasswordDTO.OldPassword
            };
            if (_userService.Login(loginDTO) == null)
                return BadRequest("Wrong data!");

            await _userService.ChangePassword(GetUserEmail(), changePasswordDTO.NewPassword);

            return Ok("Password changed!");
        }


        [Authorize]
        [HttpGet("Notifications")]
        public async Task<ReturnResult<List<NotificationDTO>>> Notifications()
        {

            var data = await _userService.GetNotifications(GetUserEmail());

            var list = new List<NotificationDTO>();

            foreach (var notification in data)
            {
                NotificationDTO notificationDTO = new NotificationDTO
                {
                    Id = notification.Id.ToString(),
                    CreatedAt = notification.CreatedAt,
                    Header = notification.Header,
                    Body = notification.Body,
                    IsReaded = notification.IsReaded
                };
                list.Add(notificationDTO);
            }

            var result = new ReturnResult<List<NotificationDTO>>()
            {
                Code = ResultCodes.Ok,
                Message = "Notifications List",
                Data = list.OrderByDescending(x => x.CreatedAt).ToList()
            };

            return result;
        }

        [Authorize]
        [HttpPost("AddNotification")]
        public async Task<ReturnResult<bool>> AddNotification(NewNotificationDTO newNotification)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Ok,
                Message = "Notification created",
                Data = true
            };

            await _userService.AddNotification(newNotification.Email, newNotification.Header, newNotification.Body);
            return result;
        }

        [Authorize]
        [HttpDelete("DeleteNotification")]
        public async Task<ReturnResult<bool>> DeleteNotification(string notificationId)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Ok,
                Message = "Notification deleted",
                Data = true
            };

            await _userService.DeleteNotification(GetUserEmail(), notificationId);
            return result;
        }
        [Authorize]
        [HttpPut("SetNotificationReaded")]
        public async Task<ReturnResult<bool>> SetNotificationReaded(string notificationId)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Ok,
                Message = "Notification readed",
                Data = true
            };

            await _userService.SetNotificationReaded(GetUserEmail(), notificationId);
            return result;
        }
    }

}
