using MongoDB.Bson;
using TassskAPI.Helpers.Models;
using TassskAPI.Models.Notification;
using ToDoAPI.Helpers;
using ToDoAPI.Helpers.Models;
using ToDoAPI.Models.User;

namespace TassskAPI.Services
{
    public class NotificationService
    {
        private readonly MongoCRUD db;
        private readonly string UserCollection;
        public NotificationService()
        {
            UserCollection = "User";
            db = new MongoCRUD();
        }
        public async Task<List<Notification>> GetNotifications(string email)
        {
            var filterHelper = new MongoFilterHelper
            {
                FilterField = "Email",
                FilterValue = email
            };
            var user = await db.FindFirstAsync<User>(UserCollection, filterHelper);


            return user.Notifications.ToList();
        }

        public async Task<bool> AddNotification(string email, string header, string body)
        {
            var notification = new Notification
            {
                Type = "Notification",
                Header = header,
                Body = body
            };
            var nestedHelper = new MongoNestedArrayHelper<Notification>
            {
                FilterField = "Email",
                FilterValue = email,
                NestedArray = "Notifications",
                NestedObject = notification
            };
            await db.PushObjectToNestedArrayAsync(UserCollection, nestedHelper);
            return true;
        }
        public async Task<bool> DeleteNotification(string email, string notificationId)
        {
            var NotificationToDelete = GetNotifications(email).Result.FirstOrDefault(x => x.Id == ObjectId.Parse(notificationId));

            var nestedHelper = new MongoNestedArrayHelper<Notification>
            {
                FilterField = "Email",
                FilterValue = email,
                NestedArray = "Notifications",
                NestedObject = NotificationToDelete
            };
            await db.PullObjectFromNestedArrayAsync(UserCollection, nestedHelper);
            return true;
        }
        public async Task<bool> SetNotificationReaded(string email, string notificationId)
        {
            var NotificationToDelete = GetNotifications(email).Result.FirstOrDefault(x => x.Id == ObjectId.Parse(notificationId));
            var nestedHelper = new MongoNestedArrayHelper<Notification>
            {
                FilterField = "Email",
                FilterValue = email,
                NestedArray = "Notifications",
                NestedObject = NotificationToDelete
            };
            await db.PullObjectFromNestedArrayAsync(UserCollection, nestedHelper);

            NotificationToDelete.IsReaded = true;
            await db.PushObjectToNestedArrayAsync(UserCollection, nestedHelper);

            return true;
        }



    }
}
