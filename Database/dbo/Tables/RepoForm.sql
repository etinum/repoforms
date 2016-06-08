﻿CREATE TABLE [dbo].[RepoForm] (
    [Id]                    INT          IDENTITY (1, 1) NOT NULL,
    [CreatedDate]           DATETIME     NULL,
    [RepoDate]              DATETIME     NULL,
    [AccountNumber]         NCHAR (100)  NULL,
    [Investigator]          NCHAR (100)  NULL,
    [Client]                NCHAR (100)  NULL,
    [CloseType]             NCHAR (100)  NULL,
    [CustomerName]          NCHAR (100)  NULL,
    [Points]                INT          NULL,
    [RecoveryAgent]         NCHAR (100)  NULL,
    [Notes]                 NCHAR (1024) NULL,
    [RecoveryAddress]       NCHAR (100)  NULL,
    [RecoveryCity]          NCHAR (100)  NULL,
    [RecoveryState]         NCHAR (100)  NULL,
    [RecoveryZip]           NCHAR (100)  NULL,
    [StorageAddress]        NCHAR (100)  NULL,
    [StorageCity]           NCHAR (100)  NULL,
    [StorageState]          NCHAR (100)  NULL,
    [StorageZip]            NCHAR (100)  NULL,
    [StorageAdditionalFees] NCHAR (100)  NULL,
    [StorageFeeReason]      NCHAR (100)  NULL,
    [PoliceDept]            NCHAR (100)  NULL,
    [PoliceNumber]          NCHAR (100)  NULL,
    [PoliceBadgeNumber]     NCHAR (100)  NULL,
    [KeysChecked]           BIT          NULL,
    [DrivableChecked]       BIT          NULL,
    [Personals]             NCHAR (100)  NULL,
    [IPRUpdated]            NCHAR (100)  NULL,
    [RepoProcessing]        NCHAR (100)  NULL,
    [Billing]               NCHAR (100)  NULL,
    [InitializedDate]       DATETIME     NULL,
    [OriginalUserId]        INT          NULL,
    [AdminUserId]           INT          NULL,
    [Verified]              BIT          NULL,
    CONSTRAINT [PK_RepoForm] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_RepoForm_OriginalUserId_User_Userid] FOREIGN KEY ([OriginalUserId]) REFERENCES [dbo].[User] ([Id])
);











