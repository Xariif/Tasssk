using MongoDB.Bson;
using MongoDB.Driver;
using TassskAPI.DTOs.Notification;
using TassskAPI.Models;

namespace TassskAPI.Services
{
    public class NotificationService : BaseService
    {
        public async Task<List<NotificationDTO>> GetNotifications(string email)
        {
            var notifications = await db.GetCollection<BsonDocument>(NotificationCollection).Find(Builders<BsonDocument>.Filter.Eq("Receiver", email)).ToListAsync();

            var list = notifications.Select(x => new NotificationDTO
            {
                Id = x["_id"].ToString(),
                Header = x["Header"].ToString(),
                Body = x["Body"].ToString(),
                Type = x["Type"].ToString(),
                Receiver = x["Receiver"].ToString(),
                CreatedAt = x["CreatedAt"].ToUniversalTime(),
                IsReaded = x["IsReaded"].ToBoolean(),
            }).ToList();

            return list;
        }

        public async Task<bool> CreateNotification(string email, string header, string body)
        {
            var notification = new Notification
            {
                Type = "Notification",
                Header = header,
                Body = body,
                Receiver = email,
                IsReaded = false
            };

            await db.GetCollection<Notification>(NotificationCollection).InsertOneAsync(notification);
            return true;
        }
        public async Task<bool> DeleteNotification(string notificationId)
        {
            var res = await db.GetCollection<Notification>(NotificationCollection).DeleteOneAsync(x => x.Id == ObjectId.Parse(notificationId));
            return res.IsAcknowledged;
        }

        public async Task<bool> SetNotificationReaded(string notificationId)
        {
            var res = await db.GetCollection<Notification>(NotificationCollection).UpdateOneAsync(x => x.Id == ObjectId.Parse(notificationId), Builders<Notification>.Update.Set(y => y.IsReaded, true));

            return res.IsAcknowledged;
        }
    }
}
