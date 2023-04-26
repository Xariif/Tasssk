using Microsoft.AspNetCore.SignalR;

namespace ServerSignalR
{
    //[Authorize]
    public class NotificationsHub : Hub
    {
        public async Task SendNotification(string who,string message )
        {
            await Clients.Group(who).SendAsync("ReceiveNotification", message, default(CancellationToken));
        }

        public override async Task OnConnectedAsync()
        {
            string email = Context.GetHttpContext().Request.Query["email"];

            await Groups.AddToGroupAsync(Context.ConnectionId, email);

            await base.OnConnectedAsync();
        }
    }
}
