using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Optimization;
using AutoMapper;
using Data;
using WebApi.Hub;
using WebApi.Mapper;
using WebApi.Models;
using WebApi.Utils;

namespace WebApi.Controllers 
{

    [Authorize]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class RepoFormController : ApiControllerWithHub<RepoHub>
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
                Investigator = repoFormsByUser.Select(r => r.Investigator?.Trim()).Distinct().ToList()
                // ClientList = repoFormsByUser.Select(r => r.Client?.Trim()).Distinct().ToList(),
                // CustomerList = repoFormsByUser.Select(r => r.CustomerName?.Trim()).Distinct().ToList(),
                // RecoveryAgentList = repoFormsByUser.Select(r => r.RecoveryAgent?.Trim()).Distinct().ToList()
        
            };

            return model;

        }



        [HttpGet]
        public List<RepoFormViewModel> GetForms()
        {
            var formViewModels = _mapper.Map<List<RepoFormViewModel>>(_ctx.RepoForms.ToList());
            return formViewModels;
        }

        [HttpGet]
        public RepoFormViewModel GetForm(int id)
        {
            var formViewModel = _mapper.Map<RepoFormViewModel>(_ctx.RepoForms.Find(id));
            return formViewModel;
        }

        [HttpPost]
        public bool DeleteForm([FromBody]int id)
        {
            try
            {
                var rf = new RepoForm { Id = id };
                _ctx.RepoForms.Attach(rf);
                _ctx.RepoForms.Remove(rf);
                _ctx.SaveChanges();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }


        [HttpPost]
        public int SaveForm(RepoFormViewModel formViewModel)
        {
            
            var rf = formViewModel.Id > 0 ? UpdateForm(formViewModel) : NewForm(formViewModel);

            Hub.Clients.All.UpdateList(_mapper.Map<RepoFormViewModel>(rf));

            return rf.Id;
        }


        [HttpGet]
        public IHttpActionResult SearchVin(string searchVinString)
        {
            IEnumerable<pra_accountsStoreProc_Result> list;
            using (var mctx = new MQEntities())
            {
                list = mctx.pra_accountsStoreProc(searchVinString).ToList();
            }

            return Ok(list);

        }


        private RepoForm UpdateForm(RepoFormViewModel formViewModel)
        {

            var repoFormModel = _mapper.Map<RepoForm>(formViewModel);
            var user = UpdateUser(repoFormModel);

            if (repoFormModel.InitializedDate != null)
            {
                repoFormModel.AdminUserId = user.Id;
            }

            // https://msdn.microsoft.com/en-us/data/jj592676.aspx
            _ctx.Entry(repoFormModel).State = EntityState.Modified;
            _ctx.SaveChanges();

            return repoFormModel;

        }

        private RepoForm NewForm(RepoFormViewModel formViewModel)
        {
            var repoFormModel = _mapper.Map<RepoForm>(formViewModel);
            var user = UpdateUser(repoFormModel);

            repoFormModel.OriginalUserId = user.Id;

            _ctx.RepoForms.Add(repoFormModel);

            _ctx.SaveChanges();

            if (!user.WinAuthName.Contains("ertran"))
            {
                Email.AssignmentWriteUp(user.WinAuthName, repoFormModel.Investigator, repoFormModel.AccountNumber);
            }

            return repoFormModel;
        }


        private User UpdateUser(RepoForm repoFormModel)
        {
            // save the input values.. 
            var user = GetExistingUser() ?? new User()
            {
                WinAuthName = User.Identity.Name,
                FirstLoggedIn = DateTime.Now
            };

            user.LastLoggedIn = DateTime.Now;

            // If userid = 0, meaning they are new, we need to create a new user in the databse
            if (user.Id == 0)
            {
                user = _ctx.Users.Add(user);
            }
            return user;
        }

        private User GetExistingUser()
        {
            var matchUser = _ctx.Users.FirstOrDefault(r => r.WinAuthName == User.Identity.Name);
            return matchUser;


        }

    }
}
