using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using Data;
using WebApi.Models;

namespace WebApi.Controllers
{


    [Authorize]
    [EnableCors(origins: "http://localhost:8011", headers: "*", methods: "*")]
    public class ValuesController : ApiController
    {
        // GET api/values
        public IEnumerable<PersonTest> Get()
        {
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
