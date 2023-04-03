using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TassskAPI.DTOs.Core;
using TassskAPI.DTOs.List;
using TassskAPI.DTOs.Notification;
using TassskAPI.Models;
using TassskAPI.Services;
using ToDoAPI.Controllers;

namespace TassskAPI.Controllers
{
    public class NotificationController : BaseAPIController
    {
        private readonly NotificationService _notificationService;
        public NotificationController(NotificationService notificationService)
        {
            _notificationService = notificationService;
        }
        [Authorize]
        [HttpGet("GetNotifications")]
        public async Task<ReturnResult<List<NotificationDTO>>> Notifications()
        {
            var result = new ReturnResult<List<NotificationDTO>>()
            {
                Code = ResultCodes.Ok,
                Message = "Notifications List",
                Data = null
            };

            result.Data = await _notificationService.GetNotifications(GetUserEmail());
        
            return result;
        }

        [Authorize]
        [HttpGet("GetInviteNotification")]
        public async Task<ReturnResult<InviteNotificationDTO>> GetInviteNotification(string id)
        {
            var result = new ReturnResult<InviteNotificationDTO>()
            {
                Code = ResultCodes.Ok,
                Message = "Notifications List",
                Data = null
            };

            result.Data = await _notificationService.GetInviteNotification(id);

            return result;
        }



        [Authorize]
        [HttpPost("CreateNotification")]
        public async Task<ReturnResult<bool>> CreateNotification(NewNotificationDTO newNotification)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Ok,
                Message = "Notification created",
                Data = true
            };

            await _notificationService.CreateNotification(newNotification.Email, newNotification.Header, newNotification.Body);
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

            await _notificationService.DeleteNotification(notificationId);
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

            await _notificationService.SetNotificationReaded(notificationId);
            return result;
        }
    }
}
