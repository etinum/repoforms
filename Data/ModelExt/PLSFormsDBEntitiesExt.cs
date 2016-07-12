using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Data
{
    // ReSharper disable once InconsistentNaming
    public partial class PLSFormsDBEntities
    {
        public override int SaveChanges()
        {

            var entityList = ChangeTracker.Entries();

            var addedAuditedEntities = ChangeTracker.Entries<IAuditedEntity>()
              .Where(p => p.State == EntityState.Added)
              .Select(p => p.Entity);

            var modifiedAuditedEntities = ChangeTracker.Entries<ITest>()
              .Where(p => p.State == EntityState.Modified)
              .Select(p => p.Entity);


            foreach (var entity in addedAuditedEntities)
            {
                entity.CreatedDate = DateTime.Now;
                entity.ModifiedDate = DateTime.Now;

            }

            foreach (var entity in modifiedAuditedEntities)
            {
                entity.ModifiedDate = DateTime.Now;
                entity.CreatedBy = 5;
            }


            return base.SaveChanges();
        }
    }
}
