﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using ToDoAPI.DTOs;
using ToDoAPI.DTOs.Core;
using ToDoAPI.DTOs.ItemList;
using ToDoAPI.Models.ItemList;
using ToDoAPI.Services;

namespace ToDoAPI.Controllers
{
    public class ItemListController : BaseAPIController
    {
        private readonly ItemListService _listsService;

        public ItemListController(ItemListService listsService)
        {
            _listsService = listsService;
        }


        [Authorize]
        [HttpPost("AddList")]
        public ReturnResult<bool> AddList(NewListDTO newList)
        {
            newList.Name.Trim();

            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Fail,
                Message = "Fail",
                Data = false
            };
            if (newList.Name== null || newList.Name == string.Empty  )
            {
                SetReturnResult(result, ResultCodes.Fail, "Name is empty", false);
                return result;
            }
            else if (newList.FinishDate.AddHours(2) <= DateTime.Now)
            {
                SetReturnResult(result, ResultCodes.Fail, "Finish date error", false);
                return result;
            }

            var res = _listsService.AddList(newList, GetUserEmail());

            if (res)
            {
                SetReturnResult(result, ResultCodes.Ok, "List added correctly", true);
                return result;
            }


            SetReturnResult(result, ResultCodes.Fail, "List already exist", false);

            return result;
        }

        [Authorize]
        [HttpGet("GetLists")]
        public ReturnResult<List<ItemListDTO>> GetList()
        {
            var data = _listsService.GetListsByEmail(GetUserEmail());

            var dataDto = data.Select(x => new ItemListDTO
            {
                Email = x.Email,
                Finished = x.Finished,
                FinishDate = x.FinishDate,
                CreatedDate = x.CreatedDate,
                Id = x.Id.ToString(),
                Items = x.Items.Select(y => new ItemDTO
                {
                    Finished = y.Finished,
                    Id = y.Id.ToString(),
                    Name = y.Name,
                    CreatedAt = y.CreatedAt
                }).ToList(),
                Name = x.Name,
                
            }).ToList();

            var result = new ReturnResult<List<ItemListDTO>>()
            {
                Code = ResultCodes.Ok,
                Message = "Success",
                Data = dataDto
            };

            return result;
        }
        [Authorize]
        [HttpPut("UpdateList")]
        public ReturnResult<bool> UpdateList(ItemListDTO updateList)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Fail,
                Message = "Fail",
                Data = false
            };

            if (updateList == null)
            {
                result.Message = "List is empty";
                return result;
            }

            var list = _listsService.GetListById(ObjectId.Parse(updateList.Id));

            if (list == null)
                return result;

            var update = new ItemList
            {
                Id = list.Id,
                Email = list.Email,
                Name = updateList.Name,
                Finished = updateList.Finished,
                FinishDate = updateList.FinishDate,
                CreatedDate = updateList.CreatedDate,
                Items = updateList.Items.Select(x => new Item { Id = ObjectId.Parse(x.Id), Finished = x.Finished, Name = x.Name }).ToList()
            };

            _listsService.UpdateList(ObjectId.Parse(updateList.Id), update);
            SetReturnResult(result, ResultCodes.Ok, "List Updated", true);

            return result;
        }

        [Authorize]
        [HttpDelete("DeleteList")]
        public ReturnResult<bool> DeleteList(string listId)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Fail,
                Message = "Empty id field",
                Data = false
            };
             
            //ad check if exist btw

            if (listId == null)
                return result;




            var id = ObjectId.Parse(listId);
            _listsService.DeleteList(id);
            SetReturnResult(result, ResultCodes.Ok, "List deleted", true);

            return result;
        }
        //Items
        [Authorize]
        [HttpPost("AddItem")]
        public ReturnResult<bool> AddList(string listId, string itemName)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Fail,
                Message = "Fail",
                Data = false
            };
            if (itemName == null)
            {
                SetReturnResult(result, ResultCodes.Fail, "Name is empty", false);
            }
            else
            {
                _listsService.AddItem(listId, itemName);
                SetReturnResult(result, ResultCodes.Ok, "Item added", true);
            }

            return result;
        }


    

        [Authorize]
        [HttpGet("GetItems")]
        public ReturnResult<List<ItemList>> GetItems(string listId)
        {
            var result = new ReturnResult<List<ItemList>>()
            {
                Code = ResultCodes.Ok,
                Message = "Success",
                Data = null
            };

            return result;
        }
        [Authorize]
        [HttpPut("UpdateItem")]
        public ReturnResult<bool> UpdateItem(string listId, ItemDTO updatedItem)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Fail,
                Message = "Fail",
                Data = false
            };

            if (listId == null || updatedItem == null)
            {
                result.Message = "Item is empty";
                return result;
            }

            var item = new Item
            {
                Finished = updatedItem.Finished,
                Id = ObjectId.Parse(updatedItem.Id),
                Name = updatedItem.Name,
                CreatedAt = updatedItem.CreatedAt,
            };


            var res = _listsService.UpdateItem(listId, item);
            if (res)
            {
                SetReturnResult(result, ResultCodes.Ok, "Item updated", true);
                return result;
            }
            SetReturnResult(result, ResultCodes.Ok, "Error", false);

            return result;
        }

        [Authorize]
        [HttpDelete("DeleteItem")]
        public ReturnResult<bool> DeleteItem(string listId, string itemId)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Fail,
                Message = "Empty id field",
                Data = false
            };

            if (itemId == null)
                return result;

            _listsService.DeleteItem(listId, itemId);
            SetReturnResult(result, ResultCodes.Ok, "Item deleted", true);

            return result;
        }

        [Authorize]
        [HttpPost("AddFile")]
        public  ReturnResult<bool> AddFileAsync(string listId, List<IFormFile> files)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Ok,
                Message = "Sent",
                Data = true
            };
            try
            {

                _listsService.AddFile(listId, files);

                return result;

            }
            catch (Exception )
            {
                SetReturnResult(result, ResultCodes.Fail, "Error", false);

                return result;
            }


        }
        [Authorize]
        [HttpDelete("DeleteFile")]
        public ReturnResult<bool> DeleteFile(string listId,string fileId)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Ok,
                Message = "Deleted",
                Data = true
            };
            try
            {

                _listsService.DeleteFile(listId, fileId);

                return result;

            }
            catch (Exception)
            {
                SetReturnResult(result, ResultCodes.Fail, "Error", false);
                return result;
            }
        }

    }
}