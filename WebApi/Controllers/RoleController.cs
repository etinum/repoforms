using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using AutoMapper;
using Data;
using WebApi.Mapper;
using WebApi.Models;

namespace WebApi.Controllers
{
    public class RoleController : ApiController
    {
        private readonly IMapper _mapper;
        private readonly PLSFormsDBEntities _ctx;

        public RoleController()
        {
            _ctx = new PLSFormsDBEntities();

            var mapConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<MapperProfile>();
            });

            _mapper = mapConfig.CreateMapper();
        }

        [HttpGet]
        public IHttpActionResult GetRoles()
        {
            return Ok(_mapper.Map<List<RoleViewModel>>(_ctx.Roles));
        }

        [HttpGet]
        public IHttpActionResult GetUsersAndRoles()
        {
            var users = _ctx.Users;
            var userVms = _mapper.Map<List<UserViewModel>>(users);

            userVms.ForEach(uv =>
            {
                uv.Roles =
                    users.First(u => u.Id == uv.Id)
                        .X_User_Role.Select(x => _mapper.Map<RoleViewModel>(_ctx.Roles.First(r => r.Id == x.RoleId)))
                        .ToList();

            });

            return Ok(userVms);
        }

        [HttpPost]
        public IHttpActionResult SaveUsersRoles(List<UserRolesViewModel> dataList)
        {

            foreach (var userRolesViewModel in dataList)
            {
                foreach (var roleId in userRolesViewModel.RoleIds)
                {

                    var xref =
                        _ctx.X_User_Role.FirstOrDefault(x => x.RoleId == roleId && x.UserId == userRolesViewModel.UserId);

                    if (xref == null)
                    {
                        xref = new X_User_Role
                        {
                            RoleId = roleId,
                            UserId = userRolesViewModel.UserId
                        };

                        _ctx.X_User_Role.Add(xref);
                    }
                }
            }

            _ctx.SaveChanges();

            return Ok();
        }


    }
}
