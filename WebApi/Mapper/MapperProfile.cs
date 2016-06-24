using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data;
using WebApi.Models;

namespace WebApi.Mapper
{
    public class MapperProfile : AutoMapper.Profile
    {
        protected override void Configure()
        {

            this.CreateMap<RepoFormViewModel, RepoForm>();
            this.CreateMap<RepoForm, RepoFormViewModel>();

            this.CreateMap<UserViewModel, User>();
            this.CreateMap<User, UserViewModel>();



        }
    }
}
