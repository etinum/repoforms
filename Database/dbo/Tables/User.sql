CREATE TABLE [dbo].[User] (
    [Id]            INT        IDENTITY (1, 1) NOT NULL,
    [WinAuthName]   NCHAR (50) NULL,
    [Investigator]  NCHAR (50) NULL,
    [LastLoggedIn]  DATETIME   NULL,
    [FirstLoggedIn] DATETIME   NULL,
    CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED ([Id] ASC)
);

