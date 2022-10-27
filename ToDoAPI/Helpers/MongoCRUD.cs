using MongoDB.Bson;
using MongoDB.Driver;
using ToDoAPI.Helpers.Models;
using ToDoAPI.Models.ItemList;

namespace ToDoAPI.Helpers
{
    public class MongoCRUD : MongoDbHelper
    {
        public void InsertRecord<T>(string collectionName, T record)
        {
            var collection = db.GetCollection<T>(collectionName);
            collection.InsertOne(record);
        }

        public T FindFirstByEmail<T>(string collectionName, string email)
        {
            var collection = db.GetCollection<T>(collectionName);
            var filter = Builders<T>.Filter.Eq("Email", email);
            return collection.Find(filter).FirstOrDefault();
        }

        public List<T> FindListsByEmail<T>(string collectionName, string email)
        {
            var collection = db.GetCollection<T>(collectionName);
            var filter = Builders<T>.Filter.Eq("Email", email);
            return collection.Find(filter).ToList();
        }

        public T FindFisrtById<T>(string collectionName, ObjectId id)
        {
            var collection = db.GetCollection<T>(collectionName);
            var filter = Builders<T>.Filter.Eq("_id", id);
            return collection.Find(filter).FirstOrDefault();
        }

        public ReplaceOneResult UpsertRecord<T>(string collectionName, ObjectId id, T record)
        {
            var collection = db.GetCollection<T>(collectionName);
            var filter = Builders<T>.Filter.Eq("_id", id);

            return collection.ReplaceOne(filter, record);
        }

        public DeleteResult DeleteRecord<T>(string collectionName, ObjectId id)
        {
            var collection = db.GetCollection<T>(collectionName);
            var filter = Builders<T>.Filter.Eq("_id", id);

            return collection.DeleteOne(filter);
        }

    
    }
}
