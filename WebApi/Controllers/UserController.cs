using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Runtime.InteropServices;
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
    public class UserController : ApiController
    {
        private readonly IMapper _mapper;
        private readonly PLSFormsDBEntities _ctx;

        public UserController()
        {
            _ctx = new PLSFormsDBEntities();

            var mapConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<MapperProfile>();
            });

            _mapper = mapConfig.CreateMapper();
        }


        //TODO: For all user objects, we need to convert the foreignkey ID's to add the readable object name
        [HttpGet]
        public IHttpActionResult GetUser(int id)
        {
            var userViewModel = id == 0 ? new UserViewModel() : _mapper.Map<UserViewModel>(_ctx.Users.FirstOrDefault(r => r.Id == id));

            userViewModel.DepartmentOptions = _ctx.Departments.Select(r => new DepartmentOption()
            {
                Id = r.Id,
                Name = r.Name
            }).ToList();

            userViewModel.UserOptions = _ctx.Users.Select(r => new UserOption()
            {
                Id = r.Id,
                First = r.First,
                Last = r.Last,
                WinAuthName = r.WinAuthName
            }).ToList();

            return Ok(userViewModel);
        }

        [HttpGet]
        public IHttpActionResult GetLoggedUser()
        {

            var user = _ctx.Users.FirstOrDefault(r => r.WinAuthName == User.Identity.Name);

            if (user == null)
            {
                user = new User()
                {
                    WinAuthName = User.Identity.Name,
                    FirstLoggedIn = DateTime.Now,
                    LastLoggedIn = DateTime.Now,
                    CreatedDate = DateTime.Now,
                    ModifiedDate = DateTime.Now,
                    Active = true
                };

                _ctx.Users.Add(user);

            }
            else
            {
                user.LastLoggedIn = DateTime.Now;
            }

            _ctx.SaveChanges();

            var userViewModel = _mapper.Map<UserViewModel>(user);

            userViewModel.Roles = GetRoles(user.Id);

            return Ok(userViewModel);

        }

        [HttpGet]
        public IHttpActionResult GetAllUsers()
        {

            var users = _ctx.Users.ToList();
            var userVms = _mapper.Map<List<UserViewModel>>(users);

            var deps = _ctx.Departments.ToList();

            userVms.ForEach(r =>
            {
                var firstOrDefault = deps.FirstOrDefault(d => d.Id == r.DepartmentId);
                if (firstOrDefault != null)
                                        r.DepartmentName = firstOrDefault.Name;
            });

            return Ok(userVms);

        }


        [HttpPost]
        public IHttpActionResult SaveUser(UserViewModel userViewModel)
        {
            var user = _mapper.Map<User>(userViewModel);
            user.ModifiedDate = DateTime.Now;

            if (userViewModel.Id == 0)
            {
                user.CreatedDate = DateTime.Now;
                _ctx.Users.Add(user);
            }
            else
            {
                var userTarget = _ctx.Users.First(r => r.Id == user.Id);
                Common.MergeObjects(user, userTarget);
            }

            _ctx.SaveChanges();
            return Ok(user.Id);

        }


        #region help methods

        private List<string> GetRoles(int userId)
        {

            var roles =
                (from r in _ctx.Roles
                    join x in _ctx.X_User_Role on r.Id equals x.RoleId
                    where x.UserId == userId
                    select r.Name);

            return roles.ToList();

        }

        #endregion

    }
}
