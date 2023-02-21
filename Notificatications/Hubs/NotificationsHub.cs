using Microsoft.AspNetCore.SignalR;

namespace Notificatications.Hubs
{
    public class NotificationsHub : Hub
    {
        public async Task SendNotification(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
