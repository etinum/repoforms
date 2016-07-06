CREATE TABLE [dbo].[Department] (
    [Id]           INT           IDENTITY (1, 1) NOT NULL,
    [Name]         NVARCHAR (50) NULL,
    [LeadUserId]   INT           NULL,
    [CreatedDate]  DATETIME      NULL,
    [ModifiedDate] DATETIME      NULL,
    CONSTRAINT [PK_Department] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Department_User] FOREIGN KEY ([LeadUserId]) REFERENCES [dbo].[User] ([Id])
);

