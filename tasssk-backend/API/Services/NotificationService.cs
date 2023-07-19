using MongoDB.Bson;
using MongoDB.Driver;
using System.Collections.Generic;
using TassskAPI.DTOs.List;
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


        public async Task<InviteNotificationDTO> GetInviteNotification(string id)
        {
            var notification = await db.GetCollection<InviteNotification>(NotificationCollection).Find(Builders<InviteNotification>.Filter.Eq(x => x.Id, ObjectId.Parse(id))).FirstOrDefaultAsync();

            var res = new InviteNotificationDTO
            {
                ListId = notification.ListId.ToString(),
                Privileges = notification.Privileges,
            };


            return res;
        }

        public async Task<bool> CreateNotification(string sender,string receiver, string header, string body)
        {
            var notification = new Notification
            {
                Type = "Notification",
                Header = header,
                Body = body,
                Sender = sender,
                Receiver = receiver,
                IsReaded = false
                
            };

            await db.GetCollection<Notification>(NotificationCollection).InsertOneAsync(notification);
            return true;
        }


        public async Task<bool> CreateInviteNotification(string listName,string listId, string sender, string receiver)
        {
            var notification = new InviteNotification
            {
                Type = "Invite",
                Header = $"New invite!",
                Body = $"You've got invite to \"{listName}\" list from {sender}!",
                Sender = sender,
                Receiver = receiver,
                CreatedAt = DateTime.Now,
                ListId = ObjectId.Parse(listId),
                Privileges = new Privileges
                {
                    Email = receiver,
                    Owner = false,
                    Read = true,
                    Write = true,
                    Modify = true,
                    Delete = true
                }
            };
            await db.GetCollection<InviteNotification>(NotificationCollection).InsertOneAsync(notification);
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
