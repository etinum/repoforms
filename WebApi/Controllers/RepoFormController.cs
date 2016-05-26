using System;
using System.Collections.Generic;
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
        private readonly PLSFormsDBEntities _ctx; 

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
        public string GetUser()
        {
            return User.Identity.Name;
        }


        [HttpGet]
        public RepoFormTypeAheadModel TypeAheadData()
        {

            var user = GetExistingUser();
            if (user == null)
            {
                return null;
            }


            var repoFormsByUser = _ctx.RepoForms.ToList().FindAll(r => r.OriginalUserId == user.Id);

            var model = new RepoFormTypeAheadModel
            {
                Investigator = user.Investigator,
                ClientList = repoFormsByUser.Select(r => r.Client?.Trim()).Distinct().ToList(),
                CustomerList = repoFormsByUser.Select(r => r.CustomerName?.Trim()).Distinct().ToList(),
                RecoveryAgentList = repoFormsByUser.Select(r => r.RecoveryAgent?.Trim()).Distinct().ToList()
        
            };

            return model;

        }



        [HttpGet]
        public List<RepoFormViewModel> GetFormList()
        {
            return new List<RepoFormViewModel>();
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
