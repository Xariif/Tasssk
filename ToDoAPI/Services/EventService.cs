using MongoDB.Bson;
using ToDoAPI.DTOs.Event;
using ToDoAPI.Helpers;
using ToDoAPI.Models.ItemList;

namespace ToDoAPI.Services
{
    public class EventService
    {
        private readonly MongoCRUD db;
        private readonly string collectionName;
        public EventService()
        {
            collectionName = "ItemList";
            db = new MongoCRUD();
        }
        public List<EventDTO> GetEvents(string email)
        {

            var events = db.FindListsByEmail<ItemList>(collectionName, email).Select(x =>
            new EventDTO
            {
               ListId = x.Id.ToString(),
               Date = x.FinishDate,
               Name = x.Name
            }).ToList();

            return events;
        }
    }
}
