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

            this.CreateMap<RepoFormViewModel, RepoForm>()
                .ForMember(dest => dest.KeysChecked, opt => opt.MapFrom(src => src.KeysChecked != null))
                .ForMember(dest => dest.DrivableChecked, opt => opt.MapFrom(src => src.DrivableChecked != null));

            this.CreateMap<RepoForm, RepoFormViewModel>()
                .ForMember(dest => dest.KeysChecked, opt => opt.MapFrom(src => src.KeysChecked != null))
                .ForMember(dest => dest.DrivableChecked, opt => opt.MapFrom(src => src.DrivableChecked != null));


        }
    }
}
