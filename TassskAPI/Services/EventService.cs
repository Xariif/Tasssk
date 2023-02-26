using MongoDB.Bson;
using ToDoAPI.DTOs.Event;
using ToDoAPI.Helpers;
using ToDoAPI.Helpers.Models;
using ToDoAPI.Models.ItemList;

namespace ToDoAPI.Services
{
    public class EventService
    {
        private readonly MongoCRUD db;
        private readonly string ItemListCollection;
        public EventService()
        {
            ItemListCollection = "ItemLists";
            db = new MongoCRUD();
        }
        public async Task<List<EventDTO>> GetEvents(string email)
        {
            var filterHelper = new MongoFilterHelper
            {
                FilterField = "Email",
                FilterValue = email
            };
            var events = await db.FindManyAsync<ItemList>(ItemListCollection, filterHelper);

            var resullt = events.Select(x =>
            new EventDTO
            {
                ListId = x.Id.ToString(),
                Date = x.FinishDate,
                Name = x.Name
            }).ToList();

            return resullt;
        }
    }
}
