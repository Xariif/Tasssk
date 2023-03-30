using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TassskAPI.DTOs;
using TassskAPI.DTOs.Core;
using TassskAPI.DTOs.List;
using TassskAPI.DTOs.Notification;
using TassskAPI.Models;
using TassskAPI.Services;

namespace ToDoAPI.Controllers
{
    public class ListController : BaseAPIController
    {
        private readonly ListService _listService;

        public ListController(ListService listsService)
        {
            _listService = listsService;
        }

        [Authorize]
        [HttpGet("GetLists")]
        public async Task<ReturnResult<List<ListDTO>>> GetLists()
        {
            var result = new ReturnResult<List<ListDTO>>()
            {
                Code = ResultCodes.Ok,
                Message = "Lists",
                Data = new List<ListDTO>()
            };
            result.Data = await _listService.GetLists(GetUserEmail());

            return result;
        }

        [Authorize]
        [HttpPost("CreateList")]
        public async Task<ReturnResult<bool>> CreateList(NewListDTO newList)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Ok,
                Message = "List created",
                Data = true
            };

            result.Data = await _listService.CreateList(newList, GetUserEmail());

            return result;
        }
        [Authorize]
        [HttpPut("UpdateList")]
        public async Task<ReturnResult<bool>> UpdateList(ListDTO updateList)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Ok,
                Message = "List updated",
                Data = true
            };

            result.Data = await _listService.UpdateList(updateList, GetUserEmail());

            return result;
        }

        [Authorize]
        [HttpDelete("DeleteList")]
        public async Task<ReturnResult<bool>> DeleteList(string id)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Ok,
                Message = "List deleted",
                Data = true
            };

            result.Data = await _listService.DeleteList(id, GetUserEmail());

            return result;
        }

        [Authorize]
        [HttpPost("SendInvite")]
        public async Task<ReturnResult<bool>> SendInvite(SendInviteDTO sendInviteDTO)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Ok,
                Message = "Invite sent",
                Data = true
            };

            //   await _notificationService.AddNotification(newNotification.Email, newNotification.Header, newNotification.Body);
            return result;
        }
        [Authorize]
        [HttpPost("AcceptInvite")]
        public async Task<ReturnResult<bool>> AcceptInvite(NewNotificationDTO newNotification)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Ok,
                Message = "Invite accepted",
                Data = true
            };

            //await _notificationService.AcceptInvite(newNotification.Email, newNotification.Header, newNotification.Body);
            return result;
        }

    }
}