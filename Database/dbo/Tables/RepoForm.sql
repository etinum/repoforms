CREATE TABLE [dbo].[RepoForm] (
    [Id]                    INT             IDENTITY (1, 1) NOT NULL,
    [CreatedDate]           DATETIME        NULL,
    [RepoDate]              DATETIME        NULL,
    [AccountNumber]         NVARCHAR (100)  NULL,
    [Investigator]          NVARCHAR (100)  NULL,
    [Client]                NVARCHAR (100)  NULL,
    [CloseType]             NVARCHAR (100)  NULL,
    [CustomerName]          NVARCHAR (100)  NULL,
    [Points]                INT             NULL,
    [RecoveryAgent]         NVARCHAR (100)  NULL,
    [Notes]                 NVARCHAR (1024) NULL,
    [RecoveryAddress]       NVARCHAR (100)  NULL,
    [RecoveryCity]          NVARCHAR (100)  NULL,
    [RecoveryState]         NVARCHAR (100)  NULL,
    [RecoveryZip]           NVARCHAR (100)  NULL,
    [StorageAddress]        NVARCHAR (100)  NULL,
    [StorageCity]           NVARCHAR (100)  NULL,
    [StorageState]          NVARCHAR (100)  NULL,
    [StorageZip]            NVARCHAR (100)  NULL,
    [StorageAdditionalFees] NVARCHAR (100)  NULL,
    [StorageFeeReason]      NVARCHAR (100)  NULL,
    [PoliceDept]            NVARCHAR (100)  NULL,
    [PoliceNumber]          NVARCHAR (100)  NULL,
    [PoliceBadgeNumber]     NVARCHAR (100)  NULL,
    [KeysChecked]           BIT             NULL,
    [DrivableChecked]       BIT             NULL,
    [Personals]             NVARCHAR (100)  NULL,
    [IPRUpdated]            NVARCHAR (100)  NULL,
    [RepoProcessing]        NVARCHAR (100)  NULL,
    [Billing]               NVARCHAR (100)  NULL,
    [InitializedDate]       DATETIME        NULL,
    [OriginalUserId]        INT             NULL,
    [AdminUserId]           INT             NULL,
    [Verified]              BIT             NULL,
    CONSTRAINT [PK_RepoForm] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_RepoForm_AdminUser] FOREIGN KEY ([AdminUserId]) REFERENCES [dbo].[User] ([Id]),
    CONSTRAINT [FK_RepoForm_OriginalUser] FOREIGN KEY ([OriginalUserId]) REFERENCES [dbo].[User] ([Id])
);













