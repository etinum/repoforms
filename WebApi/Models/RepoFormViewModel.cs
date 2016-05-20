using System;

namespace WebApi.Models
{
    public class RepoFormViewModel
    {
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<System.DateTime> RepoDate { get; set; }
        public string AccountNumber { get; set; }
        public string Investigator { get; set; }
        public string Client { get; set; }
        public string CloseType { get; set; }
        public string CustomerName { get; set; }
        public string Points { get; set; }
        public string RecoveryAgent { get; set; }
        public string Notes { get; set; }
        public string RecoveryAddress { get; set; }
        public string RecoveryCity { get; set; }
        public string RecoveryState { get; set; }
        public string RecoveryZip { get; set; }
        public string StorageAddress { get; set; }
        public string StorageCity { get; set; }
        public string StorageState { get; set; }
        public string StorageZip { get; set; }
        public string StorageAdditionalFees { get; set; }
        public string StorageFeeReason { get; set; }
        public string PoliceDept { get; set; }
        public string PoliceNumber { get; set; }
        public string PoliceBadgeNumber { get; set; }
        public Nullable<bool> KeysChecked { get; set; }
        public Nullable<bool> DrivableChecked { get; set; }
        public string Personals { get; set; }
        public string IPRUpdated { get; set; }
        public string RepoProcessing { get; set; }
        public string Billing { get; set; }
        public Nullable<System.DateTime> InitializedDate { get; set; }
        public Nullable<int> OriginalUserId { get; set; }

    }
}
