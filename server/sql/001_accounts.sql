USE OffiMealDB;
GO
SET XACT_ABORT ON;
SET ANSI_NULLS ON;
SET ANSI_PADDING ON;
SET ANSI_WARNINGS ON;
SET ARITHABORT ON;
SET CONCAT_NULL_YIELDS_NULL ON;
SET QUOTED_IDENTIFIER ON;
SET NUMERIC_ROUNDABORT OFF;
BEGIN TRANSACTION;
IF COL_LENGTH('dbo.Users', 'EmailConfirmed') IS NULL
    ALTER TABLE dbo.Users ADD EmailConfirmed BIT NOT NULL CONSTRAINT DF_Users_EmailConfirmed DEFAULT 0;
IF COL_LENGTH('dbo.Users', 'SecurityStamp') IS NULL
    ALTER TABLE dbo.Users ADD SecurityStamp UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Users_Stamp DEFAULT NEWID();
IF COL_LENGTH('dbo.Users', 'NormalizedEmail') IS NULL
    ALTER TABLE dbo.Users ADD NormalizedEmail AS UPPER(LTRIM(RTRIM(Email))) PERSISTED;
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UX_Users_NormalizedEmail' AND object_id = OBJECT_ID('dbo.Users'))
    EXEC(N'CREATE UNIQUE INDEX UX_Users_NormalizedEmail ON dbo.Users(NormalizedEmail)');
IF OBJECT_ID('dbo.AccountTokens', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.AccountTokens (
        TokenHash VARCHAR(64) NOT NULL PRIMARY KEY,
        UserId INT NOT NULL REFERENCES dbo.Users(UserId),
        Purpose VARCHAR(10) NOT NULL CHECK (Purpose IN ('verify', 'reset')),
        SecurityStamp UNIQUEIDENTIFIER NOT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        ExpiresAt DATETIME2 NOT NULL,
        UsedAt DATETIME2 NULL
    );
    CREATE INDEX IX_AccountTokens_User_Purpose ON dbo.AccountTokens(UserId, Purpose, CreatedAt);
END;
COMMIT;
GO
