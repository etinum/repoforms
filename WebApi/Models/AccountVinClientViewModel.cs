using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class AccountVinClientViewModel
    {
        public string VehVin { get; set; }
        public string AccountClientAccountNum { get; set; }
        public string RoName { get; set; }
        public string FinanceClientName { get; set; }
        public DateTime? AccountLastActivity { get; set; }
        public string AccountStatus { get; set; }
        public string AccountType { get; set; }
    }
}
