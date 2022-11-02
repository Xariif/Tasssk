using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using ToDoAPI.DTOs;
using ToDoAPI.DTOs.Core;
using ToDoAPI.DTOs.ItemList;
using ToDoAPI.Models;
using ToDoAPI.Models.ItemList;
using ToDoAPI.Services;
using FileInfo = ToDoAPI.Models.ItemList.FileInfo;

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
        [HttpGet("GetListsNames")]
        public ReturnResult<List<ListsNamesDTO>> GetListsNames()
        {
            var result = new ReturnResult<List<ListsNamesDTO>>()
            {
                Code = ResultCodes.Ok,
                Message = "Ok",
                Data = new List<ListsNamesDTO>()
            };

            try
            {
                var data = _listsService.GetListsByEmail(GetUserEmail());
               foreach(var list in data)
                {
                    result.Data.Add(new ListsNamesDTO
                    {
                        Id = list.Id.ToString(),
                        Name = list.Name
                    });
                }

                return result;
            }
            catch 
            {
                SetReturnResult(result, ResultCodes.Fail, "Fail", null);
                return result;
            }
        }

        [Authorize]
        [HttpGet("AddList")]
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
        [HttpGet("GetListById")]
        public ReturnResult<ItemListDTO> GetListById(string listId)
        {

            var result = new ReturnResult<ItemListDTO>()
            {
                Code = ResultCodes.Ok,
                Message = "Success",
                Data = null
            };

            try
            {

                var x = _listsService.GetListById(ObjectId.Parse(listId));

                var dataDto = new ItemListDTO
                {
                    Email = x.Email,
                    Name = x.Name,

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
                    Files = x.Files.Select(z => new FileInfoDTO
                    {
                        FileId = z.FileId.ToString(),
                        Id = z.Id.ToString(),
                        Name = z.Name,
                        Size = z.Size,
                        Type = z.Type
                    }).ToList()

                };

                result.Data = dataDto;
                return result;

            }
            catch 
            {
                SetReturnResult(result, ResultCodes.Fail, "Fial", null);

                return result;

            }

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
                _listsService.AddItem(ObjectId.Parse(listId), itemName);
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

            _listsService.DeleteItem(ObjectId.Parse(listId), ObjectId.Parse(itemId));
            SetReturnResult(result, ResultCodes.Ok, "Item deleted", true);

            return result;
        }

        [Authorize]
        [HttpPost("AddFile")]
        public  ReturnResult<List<FileInfo>> AddFileAsync(string listId, List<IFormFile> files)
        {
            var result = new ReturnResult<List<FileInfo>>();
       
            try
            {

               var fileinfo =  _listsService.AddFile(ObjectId.Parse(listId), files);
                SetReturnResult(result, ResultCodes.Ok,"Added", fileinfo);
                return result;

            }
            catch (Exception )
            {
                SetReturnResult(result, ResultCodes.Fail, "Error", null);

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

                _listsService.DeleteFile(ObjectId.Parse(listId), ObjectId.Parse(fileId));

                return result;

            }
            catch (Exception)
            {
                SetReturnResult(result, ResultCodes.Fail, "Error", false);
                return result;
            }
        }
        [Authorize]
        [HttpGet("GetFile")]
        public ReturnResult<FileData> GetFile(string fileId)
        {
        var result = new ReturnResult<FileData>()
            {
                Code = ResultCodes.Ok,
                Message = "Success",
            };
            try
            {

               result.Data =  _listsService.GetFile( ObjectId.Parse(fileId));

                return result;

            }
            catch (Exception)
            {
                SetReturnResult(result, ResultCodes.Fail, "Error", null);
                return result;
            }
        }

    }
}