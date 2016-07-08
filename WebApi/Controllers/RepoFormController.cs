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
        public IHttpActionResult GetForms()
        {
            var formViewModels = _mapper.Map<List<RepoFormViewModel>>(_ctx.RepoForms.ToList());

            var results = new
            {
                List = formViewModels,
                CloseTypeOptions = _mapper.Map<List<CloseTypeViewModel>>(_ctx.CloseTypes),
                ClientOptions = _mapper.Map<List<ClientViewModel>>(_ctx.Clients)
            };

            return Ok(results);
        }

        [HttpGet]
        public IHttpActionResult GetForm(int id)
        {

            RepoFormViewModel repoVm;

            if (id == 0)
            {
                repoVm = new RepoFormViewModel
                {
                    CloseTypeOptions = _mapper.Map<List<CloseTypeViewModel>>(_ctx.CloseTypes),
                    ClientOptions = _mapper.Map<List<ClientViewModel>>(_ctx.Clients),
                    CreatedDate = DateTime.Now
                };

            }
            else
            {
                repoVm = _mapper.Map<RepoFormViewModel>(_ctx.RepoForms.Find(id));
                repoVm.CloseTypeOptions = _mapper.Map<List<CloseTypeViewModel>>(_ctx.CloseTypes);
                repoVm.ClientOptions = _mapper.Map<List<ClientViewModel>>(_ctx.Clients);
            }


            return Ok(repoVm);
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

            // We want to identify duplicates and only select the one with the latest activity date. 
            var filtered = from a in list
                group a by a.veh_vin
                into g
                where g.Any()
                from f in g.OrderByDescending(r => r.account_last_activity).Take(1)
                select f;

            return Ok(_mapper.Map<List<AccountVinClientViewModel>>(filtered));

        }


        private RepoForm UpdateForm(RepoFormViewModel formViewModel)
        {

            var repoFormModel = _mapper.Map<RepoForm>(formViewModel);
            var user = UpdateUser(repoFormModel);
            repoFormModel.ModifiedDate = DateTime.Now;
            repoFormModel.ModifiedByUserId = user.Id;


            var repoFormTarget = _ctx.RepoForms.First(r => r.Id == repoFormModel.Id);
            Common.MergeObjects(repoFormModel, repoFormTarget);

            _ctx.SaveChanges();

            return repoFormModel;

        }

        private RepoForm NewForm(RepoFormViewModel formViewModel)
        {
            var repoFormModel = _mapper.Map<RepoForm>(formViewModel);
            var user = UpdateUser(repoFormModel);

            repoFormModel.CreatorUserId = user.Id;
            repoFormModel.ModifiedDate = DateTime.Now;
            repoFormModel.CreatedDate = DateTime.Now;
            repoFormModel.ModifiedByUserId = user.Id;


            _ctx.RepoForms.Add(repoFormModel);

            _ctx.SaveChanges();


            var debugmode = !Request.RequestUri.ToString().Contains("plsf");

            Email.AssignmentWriteUp(user.WinAuthName, repoFormModel.Investigator, repoFormModel.AccountNumber, debugmode);

            return repoFormModel;
        }


        private User UpdateUser(RepoForm repoFormModel)
        {
            // save the input values.. 
            var user = GetLoggedUser() ?? new User()
            {
                WinAuthName = User.Identity.Name,
                FirstLoggedIn = DateTime.Now
            };

            // If userid = 0, meaning they are new, we need to create a new user in the databse
            if (user.Id == 0)
            {
                user = _ctx.Users.Add(user);
            }
            return user;
        }

        private User GetLoggedUser()
        {
            var matchUser = _ctx.Users.FirstOrDefault(r => r.WinAuthName == User.Identity.Name);
            return matchUser;


        }

    }
}
