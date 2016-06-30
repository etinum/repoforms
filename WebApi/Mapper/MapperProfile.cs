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

            this.CreateMap<AccountVinClientViewModel, pra_accountsStoreProc_Result>()
                .ForMember(des => des.account_client_account_num, opt => opt.MapFrom(src => src.AccountClientAccountNum))
                .ForMember(des => des.veh_vin, opt => opt.MapFrom(src => src.VehVin));
            this.CreateMap<pra_accountsStoreProc_Result, AccountVinClientViewModel>()
                .ForMember(des => des.AccountClientAccountNum, opt => opt.MapFrom(src => src.account_client_account_num))
                .ForMember(des => des.VehVin, opt => opt.MapFrom(src => src.veh_vin));



        }
    }
}
