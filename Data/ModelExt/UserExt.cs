namespace Data
{
    public partial class User : IAuditedEntity
    {
        public int? CreatedBy { get; set; }
    }
}
