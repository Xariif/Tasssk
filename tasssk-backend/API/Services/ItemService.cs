using MongoDB.Bson;
using MongoDB.Driver;
using TassskAPI.DTOs.Item;
using TassskAPI.Models;
using TassskAPI.Services;

namespace ToDoAPI.Services
{
    public class ItemService : BaseService
    {
        public async Task<List<ItemDTO>> GetItems(string listId)
        {
            var items = await db.GetCollection<Item>(ItemCollection).Find(x => x.ListId == ObjectId.Parse(listId)).ToListAsync();
            return items.Select(x => new ItemDTO
            {
                Id = x.Id.ToString(),
                ListId = x.ListId.ToString(),
                CreatedAt = x.CreatedAt,
                Finished = x.Finished,
                Name = x.Name
            }).ToList();
        }


        public async Task<bool> CreateItem(CreateItemDTO newItem)
        {
            Item item = new Item
            {
                Id = ObjectId.GenerateNewId(),
                CreatedAt = DateTime.UtcNow,
                Finished = false,
                ListId = ObjectId.Parse(newItem.ListId),
                Name = newItem.Name,
            };

            await db.GetCollection<Item>(ItemCollection).InsertOneAsync(item);
            return true;

        }
        public async Task<bool> UpdateItem(ItemDTO updateItem)
        {
            Item item = new Item
            {
                Id = ObjectId.Parse(updateItem.Id),
                CreatedAt = updateItem.CreatedAt,
                Finished = updateItem.Finished,
                ListId = ObjectId.Parse(updateItem.ListId),
                Name = updateItem.Name,
            };

            var res = await db.GetCollection<Item>(ItemCollection)
                .ReplaceOneAsync(Builders<Item>.Filter.Eq(x => x.Id, ObjectId.Parse(updateItem.Id)), item);
            return res.IsAcknowledged;
        }

        public async Task<bool> DeleteItem(ItemDTO deleteItem)
        {
            var res = await db.GetCollection<Item>(ItemCollection).DeleteOneAsync(x => x.Id == ObjectId.Parse(deleteItem.Id));

            return res.IsAcknowledged;
        }
    }
}
