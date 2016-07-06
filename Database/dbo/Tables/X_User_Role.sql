CREATE TABLE [dbo].[X_User_Role] (
    [RoleId]      INT      NOT NULL,
    [UserId]      INT      NOT NULL,
    [CreatedDate] DATETIME NOT NULL,
    CONSTRAINT [PK_X_User_Role] PRIMARY KEY CLUSTERED ([RoleId] ASC, [UserId] ASC),
    CONSTRAINT [FK_X_User_Role_Role] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[Role] ([Id]),
    CONSTRAINT [FK_X_User_Role_User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([Id])
);

