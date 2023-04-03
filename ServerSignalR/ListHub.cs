using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServerSignalR
{
    public class ListHub : Hub
    {
        public async Task SendInfo(string listId, string info)
        {
            await Clients.Group(listId).SendAsync("ReceiveInfo", info, default(CancellationToken));
        }

        public override async Task OnConnectedAsync()
        {
            string listId = Context.GetHttpContext().Request.Query["listId"];

            await Groups.AddToGroupAsync(Context.ConnectionId, listId);

            await base.OnConnectedAsync();
        }
    }
}
