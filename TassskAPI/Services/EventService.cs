using MongoDB.Bson;
using ToDoAPI.DTOs.Event;
using ToDoAPI.Helpers;
using ToDoAPI.Helpers.Models;
using ToDoAPI.Models.ItemList;
using ToDoAPI.Models.User;

namespace ToDoAPI.Services
{
    public class EventService
    {
        private readonly MongoCRUD db;
        private readonly string ItemListCollection;
        private readonly string UserCollection;

        public EventService()
        {
            ItemListCollection = "ItemList";
            UserCollection = "User";
            db = new MongoCRUD();
        }
        public async Task<List<EventDTO>> GetEvents(string email)
        {
            var filterHelper = new MongoFilterHelper
            {
                FilterField = "Email",
                FilterValue = email
            };

            var user = await db.FindFirstAsync<User>(UserCollection, filterHelper);

            var privilages = user.Privileges.Select(x => x.ListObjectId).ToList();


            List<ItemList> itemLists = new List<ItemList>();

            foreach (var privilage in privilages)
            {

                var res = await db.FindFirstByIdAsync<ItemList>(ItemListCollection, privilage.ToString());

                itemLists.Add(res);
            }



            var result = itemLists.Select(x =>
            new EventDTO
            {
                ListId = x.Id.ToString(),
                Date = x.FinishDate,
                Name = x.Name
            }).ToList();

            return result;
        }
    }
}
