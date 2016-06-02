using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR.Hubs;

namespace WebApi.Hub
{
    public class TestHub : Microsoft.AspNet.SignalR.Hub
    {
        public void Send(string name, string message)
        {
            // Call the addNewMessageToPage method to update clients.
            Clients.All.SendAlert("hi");
        }

        public void Send2(string name, string message)
        {
            // Call the addNewMessageToPage method to update clients.
            Clients.All.SendAlert("hi");
        }
    }
}
