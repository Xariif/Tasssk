using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using TassskAPI.DTOs.Core;
using TassskAPI.DTOs.ItemList;
using ToDoAPI.DTOs;
using ToDoAPI.DTOs.ItemList;
using ToDoAPI.Models;
using ToDoAPI.Models.ItemList;
using ToDoAPI.Models.User;
using ToDoAPI.Services;
using FileInfo = ToDoAPI.Models.ItemList.FileInfo;

namespace ToDoAPI.Controllers
{
    public class ItemListController : BaseAPIController
    {
        //TODO: Add validation if user have access 
        private readonly ItemListService _listsService;

        public ItemListController(ItemListService listsService)
        {
            _listsService = listsService;
        }

        #region List


        [Authorize]
        [HttpGet("GetListsNames")]
        public async Task<ReturnResult<List<ListsNamesDTO>>> GetListsNames()
        {
            var result = new ReturnResult<List<ListsNamesDTO>>()
            {
                Code = ResultCodes.Ok,
                Message = "Lists names",
                Data = new List<ListsNamesDTO>()
            };


            var data = await _listsService.GetListsByEmail(GetUserEmail());
            foreach (var list in data)
            {
                result.Data.Add(new ListsNamesDTO
                {
                    Id = list.Id.ToString(),
                    Name = list.Name
                });
            }

            return result;
        }

        [Authorize]
        [HttpPost("AddList")]
        public async Task<ReturnResult<bool>> AddList(NewListDTO newList)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.BadRequest,
                Message = "Add list fail",
                Data = false
            };
            if (newList.Name == null || newList.Name == string.Empty)
            {
                return result;
            }

            var res = await _listsService.AddList(newList, GetUserEmail());


            if (res)
            {
                SetReturnResult(result, ResultCodes.Ok, "List added", true);
                return result;
            }


            SetReturnResult(result, ResultCodes.ResourceAlreadyExists, "List already exist", false);

