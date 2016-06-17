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

        // GET api/values
        public IEnumerable<PersonTest> Get()
        {


            using (var ctx = new PLSFormsDBEntities())
            {


                var list = ctx.RepoForms.ToList();



                var myobj = new User
                {
                    Investigator = "Eric Tran",
                    WinAuthName = "Prant_1/blah",
                    LastLoggedIn = DateTime.Today,
                    FirstLoggedIn = DateTime.Today
                };

                ctx.Users.Add(myobj);

                ctx.SaveChanges();


            }




            var plist = new List<PersonTest>();

            var p1 = new PersonTest
            {
                AccountNumber = "123ABCEEE",
                Age = 26,
                CreatedDate = DateTime.Today,
                Id = 1
            };

            plist.Add(p1);

            var p2 = new PersonTest
            {
                AccountNumber = "789EFGZZZ",
                Age = 39,
                CreatedDate = DateTime.Now,
                Id = 1
            };

            plist.Add(p2);

            return plist;
        }

        // GET api/values/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        public void Post([FromBody]PersonTest person)
        {

            var test = person;

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
