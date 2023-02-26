using MongoDB.Bson;
using MongoDB.Driver;
using System.Collections;
using TassskAPI.Helpers.Models;
using ToDoAPI.Helpers.Models;
using ToDoAPI.Models.ItemList;
using ToDoAPI.Models.User;

namespace ToDoAPI.Helpers
{
    public class MongoCRUD : MongoDbHelper
    {
        //CREATE
        public async Task InsertOneAsync<T>(string collectionName, T record)
        {
            var collection = db.GetCollection<T>(collectionName);
            await collection.InsertOneAsync(record);
        }
        public async Task InsertManyAsync<T>(string collectionName, List<T> records)
        {
            var collection = db.GetCollection<T>(collectionName);
            await collection.InsertManyAsync(records);
        }
        //READ
        public async Task<T> FindFirstByIdAsync<T>(string collectionName, string id)
        {
            var collection = db.GetCollection<T>(collectionName);
            var filter = Builders<T>.Filter.Eq("_id", ObjectId.Parse(id));
            return await collection.FindAsync(filter).Result.FirstOrDefaultAsync();
        }
        public async Task<T> FindFirstAsync<T>(string collectionName, MongoFilterHelper filterHelper)
        {
            var collection = db.GetCollection<T>(collectionName);
            var filter = Builders<T>.Filter.Eq(filterHelper.FilterField, filterHelper.FilterValue);
            return await collection.FindAsync(filter).Result.FirstOrDefaultAsync();
        }
        public async Task<List<T>> FindManyAsync<T>(string collectionName, MongoFilterHelper filterHelper)
        {
            var collection = db.GetCollection<T>(collectionName);
            var filter = Builders<T>.Filter.Eq(filterHelper.FilterField, filterHelper.FilterValue);
            return await collection.FindAsync(filter).Result.ToListAsync();
        }

        //UPDATE FIELD
        public async Task<UpdateResult> UpdateOneAsync<T>(string collectionName, MongoFilterHelper filterHelper, string field, T value)
        {
            var collection = db.GetCollection<T>(collectionName);
            var filter = Builders<T>.Filter.Eq(filterHelper.FilterField, filterHelper.FilterValue);
            var update = Builders<T>.Update.Set(field, value);
            return await collection.UpdateOneAsync(filter, update);

        }
        public async Task<UpdateResult> UpdateManyAsync<T>(string collectionName, MongoFilterHelper filterHelper, string field, string value)
        {
            var collection = db.GetCollection<T>(collectionName);
            var filter = Builders<T>.Filter.Eq(filterHelper.FilterField, filterHelper.FilterValue);
            var update = Builders<T>.Update.Set(field, value);
            return await collection.UpdateManyAsync(filter, update);
        }
        //REPLACE 
        public async Task<T> FindOneAndReplaceAsync<T>(string collectionName, string id, T record)
        {
            var collection = db.GetCollection<T>(collectionName);
            var filter = Builders<T>.Filter.Eq("_id", ObjectId.Parse(id));
            return await collection.FindOneAndReplaceAsync(filter, record);
        }
        //DELETE
        public async Task<DeleteResult> DeleteOneAsync<T>(string collectionName, string id)
        {
            var collection = db.GetCollection<T>(collectionName);
            var filter = Builders<T>.Filter.Eq("_id", ObjectId.Parse(id));
            return await collection.DeleteOneAsync(filter);
        }
        public async Task<DeleteResult> DeleteManyAsync<T>(string collectionName, MongoFilterHelper filterHelper)
        {
            var collection = db.GetCollection<T>(collectionName);
            var filter = Builders<T>.Filter.Eq(filterHelper.FilterField, filterHelper.FilterValue);
            return await collection.DeleteManyAsync(filter);
        }

        //NESTED ARRAY
        public async Task<UpdateResult> PushObjectToNestedArrayAsync<T>(string collectionName, MongoNestedArrayHelper<T> nestedHelper)
        {
            var collection = db.GetCollection<T>(collectionName);
            var filter = Builders<T>.Filter.Eq(nestedHelper.FilterField, nestedHelper.FilterValue);
            var update = Builders<T>.Update.Push(nestedHelper.NestedArray, nestedHelper.NestedObject);
            return await collection.UpdateOneAsync(filter, update);
        }
        public async Task<UpdateResult> PullObjectFromNestedArrayAsync<T>(string collectionName, MongoNestedArrayHelper<T> nestedHelper)
        {
            var collection = db.GetCollection<T>(collectionName);
            var filter = Builders<T>.Filter.Eq(nestedHelper.FilterField, nestedHelper.FilterValue);
            var update = Builders<T>.Update.Pull(nestedHelper.NestedArray, nestedHelper.NestedObject);
            return await collection.UpdateOneAsync(filter, update);
        }
    }
}
