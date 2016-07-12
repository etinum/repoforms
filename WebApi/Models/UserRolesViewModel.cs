using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Models
{

    public class UserRolesViewModel
    {
        public int UserId { get; set; }
        public string WinAuthName { get; set; }
        public string First { get; set; }
        public string Middle { get; set; }
        public string Last { get; set; }
        public string FullName
        {
            get
            {
                return string.IsNullOrEmpty(Middle) ? $"{First} {Last}" : $"{First} {Middle} {Last}";
            }
        }

        public List<int> RoleIds { get; set; }

    }
}