            return result;
        }

        [Authorize]
        [HttpGet("GetLists")]
        public async Task<ReturnResult<List<ItemsListDTO>>> GetLists()
        {

            var result = new ReturnResult<List<ItemsListDTO>>()
            {
                Code = ResultCodes.Ok,
                Message = "Lists",
                Data = null
            };

            var data = await _listsService.GetListsByEmail(GetUserEmail());

            var dataDto = data.Select(x => new ItemsListDTO
            {
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

            }).ToList();

            result.Data = dataDto;
            return result;
        }

        [Authorize]
        [HttpGet("GetListById")]
        public async Task<ReturnResult<ItemsListDTO>> GetListById(string listId)
        {

            var result = new ReturnResult<ItemsListDTO>()
            {
                Code = ResultCodes.Ok,
                Message = "List by id",
                Data = null
            };

            try
            {

                var x = await _listsService.GetListById(listId);

                var dataDto = new ItemsListDTO
                {

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
                SetReturnResult(result, ResultCodes.BadRequest, "Fail", null);

                return result;

            }

        }
        [Authorize]
        [HttpPut("UpdateList")]
        public async Task<ReturnResult<bool>> UpdateList(ItemsListDTO updateList)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.BadRequest,
                Message = "Update list fail",
                Data = false
            };

            if (updateList == null)
            {
                return result;
            }

            var list = await _listsService.GetListById(updateList.Id);

            if (list == null)
                return result;

            var update = new ItemList
            {
                Id = list.Id,

                Name = updateList.Name,
                Finished = updateList.Finished,
                FinishDate = updateList.FinishDate,
                CreatedDate = updateList.CreatedDate,
                Items = updateList.Items.Select(x =>
                new Item
                {
                    Id = ObjectId.Parse(x.Id),
                    Finished = x.Finished,
                    Name = x.Name,
                    CreatedAt = x.CreatedAt
                }).ToList()
            };

            await _listsService.UpdateList(updateList.Id, update);
            SetReturnResult(result, ResultCodes.Ok, "List Updated", true);

            return result;
        }

        [Authorize]
        [HttpDelete("DeleteList")]
        public async Task<ReturnResult<bool>> DeleteList(string listId)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.BadRequest,
                Message = "Delete list fail",
                Data = false
            };

            if (listId == null)
                return result;


            await _listsService.DeleteList(GetUserEmail(), listId);

            SetReturnResult(result, ResultCodes.Ok, "List deleted", true);

            return result;
        }
        #endregion

        #region Item

        [Authorize]
        [HttpPost("AddItem")]
        public async Task<ReturnResult<bool>> AddItem(string listId, string itemName)
        {

            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.BadRequest,
                Message = "Add item fail",
                Data = false
            };
            if (itemName == null)
            {
                return result;
            }
            else
            {
                await _listsService.AddItem(listId, itemName);
                SetReturnResult(result, ResultCodes.Ok, "Item added", true);
                return result;
            }


        }

        [Authorize]
        [HttpGet("GetItems")]
        public ReturnResult<List<ItemList>> GetItems(string listId)
        {
            var result = new ReturnResult<List<ItemList>>()
            {
                Code = ResultCodes.Ok,
                Message = "List items",
                Data = null
            };

            return result;
        }
        [Authorize]
        [HttpPut("UpdateItem")]
        public async Task<ReturnResult<bool>> UpdateItem(string listId, ItemDTO updatedItem)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.BadRequest,
                Message = "Update item fail",
                Data = false
            };

            if (listId == null || updatedItem == null)
            {
                return result;
            }

            var item = new Item
            {
                Finished = updatedItem.Finished,
                Id = ObjectId.Parse(updatedItem.Id),
                Name = updatedItem.Name,
                CreatedAt = updatedItem.CreatedAt,
            };


            var res = await _listsService.UpdateItem(listId, item);
            if (res)
            {
                SetReturnResult(result, ResultCodes.Ok, "Item updated", true);
                return result;
            }
            SetReturnResult(result, ResultCodes.BadRequest, "Update item fail", false);

            return result;
        }

        [Authorize]
        [HttpDelete("DeleteItem")]
        public async Task<ReturnResult<bool>> DeleteItem(string listId, string itemId)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.BadRequest,
                Message = "Item delete fail",
                Data = false
            };

            if (itemId == null)
                return result;

            await _listsService.DeleteItem(listId, itemId);
            SetReturnResult(result, ResultCodes.Ok, "Item deleted", true);

            return result;
        }
        #endregion

        #region File
        [Authorize]
        [HttpPost("AddFile")]
        public async Task<ReturnResult<List<FileInfo>>> AddFileAsync(string listId, List<IFormFile> formData)
        {
            var result = new ReturnResult<List<FileInfo>>();

            try
            {
                var fileinfo = await _listsService.AddFile(listId, formData);
                SetReturnResult(result, ResultCodes.Ok, "File added", fileinfo);
                return result;
            }
            catch (Exception)
            {
                SetReturnResult(result, ResultCodes.BadRequest, "File add fail", null);

                return result;
            }


        }
        [Authorize]
        [HttpDelete("DeleteFile")]
        public async Task<ReturnResult<bool>> DeleteFile(string listId, string fileId)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Ok,
                Message = "File deleted",
                Data = true
            };
            try
            {

                await _listsService.DeleteFile(listId, fileId);

                return result;

            }
            catch (Exception)
            {
                SetReturnResult(result, ResultCodes.BadRequest, "File delete fail", false);
                return result;
            }
        }
        [Authorize]
        [HttpGet("GetFile")]
        public async Task<ReturnResult<FilesData>> GetFile(string fileId)
        {
            var result = new ReturnResult<FilesData>()
            {
                Code = ResultCodes.Ok,
                Message = "File by id",
            };
            try
            {

                result.Data = await _listsService.GetFile(fileId);

                return result;

            }
            catch (Exception)
            {
                SetReturnResult(result, ResultCodes.BadRequest, "File by id fail", null);
                return result;
            }
        }
        #endregion

        #region Privilages
        [Authorize]
        [HttpPost("SendInviteToList")]
        public async Task<ReturnResult<bool>> SendInviteToList(SendInviteToListDTO inviteInfo)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Ok,
                Message = "Invite send!",
                Data = true
            };

            inviteInfo.Sender = GetUserEmail();

            if (inviteInfo.Sender == inviteInfo.Receiver)
            {
                SetReturnResult<bool>(result, ResultCodes.BadRequest, "You cannot send invite to yourself!", false);
                return result;
            }

            var ok = await _listsService.SendListInvite(inviteInfo);

            if (ok == false)
            {
                SetReturnResult<bool>(result, ResultCodes.BadRequest, "User with that e-mail not exist!", false);
            }

            return result;
        }

        [Authorize]
        [HttpPost("AcceptInvite")]
        public async Task<ReturnResult<bool>> AcceptInvite(SendInviteToListDTO inviteInfo)
        {
            var result = new ReturnResult<bool>
            {
                Code = ResultCodes.Ok,
                Message = "Invite accepted!",
                Data = true
            };
            if (inviteInfo.Receiver != GetUserEmail())
            {
                SetReturnResult<bool>(result, ResultCodes.BadRequest, "Error, no privilages to that list!", false);
                return result;
            }
            await _listsService.AcceptListInvite(inviteInfo);

            return result;
        }
        [Authorize]
        [HttpGet("GetUserPrivilages")]
        public async Task<ReturnResult<Privileges>> GetUserPrivilages(string listId)
        {
            var result = new ReturnResult<Privileges>()
            {
                Code = ResultCodes.Ok,
                Message = "User privileges!",
                Data = null
            };

            var data = await _listsService.GetUserPrivilages(GetUserEmail(), listId);

            if (data == null)
            {
                SetReturnResult(result, ResultCodes.BadRequest, "Error", null);
            }
            result.Data = data;

            return result;
        }

        [Authorize]
        [HttpGet("GetUsersListPrivilages")]
        public async Task<ReturnResult<List<UserPrivilagesDTO>>> GetUsersListPrivilages(string listId)
        {
            var result = new ReturnResult<List<UserPrivilagesDTO>>()
            {
                Code = ResultCodes.Ok,
                Message = "Privileges list!",
                Data = null
            };

            var data = await _listsService.GetUsersListPrivilages(GetUserEmail(), listId);

            if (data == null)
            {
                SetReturnResult(result, ResultCodes.BadRequest, "Error", null);
            }
            result.Data = data;

            return result;
        }


        [Authorize]
        [HttpDelete("RemovePrivilages")]
        public async Task<ReturnResult<bool>> RemovePrivilages(RemovePrivilagesDTO removePrivilages)
        {
            var result = new ReturnResult<bool>()
            {
                Code = ResultCodes.Ok,
                Message = "Privilages removed!",
                Data = true
            };

            var res = await _listsService.RemoveListPrivilages(removePrivilages, GetUserEmail());

            if (res == false)
            {
                SetReturnResult<bool>(result, ResultCodes.BadRequest, "Error", false);
            }

            return result;
        }

        #endregion
    }
}