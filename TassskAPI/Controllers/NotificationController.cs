using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TassskAPI.DTOs.Core;
using TassskAPI.DTOs.List;
using TassskAPI.DTOs.Notification;
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
        public async Task<ActionResult<List<NotificationDTO>>> Notifications()
        {
            try
            {
                var res = await _notificationService.GetNotifications(GetUserEmail());
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
        [HttpGet("GetInviteNotification")]
        public async Task<ActionResult<InviteNotificationDTO>> GetInviteNotification(string id)
        {
            try
            {
                var res = await _notificationService.GetInviteNotification(id);
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
        [HttpPost("CreateNotification")]
        public async Task<ActionResult<bool>> CreateNotification(NewNotificationDTO newNotification)
        {
            try
            {
                var res = await _notificationService.CreateNotification(newNotification.Email, newNotification.Header, newNotification.Body);
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
        [HttpDelete("DeleteNotification")]
        public async Task<ActionResult<bool>> DeleteNotification(string notificationId)
        {
            try
            {
                var res = await _notificationService.DeleteNotification(notificationId);
                return Ok(res);
            }
            catch (ArgumentException ex)
            {
                    return  BadRequest(ex.Message);              
            }
            catch (Exception ex)
            { 
                return BadRequest(ex.Message);
            }
        }
        [Authorize]
        [HttpPut("SetNotificationReaded")]
        public async Task<ActionResult<bool>> SetNotificationReaded(string notificationId)
        {
            try
            {
               var res =  await _notificationService.SetNotificationReaded(notificationId);
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
