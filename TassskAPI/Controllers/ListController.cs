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
        public async Task<ReturnResult<UserListsDTO>> GetLists(string selectedItemId)
        {
            try
            {
                var result = new ReturnResult<UserListsDTO>()
                {
                    Code = ResultCodes.Ok,
                    Message = "Lists",
                    Data = null
                };
                result.Data = await _listService.GetLists(GetUserEmail(), selectedItemId);

                return result;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        [Authorize]
        [HttpPost("CreateList")]
        public async Task<ReturnResult<string>> CreateList(NewListDTO newList)
        {
            var result = new ReturnResult<string>()
            {
                Code = ResultCodes.Ok,
                Message = "List created",
                Data = null
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

            if(sendInviteDTO.Receiver == GetUserEmail()) 
            {
                SetReturnResult(result, ResultCodes.BadRequest, "You cannot send invite to yourself", false);
                return result;
            }

            result.Data =   await _listService.SendInvite(sendInviteDTO,GetUserEmail());

            if (result.Data == false)
                SetReturnResult(result, ResultCodes.BadRequest, "User not exist", false);


            return result;
        }
        [Authorize]
        [HttpPost("AcceptInvite")]
        public async Task<ReturnResult<bool>> AcceptInvite(AcceptInviteDTO acceptInviteDTO)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Ok,
                Message = "Invite accepted",
                Data = true
            };

            result.Data = await _listService.AcceptInvite(acceptInviteDTO);

            if (result.Data == false)
                SetReturnResult(result, ResultCodes.BadRequest, "This list no longer exist", false);

            return result;
        }     
    }
}