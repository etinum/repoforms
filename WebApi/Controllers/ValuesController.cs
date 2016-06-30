using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Configuration;
using System.Web.Http;
using System.Web.Http.Cors;
using AutoMapper;
using Data;
using Microsoft.AspNet.SignalR;
using WebApi.Hub;
using WebApi.Mapper;
using WebApi.Models;
using WebApi.Utils;

namespace WebApi.Controllers
{


    [System.Web.Http.Authorize]
    [EnableCors(origins: "http://localhost:8011", headers: "*", methods: "*")]
    public class ValuesController : ApiControllerWithHub<TestHub>
    {

        private readonly IMapper _mapper;

        public ValuesController()
        {
            var mapConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<MapperProfile>();
            });

            _mapper = mapConfig.CreateMapper();
        }

        [HttpGet]
        public bool SendHub()
        {
            
            Hub.Clients.All.SendAlert("hello mam");

            Hub.Clients.All.test2();

            Hub.Clients.All.test();
            

            return true;

        }

        [HttpGet]
        public bool CheckDebugMode()
        {

#if DEBUG
            return true;
#else
            return false;
#endif

        }

        [HttpGet]
        public IHttpActionResult SearchVin(string searchVinString)
        {

            var mctx = new MQEntities();

            var list = mctx.pra_accountsStoreProc(searchVinString).Select(r => r.veh_vin).Distinct();
          
            return Ok(list);

        }



        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
    }
}
