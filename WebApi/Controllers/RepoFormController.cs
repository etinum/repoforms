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
        private PLSFormsDBEntities _ctx; 

        public RepoFormController()
        {
            _ctx = new PLSFormsDBEntities();

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
                var user = GetExistingUser() ?? new User()
                {
                    WinAuthName = User.Identity.Name,
                    Investigator = repoFormModel.Investigator,
                    FirstLoggedIn = DateTime.Now
                };

                user.LastLoggedIn = DateTime.Now;

                repoFormModel.OriginalUserId = user.Id;
                
                _ctx.RepoForms.Add(repoFormModel);

                _ctx.SaveChanges();

            
        }


        private User GetExistingUser()
        {
            var matchUser = _ctx.Users.FirstOrDefault(r => r.WinAuthName == User.Identity.Name);
            return matchUser;


        }

    }
}
