﻿using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServerSignalR
{
    internal class NotificationsHub:Hub
    {
        public async Task SendMessage( string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}