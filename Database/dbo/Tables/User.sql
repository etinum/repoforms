CREATE TABLE [dbo].[User] (
    [Id]                     INT             IDENTITY (1, 1) NOT NULL,
    [WinAuthName]            NVARCHAR (50)   NULL,
    [DepartmentId]           INT             NULL,
    [Position]               NVARCHAR (50)   NULL,
    [JobFunction]            NVARCHAR (MAX)  NULL,
    [Picture]                VARBINARY (MAX) NULL,
    [First]                  NVARCHAR (50)   NULL,
    [Last]                   NVARCHAR (50)   NULL,
    [Email]                  NVARCHAR (50)   NULL,
    [Extension]              NVARCHAR (50)   NULL,
    [CellPhone]              NVARCHAR (50)   NULL,
    [OtherPhone]             NVARCHAR (50)   NULL,
    [LastLoggedIn]           DATETIME        NULL,
    [FirstLoggedIn]          DATETIME        NULL,
    [Active]                 BIT             NULL,
    [CreatedDate]            DATETIME        NULL,
    [ModifiedDate]           DATETIME        NULL,
    [DirectReportUserId]     INT             NULL,
    [DottedLineReportUserId] INT             NULL,
    CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_User_User] FOREIGN KEY ([DirectReportUserId]) REFERENCES [dbo].[User] ([Id]),
    CONSTRAINT [FK_User_User1] FOREIGN KEY ([DottedLineReportUserId]) REFERENCES [dbo].[User] ([Id])
);





