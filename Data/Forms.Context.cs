﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Data
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class PLSFormsDBEntities : DbContext
    {
        public PLSFormsDBEntities()
            : base("name=PLSFormsDBEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<Client> Clients { get; set; }
        public virtual DbSet<CloseType> CloseTypes { get; set; }
        public virtual DbSet<Department> Departments { get; set; }
        public virtual DbSet<RepoClientFormula> RepoClientFormulas { get; set; }
        public virtual DbSet<RepoForm> RepoForms { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<X_User_Role> X_User_Role { get; set; }
    }
}
