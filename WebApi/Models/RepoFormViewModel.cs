using System;
using System.Collections.Generic;

namespace WebApi.Models
{
    public class RepoFormViewModel
    {
        public int Id { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string AccountNumber { get; set; }
        public string Investigator { get; set; }
        public int? ClientId { get; set; }
        public int? CloseTypeId { get; set; }
        public string CustomerName { get; set; }
        public int? Points { get; set; }
        public string Notes { get; set; }
        public int? CreatorUserId { get; set; }
        public string ModifiedByUserId { get; set; }
        public int? AdminUserId { get; set; }
        public int? AdminOtherUserId { get; set; }
        public IEnumerable<CloseTypeViewModel> CloseTypeOptions { get; set; }
        public IEnumerable<ClientViewModel> ClientOptions { get; set; }
    }
}
