using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TassskAPI.DTOs.Core;
using TassskAPI.DTOs.Notification;
using TassskAPI.Models.Notification;
using TassskAPI.Services;
using ToDoAPI.Controllers;
using ToDoAPI.Services;

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
        [HttpGet("Notifications")]
        public async Task<ReturnResult<List<NotificationDTO>>> Notifications()
        {

            var data = await _notificationService.GetNotifications(GetUserEmail());

            var list = new List<NotificationDTO>();

            foreach (var notification in data)
            {

                PriviligesDTO priviligesDTO = null;

                if (notification.Privileges != null)
                {
                    priviligesDTO = new PriviligesDTO
                    {
                        ListObjectId = notification.Privileges.ListObjectId.ToString(),
                        ListPermission = notification.Privileges.ListPermission
                    };
                }

                NotificationDTO notificationDTO = new NotificationDTO
                {
                    Id = notification.Id.ToString(),
                    Type = notification.Type,
                    CreatedAt = notification.CreatedAt,
                    Header = notification.Header,
                    Body = notification.Body,
                    IsReaded = notification.IsReaded,
                    Sender = notification.Sender,
                    Receiver = notification.Receiver,
                    Privileges = priviligesDTO

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

            await _notificationService.AddNotification(newNotification.Email, newNotification.Header, newNotification.Body);
            return result;
        }

        [Authorize]
        [HttpPost("AddInviteNotification")]
        public async Task<ReturnResult<bool>> AddInviteNotification(NewNotificationDTO newNotification)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Ok,
                Message = "Invite sent",
                Data = true
            };

            await _notificationService.AddNotification(newNotification.Email, newNotification.Header, newNotification.Body);
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

            await _notificationService.DeleteNotification(GetUserEmail(), notificationId);
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

            await _notificationService.SetNotificationReaded(GetUserEmail(), notificationId);
            return result;
        }
    }
}
