using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class RepoFormTypeAheadModel
    {
        public string Investigator { get; set; }
        public List<string> ClientList { get; set; }
        public List<string> CustomerList { get; set; }
        public List<string> RecoveryAgentList { get; set; }

    }
}
