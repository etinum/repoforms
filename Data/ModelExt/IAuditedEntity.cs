using System;

namespace Data
{
    public interface IAuditedEntity
    {
        DateTime? CreatedDate { get; set; }
        DateTime? ModifiedDate { get; set; }
    }
}
