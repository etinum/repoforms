CREATE TABLE [dbo].[RepoForm] (
    [Id]               INT             IDENTITY (1, 1) NOT NULL,
    [CreatedDate]      DATETIME        NULL,
    [ModifiedDate]     DATETIME        CONSTRAINT [DF_RepoForm_ModifiedDate] DEFAULT (getdate()) NULL,
    [AccountNumber]    NVARCHAR (100)  NULL,
    [Investigator]     NVARCHAR (100)  NULL,
    [ClientId]         INT             NULL,
    [CloseTypeId]      INT             NULL,
    [CustomerName]     NVARCHAR (100)  NULL,
    [Points]           INT             NULL,
    [Notes]            NVARCHAR (1024) NULL,
    [CreatorUserId]    INT             NULL,
    [ModifiedByUserId] INT             NULL,
    [AdminUserId]      INT             NULL,
    [AdminOtherUserId] INT             NULL,
    CONSTRAINT [PK_RepoForm] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_RepoForm_AdminUser] FOREIGN KEY ([AdminUserId]) REFERENCES [dbo].[User] ([Id]),
    CONSTRAINT [FK_RepoForm_Client] FOREIGN KEY ([ClientId]) REFERENCES [dbo].[Client] ([Id]),
    CONSTRAINT [FK_RepoForm_CloseType] FOREIGN KEY ([CloseTypeId]) REFERENCES [dbo].[CloseType] ([Id]),
    CONSTRAINT [FK_RepoForm_OriginalUser] FOREIGN KEY ([CreatorUserId]) REFERENCES [dbo].[User] ([Id])
);















