CREATE TABLE [dbo].[RepoClientFormula] (
    [Id]           INT      IDENTITY (1, 1) NOT NULL,
    [ClientId]     INT      NOT NULL,
    [RepoCount]    INT      NOT NULL,
    [Points]       INT      NULL,
    [CreatedDate]  DATETIME NULL,
    [ModifiedDate] DATETIME NULL,
    CONSTRAINT [PK_RepoClientFormula] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_RepoClientFormula_Client] FOREIGN KEY ([ClientId]) REFERENCES [dbo].[Client] ([Id])
);

