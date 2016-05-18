using System;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;
using AutoMapper;
using Data;
using WebApi.Mapper;
using WebApi.Models;

namespace WebApi.Controllers 
{

    [Authorize]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class RepoFormController : ApiController
    {
        private readonly IMapper _mapper;

        public RepoFormController()
        {
            var mapConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<MapperProfile>();
            });

            _mapper = mapConfig.CreateMapper();
        }


        [HttpGet]
        public string GetMe()
        {
            return "hello";
        }

        [HttpPost]
        public void SaveForm(RepoFormViewModel formViewModel)
        {
            var repoFormModel = _mapper.Map<RepoForm>(formViewModel);

            // save the input values.. 
            using (var ctx = new PLSFormsDBEntities())
            {
                var user = GetExistingUser() ?? new User()
                {
                    WinAuthName = User.Identity.Name,
                    Investigator = repoFormModel.Investigator,
                    FirstLoggedIn = DateTime.Now
                };

                user.LastLoggedIn = DateTime.Now;

                repoFormModel.User = user;

                ctx.RepoForms.Add(repoFormModel);

                ctx.SaveChanges();
            }
            
        }


        private User GetExistingUser()
        {
            using (var ctx = new PLSFormsDBEntities())
            {
                var matchUser = ctx.Users.FirstOrDefault(r => r.WinAuthName == User.Identity.Name);
                return matchUser;

            }

        }

    }
}
