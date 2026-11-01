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

-- Chong gui lap: moi goi chi co mot don cho thanh toan, moi ngay chi co mot don giao
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UX_Subscriptions_User_Package_Pending' AND object_id = OBJECT_ID('dbo.Subscriptions'))
    EXEC(N'CREATE UNIQUE INDEX UX_Subscriptions_User_Package_Pending ON dbo.Subscriptions(UserId, PackageId) WHERE Status = N''Pending''');
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UX_Orders_Subscription_Date' AND object_id = OBJECT_ID('dbo.Orders'))
    EXEC(N'CREATE UNIQUE INDEX UX_Orders_Subscription_Date ON dbo.Orders(SubscriptionId, DeliveryDate) WHERE SubscriptionId IS NOT NULL AND Status <> N''Cancelled''');

UPDATE dbo.SubscriptionPackages SET Name = N'Gói tuần', Description = N'5 bữa trưa trong 7 ngày, phù hợp để trải nghiệm trước khi cam kết dài hạn.' WHERE PackageId = 1 AND Name = N'Weekly Plan';
UPDATE dbo.SubscriptionPackages SET Name = N'Gói tháng', Description = N'20 bữa trưa trong 30 ngày, phù hợp để lên kế hoạch bữa trưa theo tháng.' WHERE PackageId = 2 AND Name = N'Monthly Plan';

-- DU LIEU MAU cho den khi admin nhap mon that. Calo/dam lay tu src/features/catalog/data/meals.ts;
-- carb/beo la so uoc luong, bep can xac nhan. Allergens de NULL vi chua co nguon da kiem tra.
INSERT INTO dbo.Meals (Name, Description, MealType, Calories, ProteinG, CarbsG, FatG, Price, ImageUrl, IsAvailable, ServingSize, Allergens, Goal)
SELECT seed.Name, seed.Description, seed.MealType, seed.Calories, seed.ProteinG, seed.CarbsG, seed.FatG, seed.Price, seed.ImageUrl, 1, seed.ServingSize, NULL, seed.Goal
FROM (VALUES
    (N'Salad gà nướng mè rang', N'Ức gà nướng đậm đà, rau xanh tươi mát và sốt mè rang béo nhẹ.', N'Lunch', 420, 35, 30, 18, 89000, N'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80', N'350g', N'LowCarb'),
    (N'Cá hồi áp chảo cơm gạo lứt', N'Cá hồi giàu omega-3, cơm gạo lứt dẻo thơm và bông cải hấp.', N'Lunch', 540, 38, 48, 22, 119000, N'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80', N'400g', N'Balanced'),
    (N'Bowl ngũ cốc & rau củ', N'Bowl màu sắc với quinoa, đậu gà, bơ và sốt chanh vàng.', N'Lunch', 390, 18, 52, 13, 85000, N'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', N'350g', N'EatClean'),
    (N'Bánh mì nướng trứng & bơ', N'Bữa sáng nhanh gọn: bánh mì nguyên cám, bơ nghiền và trứng.', N'Breakfast', 460, 24, 42, 22, 75000, N'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80', N'250g', N'Balanced'),
    (N'Bowl trứng & rau củ nướng', N'Trứng chần mềm, rau củ nướng ngọt tự nhiên và sốt tahini.', N'Lunch', 410, 26, 28, 22, 89000, N'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80', N'350g', N'LowCarb'),
    (N'Pancake yến mạch chuối', N'Pancake không bột mì, ngọt tự nhiên từ chuối và mật ong.', N'Breakfast', 330, 14, 54, 7, 69000, N'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80', N'220g', N'EatClean')
) AS seed (Name, Description, MealType, Calories, ProteinG, CarbsG, FatG, Price, ImageUrl, ServingSize, Goal)
WHERE NOT EXISTS (SELECT 1 FROM dbo.Meals meal WHERE meal.Name = seed.Name);

COMMIT;
GO
