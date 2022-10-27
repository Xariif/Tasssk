using MongoDB.Driver;

namespace ToDoAPI.Helpers
{
    public class MongoDbHelper
    {
        protected IMongoDatabase db;
        public MongoDbHelper()
        {
            var builder = new ConfigurationBuilder();
            builder.AddJsonFile("appsettings.json", optional: false);
            var configuration = builder.Build();
            var database = configuration["ToDoDB"];

            var settings = MongoClientSettings.FromConnectionString(configuration.GetConnectionString("ToDoDBMongo").ToString());
            settings.ServerApi = new ServerApi(ServerApiVersion.V1);

            var client = new MongoClient(settings);
            db = client.GetDatabase(database);
        }

        public async Task<List<T>> FindCollectionByFilterAsync<T>(string collectionName, FilterDefinition<T> mongoQuery)
        {
            var collection = db.GetCollection<T>(collectionName);
           // var filter = Builders<T>.Filter.Eq(collectionName, mongoQuery);
            return await collection.FindSync(mongoQuery).ToListAsync();         
        }
    }
}
