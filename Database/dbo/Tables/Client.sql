CREATE TABLE [dbo].[Client] (
    [Id]             INT           IDENTITY (1, 1) NOT NULL,
    [Name]           NVARCHAR (50) NULL,
    [IsTieredPoints] BIT           NULL,
    [Active]         BIT           CONSTRAINT [DF_Client_Active] DEFAULT ((1)) NULL,
    [CreatedDate]    DATETIME      NULL,
    [ModifiedDate]   DATETIME      NULL,
    CONSTRAINT [PK_Client] PRIMARY KEY CLUSTERED ([Id] ASC)
);

