using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using TassskAPI.DTOs.Core;
using TassskAPI.DTOs.Event;
using TassskAPI.Services;

namespace TassskAPI.Controllers
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
        public async Task<ActionResult<List<EventDTO>>> GetEvents()
        {
            try
            {
                var res = await _eventService.GetEvents(GetUserEmail());
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
