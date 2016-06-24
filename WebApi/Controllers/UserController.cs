using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Web.Http;
using AutoMapper;
using Data;
using WebApi.Mapper;
using WebApi.Models;

namespace WebApi.Controllers
{
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
            var user = _ctx.Users.FirstOrDefault(r => r.Id == id);
            return Ok(_mapper.Map<UserViewModel>(user));
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
                _ctx.SaveChanges();

            }

            var userViewModel = _mapper.Map<UserViewModel>(user);

            userViewModel.Roles = GetRoles(user.Id);

            return Ok(userViewModel);

        }

        [HttpGet]
        public IHttpActionResult GetAllUsers()
        {

            var users = _ctx.Users.ToList();

            return Ok(_mapper.Map<List<UserViewModel>>(users));

        }


        [HttpPost]
        public IHttpActionResult SaveUser(int id)
        {
            return Ok();
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
