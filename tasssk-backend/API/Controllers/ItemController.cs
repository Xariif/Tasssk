using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TassskAPI.DTOs.Item;
using TassskAPI.Services;

namespace TassskAPI.Controllers
{
    public class ItemController : BaseAPIController
    {
        private readonly ItemService _itemService;

        public ItemController(ItemService itemService)
        {
            _itemService = itemService;
        }

        [Authorize]
        [HttpGet("GetItems")]
        public async Task<ActionResult<List<ItemDTO>>> GetItems(string listId)
        {
            try
            {
                var res = await _itemService.GetItems(listId);
    
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
        [HttpPost("CreateItem")]
        public async Task<ActionResult<bool>> CreateItem(CreateItemDTO newItem)
        {
            try
            {
                var res = await _itemService.CreateItem(newItem);
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
        [HttpPut("UpdateItem")]
        public async Task<ActionResult<bool>> UpdateItem(ItemDTO updateItem)
        {
            try
            {
                var res = await _itemService.UpdateItem(updateItem);
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
        [HttpDelete("DeleteItem")]
        public async Task<ActionResult<bool>> DeleteItem(ItemDTO deleteItem)
        {
            try
            {
                var res = await _itemService.DeleteItem(deleteItem);
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
