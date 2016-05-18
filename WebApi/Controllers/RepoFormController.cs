using System;
using System.Web.Http.Cors;
using AutoMapper;
using Data;
using WebApi.Mapper;
using WebApi.Models;

namespace WebApi.Controllers
{

    [System.Web.Http.Authorize]
    [EnableCors(origins: "http://localhost:8011", headers: "*", methods: "*")]
    public class RepoFormController
    {
        private readonly IMapper _mapper;

        public RepoFormController()
        {
            var mapConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<MapperProfile>();
            });

            _mapper = mapConfig.CreateMapper();
        }


        [System.Web.Http.HttpPost]
        public void SaveForm(RepoFormViewModel formViewModel)
        {
            var repoFormModel = _mapper.Map<RepoForm>(formViewModel);

            // save the input values.. 

            
        }







    }
}
