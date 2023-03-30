using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TassskAPI.DTOs.Core;
using TassskAPI.DTOs.Item;
using TassskAPI.Models;
using TassskAPI.Services;
using ToDoAPI.Controllers;
using ToDoAPI.DTOs;
using ToDoAPI.Services;

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
        public async Task<ReturnResult<List<ItemDTO>>> GetItems(string listId)
        {
            var result = new ReturnResult<List<ItemDTO>>()
            {
                Code = ResultCodes.Ok,
                Message = "Items",
                Data = new List<ItemDTO>()
            };
            result.Data = await _itemService.GetItems(listId);

            return result;
        }

        [Authorize]
        [HttpPost("CreateItem")]
        public async Task<ReturnResult<bool>> CreateItem(CreateItemDTO newItem)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Ok,
                Message = "Item created",
                Data = true
            };

            result.Data = await _itemService.CreateItem(newItem);
            return result;
        }
        [Authorize]
        [HttpPut("UpdateItem")]
        public async Task<ReturnResult<bool>> UpdateItem(ItemDTO updateItem)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Ok,
                Message = "Item updated",
                Data = true
            };

            result.Data = await _itemService.UpdateItem(updateItem);
            return result;
        }

        [Authorize]
        [HttpDelete("DeleteItem")]
        public async Task<ReturnResult<bool>> DeleteItem(ItemDTO deleteItem)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Ok,
                Message = "Item deleted",
                Data = true
            };

            result.Data = await _itemService.DeleteItem(deleteItem);

            return result;
        }
    }
}
