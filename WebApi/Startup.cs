using System;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;
using Owin;
using WebApi.Utils;


namespace WebApi
{
    public class Startup
    {


        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();

            // For SignalR
            var settings = new JsonSerializerSettings {ContractResolver = new SignalRContractResolver()};
            var serializer = JsonSerializer.Create(settings);
            GlobalHost.DependencyResolver.Register(typeof(JsonSerializer), () => serializer);

        }
    }
}
