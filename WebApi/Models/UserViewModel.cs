using System;
using System.Collections.Generic;

namespace WebApi.Models
{
    public class UserViewModel
    {
        public int Id { get; set; }
        public string WinAuthName { get; set; }
        public int? DepartmentId { get; set; }
        public string Position { get; set; }
        public string JobFunction { get; set; }
        public byte[] Picture { get; set; }
        public string First { get; set; }
        public string Last { get; set; }
        public string Email { get; set; }
        public string Extension { get; set; }
        public string CellPhone { get; set; }
        public string OtherPhone { get; set; }
        public DateTime? LastLoggedIn { get; set; }
        public DateTime? FirstLoggedIn { get; set; }
        public bool? Active { get; set; }
        public List<string> Roles { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }

    }
}
