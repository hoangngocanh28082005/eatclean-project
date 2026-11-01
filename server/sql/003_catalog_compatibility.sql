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

IF COL_LENGTH('dbo.Meals', 'ServingSize') IS NULL ALTER TABLE dbo.Meals ADD ServingSize NVARCHAR(100) NULL;
IF COL_LENGTH('dbo.Meals', 'Allergens') IS NULL ALTER TABLE dbo.Meals ADD Allergens NVARCHAR(500) NULL;
IF COL_LENGTH('dbo.Meals', 'Goal') IS NULL ALTER TABLE dbo.Meals ADD Goal NVARCHAR(30) NULL;

IF COL_LENGTH('dbo.Subscriptions', 'RemainingMeals') IS NULL
BEGIN
    -- Existing purchases require a deliberate backfill, never silently assume remaining meals.
    IF EXISTS (SELECT 1 FROM dbo.Subscriptions)
        THROW 51001, N'Có gói đăng ký hiện hữu. Cần xác định số bữa còn lại trước khi thêm RemainingMeals.', 1;
    ALTER TABLE dbo.Subscriptions ADD RemainingMeals INT NOT NULL CONSTRAINT DF_Subscriptions_RemainingMeals DEFAULT 0;
END;

IF OBJECT_ID('dbo.DailyMenus', 'U') IS NULL
    CREATE TABLE dbo.DailyMenus (
        MenuDate DATE NOT NULL,
        MealId INT NOT NULL,
        CONSTRAINT PK_DailyMenus PRIMARY KEY(MenuDate, MealId),
        CONSTRAINT FK_DailyMenus_Meals FOREIGN KEY(MealId) REFERENCES dbo.Meals(MealId)
    );

IF OBJECT_ID('dbo.SubscriptionRequests', 'U') IS NULL
    CREATE TABLE dbo.SubscriptionRequests (
        RequestId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        SubscriptionId INT NOT NULL,
        UserId INT NOT NULL,
        RequestType NVARCHAR(30) NOT NULL,
        OrderDetailId INT NULL,
        NewMealId INT NULL,
        RequestedDate DATE NULL,
        Reason NVARCHAR(500) NOT NULL,
        Status NVARCHAR(20) NOT NULL CONSTRAINT DF_SubscriptionRequests_Status DEFAULT N'Pending',
        AdminNote NVARCHAR(500) NULL,
        RequestedAt DATETIME2 NOT NULL CONSTRAINT DF_SubscriptionRequests_RequestedAt DEFAULT SYSDATETIME(),
        DeadlineAt DATETIME2 NOT NULL,
        ProcessedAt DATETIME2 NULL,
        ProcessedByUserId INT NULL,
        CONSTRAINT FK_SubscriptionRequests_Subscriptions FOREIGN KEY(SubscriptionId) REFERENCES dbo.Subscriptions(SubscriptionId),
        CONSTRAINT FK_SubscriptionRequests_Users FOREIGN KEY(UserId) REFERENCES dbo.Users(UserId),
        CONSTRAINT FK_SubscriptionRequests_OrderDetails FOREIGN KEY(OrderDetailId) REFERENCES dbo.OrderDetails(OrderDetailId),
        CONSTRAINT FK_SubscriptionRequests_Meals FOREIGN KEY(NewMealId) REFERENCES dbo.Meals(MealId),
        CONSTRAINT FK_SubscriptionRequests_Admin FOREIGN KEY(ProcessedByUserId) REFERENCES dbo.Users(UserId),
        CONSTRAINT CK_SubscriptionRequests_Type CHECK(RequestType IN (N'ChangeMeal', N'Pause', N'Cancel')),
        CONSTRAINT CK_SubscriptionRequests_Status CHECK(Status IN (N'Pending', N'Approved', N'Rejected'))
    );

IF EXISTS(SELECT 1 FROM dbo.Subscriptions WHERE Status=N'Pending' GROUP BY UserId,PackageId HAVING COUNT(*)>1)
    THROW 51002, N'Có gói Pending bị trùng; cần đối chiếu trước khi tạo chỉ mục.', 1;
IF EXISTS(SELECT 1 FROM dbo.Orders WHERE SubscriptionId IS NOT NULL AND Status<>N'Cancelled' GROUP BY SubscriptionId,DeliveryDate HAVING COUNT(*)>1)
    THROW 51003, N'Có đơn giao trùng ngày trong gói; cần đối chiếu trước khi tạo chỉ mục.', 1;
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='UX_Subscriptions_User_Package_Pending' AND object_id=OBJECT_ID('dbo.Subscriptions'))
    EXEC(N'CREATE UNIQUE INDEX UX_Subscriptions_User_Package_Pending ON dbo.Subscriptions(UserId, PackageId) WHERE Status=N''Pending''');
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='UX_Orders_Subscription_Date' AND object_id=OBJECT_ID('dbo.Orders'))
    EXEC(N'CREATE UNIQUE INDEX UX_Orders_Subscription_Date ON dbo.Orders(SubscriptionId, DeliveryDate) WHERE SubscriptionId IS NOT NULL AND Status<>N''Cancelled''');
COMMIT;
GO
