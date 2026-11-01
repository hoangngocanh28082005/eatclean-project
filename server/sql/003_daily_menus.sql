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

-- Thuc don theo ngay: moi dong la mot mon duoc phuc vu trong mot ngay giao
IF OBJECT_ID('dbo.DailyMenus', 'U') IS NULL
    CREATE TABLE dbo.DailyMenus (
        MenuDate date NOT NULL,
        MealId int NOT NULL,
        CONSTRAINT PK_DailyMenus PRIMARY KEY (MenuDate, MealId),
        CONSTRAINT FK_DailyMenus_Meals FOREIGN KEY (MealId) REFERENCES dbo.Meals(MealId)
    );

COMMIT;
GO
