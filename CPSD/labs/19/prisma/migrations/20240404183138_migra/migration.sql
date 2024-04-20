BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[users] (
    [id] INT NOT NULL IDENTITY(1,1),
    [username] VARCHAR(16) NOT NULL,
    [email] VARCHAR(255),
    [password] VARCHAR(32) NOT NULL,
    [role] VARCHAR(5) NOT NULL,
    CONSTRAINT [users_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[repos] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(255),
    [authorId] INT NOT NULL,
    CONSTRAINT [repos_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[commits] (
    [id] INT NOT NULL IDENTITY(1,1),
    [repoId] INT,
    [message] VARCHAR(255),
    CONSTRAINT [commits_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[repos] ADD CONSTRAINT [repos_authorId_fkey] FOREIGN KEY ([authorId]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[commits] ADD CONSTRAINT [commits_repoId_fkey] FOREIGN KEY ([repoId]) REFERENCES [dbo].[repos]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
