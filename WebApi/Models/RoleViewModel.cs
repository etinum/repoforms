using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class RoleViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Assignable { get; set; }

    }
}
