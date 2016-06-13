CREATE TABLE [dbo].[User] (
    [Id]            INT           IDENTITY (1, 1) NOT NULL,
    [WinAuthName]   NVARCHAR (50) NULL,
    [Investigator]  NVARCHAR (50) NULL,
    [LastLoggedIn]  DATETIME      NULL,
    [FirstLoggedIn] DATETIME      NULL,
    CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED ([Id] ASC)
);



