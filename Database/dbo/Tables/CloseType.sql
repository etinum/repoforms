CREATE TABLE [dbo].[CloseType] (
    [Id]                INT           IDENTITY (1, 1) NOT NULL,
    [Name]              NVARCHAR (50) NULL,
    [Tiered]            BIT           NULL,
    [DefaultPointValue] INT           NULL,
    [CreatedDate]       DATETIME      NULL,
    [ModifiedDate]      DATETIME      NULL,
    CONSTRAINT [PK_CloseType] PRIMARY KEY CLUSTERED ([Id] ASC)
);

