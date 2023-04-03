using MongoDB.Driver;

namespace TassskAPI.Services
{
    public class BaseService
    {
        protected IMongoDatabase db;
        protected readonly string FileDataCollection = "FileData";
        protected readonly string FileCollection = "File";
        protected readonly string ItemCollection = "Item";
        protected readonly string ListCollection = "List";
        protected readonly string NotificationCollection = "Notification";
        protected readonly string UserCollection = "User";

        public BaseService()
        {
            var builder = new ConfigurationBuilder();
            builder.AddJsonFile("appsettings.json", optional: false);

            var configuration = builder.Build();
            var database = configuration["DatabaseName"];

            var settings = MongoClientSettings.FromConnectionString(configuration.GetConnectionString("Connection1").ToString());
            settings.ServerApi = new ServerApi(ServerApiVersion.V1);

            var client = new MongoClient(settings);

            db = client.GetDatabase(database);
        }
    }
}
