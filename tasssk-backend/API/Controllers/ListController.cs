using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TassskAPI.DTOs.List;
using TassskAPI.DTOs.Notification;
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
        public async Task<ActionResult<UserListsDTO>> GetLists(string selectedListId)
        {
            try
            {
                var res = await _listService.GetLists(GetUserEmail(), selectedListId);

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
        [HttpPost("CreateList")]
        public async Task<ActionResult<string>> CreateList(NewListDTO newList)
        {
            try
            {
                var res = await _listService.CreateList(newList, GetUserEmail());
                return Ok(res);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
                throw;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Authorize]
        [HttpPut("UpdateList")]
        public async Task<ActionResult<bool>> UpdateList(ListDTO updateList)
        {
            try
            {
                var res = await _listService.UpdateList(updateList, GetUserEmail());
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
        [HttpDelete("DeleteList")]
        public async Task<ActionResult<bool>> DeleteList(string id)
        {
            try
            {
                var res = await _listService.DeleteList(id, GetUserEmail());
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
        [HttpPost("SendInvite")]
        public async Task<ActionResult<string>> SendInvite(SendInviteDTO sendInviteDTO)
        {
            try
            {
                var res = await _listService.SendInvite(sendInviteDTO, GetUserEmail());
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
        [HttpPost("AcceptInvite")]
        public async Task<ActionResult<string>> AcceptInvite(AcceptInviteDTO acceptInviteDTO)
        {
            try
            {
                var res = await _listService.AcceptInvite(acceptInviteDTO);
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
        [HttpGet("ListPrivileges")]
        public async Task<ActionResult<List<ListPrivileges>>> ListPrivileges(string listId)
        {
            try
            {
                var res = await _listService.ListPrivileges(listId, GetUserEmail());
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
        [HttpDelete("RemoveAccess")]
        public async Task<ActionResult<string>> RemoveAccess(string listId,string user)
        {
            try
            {
                var res = await _listService.RemoveAccess(listId, user, GetUserEmail());
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