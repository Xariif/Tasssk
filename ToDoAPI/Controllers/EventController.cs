using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using ToDoAPI.DTOs.Core;
using ToDoAPI.DTOs.Event;
using ToDoAPI.Services;

namespace ToDoAPI.Controllers
{
    public class EventController : BaseAPIController
    {
        private readonly EventService _eventService;

        public EventController(EventService eventService)
        {
            _eventService = eventService;
        }


        [Authorize]
        [HttpGet("GetEvents")]
        public ReturnResult<List<EventDTO>> GetEvents()
        {
            var result = new ReturnResult<List<EventDTO>>()
            {
                Code = ResultCodes.Ok,
                Message = "Events",
                Data = _eventService.GetEvents(GetUserEmail())
            };    
            return result;
        }
    }
}
