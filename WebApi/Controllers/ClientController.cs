using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using AutoMapper;
using Data;
using WebApi.Mapper;
using WebApi.Models;
using WebApi.Utils;

namespace WebApi.Controllers
{

    [Authorize]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ClientController : ApiController
    {

        private readonly IMapper _mapper;
        private readonly PLSFormsDBEntities _ctx;

        public ClientController()
        {
            _ctx = new PLSFormsDBEntities();

            var mapConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<MapperProfile>();
            });

            _mapper = mapConfig.CreateMapper();
        }

        [HttpGet]
        public IHttpActionResult GetClients()
        {

            var clientVms = _mapper.Map<List<ClientViewModel>>(_ctx.Clients.ToList());

            return Ok(clientVms);
        }


        [HttpPost]
        public IHttpActionResult SaveClient(ClientViewModel clientViewModel)
        {
            var client = _mapper.Map<Client>(clientViewModel);

            if (clientViewModel.Id == 0)
            {
                client.IsTieredPoints = client.IsTieredPoints ?? false;
                client.ModifiedDate = DateTime.Now;
                client.CreatedDate = DateTime.Now;
                _ctx.Clients.Add(client);
            }
            else
            {
                var clientTarget = _ctx.Clients.First(r => r.Id == client.Id);
                Common.MergeObjects(client, clientTarget);
            }

            _ctx.SaveChanges();
            return Ok(client.Id);

        }

    }
}
