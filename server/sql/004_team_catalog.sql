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

-- Unknown nutritional values must remain unknown, not invented or interpreted as zero.
ALTER TABLE dbo.Meals ALTER COLUMN Calories DECIMAL(8,2) NULL;
ALTER TABLE dbo.Meals ALTER COLUMN ProteinG DECIMAL(8,2) NULL;
ALTER TABLE dbo.Meals ALTER COLUMN CarbsG DECIMAL(8,2) NULL;
ALTER TABLE dbo.Meals ALTER COLUMN FatG DECIMAL(8,2) NULL;
IF COL_LENGTH('dbo.Meals', 'CatalogCode') IS NULL
    ALTER TABLE dbo.Meals ADD CatalogCode NVARCHAR(80) NULL;
IF COL_LENGTH('dbo.Meals', 'CostPrice') IS NULL
    ALTER TABLE dbo.Meals ADD CostPrice DECIMAL(12,2) NULL;
IF COL_LENGTH('dbo.SubscriptionPackages', 'CatalogCode') IS NULL
    ALTER TABLE dbo.SubscriptionPackages ADD CatalogCode NVARCHAR(80) NULL;
IF COL_LENGTH('dbo.SubscriptionPackages', 'CostPrice') IS NULL
    ALTER TABLE dbo.SubscriptionPackages ADD CostPrice DECIMAL(12,2) NULL;
COMMIT;
GO

BEGIN TRANSACTION;
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UX_Meals_CatalogCode' AND object_id = OBJECT_ID('dbo.Meals'))
    CREATE UNIQUE INDEX UX_Meals_CatalogCode ON dbo.Meals(CatalogCode) WHERE CatalogCode IS NOT NULL;
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UX_Packages_CatalogCode' AND object_id = OBJECT_ID('dbo.SubscriptionPackages'))
    CREATE UNIQUE INDEX UX_Packages_CatalogCode ON dbo.SubscriptionPackages(CatalogCode) WHERE CatalogCode IS NOT NULL;

DECLARE @Menu TABLE (Code NVARCHAR(80), Name NVARCHAR(150), Description NVARCHAR(500));
INSERT INTO @Menu VALUES
(N'eat-clean-uc-ga-teriyaki', N'Suất ăn Eat Clean - Ức gà sốt Teriyaki (Gói Calo cá nhân)', N'Ức gà sốt Teriyaki thuộc dòng Eat Clean, lựa chọn gói calo cá nhân.'),
(N'healthy-bo-gao-lut', N'Suất ăn Healthy - Bò áp chảo gạo lứt, rau củ', N'Bò áp chảo ăn kèm gạo lứt và rau củ.'),
(N'low-carb-ca-hoi-chanh-day', N'Suất ăn Low-Carb - Cá hồi áp chảo sốt chanh dây', N'Cá hồi áp chảo kết hợp sốt chanh dây thuộc dòng Low-Carb.'),
(N'keto-heo-cuon-mang-tay', N'Suất ăn Keto - Thịt heo cuộn măng tây, nấm BMR', N'Thịt heo cuộn măng tây ăn kèm nấm, thuộc dòng Keto của nhóm.'),
(N'chay-dau-phu-ngu-coc', N'Suất ăn chay dinh dưỡng - Đậu phụ, hạt ngũ cốc Eco', N'Đậu phụ kết hợp hạt ngũ cốc trong suất ăn chay dinh dưỡng Eco.');

UPDATE meal SET Name = menu.Name, Description = menu.Description, Price = 65000, CostPrice = 26000
FROM dbo.Meals meal JOIN @Menu menu ON meal.CatalogCode = menu.Code;
INSERT INTO dbo.Meals(CatalogCode, Name, Description, MealType, Calories, ProteinG, CarbsG, FatG, Price, CostPrice, IsAvailable)
SELECT menu.Code, menu.Name, menu.Description, N'Lunch', NULL, NULL, NULL, NULL, 65000, 26000, 1
FROM @Menu menu WHERE NOT EXISTS (SELECT 1 FROM dbo.Meals meal WHERE meal.CatalogCode = menu.Code);

-- Keep existing package IDs and historical order/subscription totals unchanged.
UPDATE dbo.SubscriptionPackages SET CatalogCode = N'goi-tuan'
WHERE PackageId = (SELECT TOP (1) PackageId FROM dbo.SubscriptionPackages WHERE CatalogCode IS NULL AND MealCount = 5 AND Name IN (N'Weekly Plan', N'Gói tuần', N'Gói ăn theo tuần') ORDER BY PackageId)
AND NOT EXISTS (SELECT 1 FROM dbo.SubscriptionPackages WHERE CatalogCode = N'goi-tuan');
UPDATE dbo.SubscriptionPackages SET CatalogCode = N'goi-thang'
WHERE PackageId = (SELECT TOP (1) PackageId FROM dbo.SubscriptionPackages WHERE CatalogCode IS NULL AND MealCount = 20 AND Name IN (N'Monthly Plan', N'Gói tháng', N'Gói ăn theo tháng') ORDER BY PackageId)
AND NOT EXISTS (SELECT 1 FROM dbo.SubscriptionPackages WHERE CatalogCode = N'goi-thang');

IF NOT EXISTS (SELECT 1 FROM dbo.SubscriptionPackages WHERE CatalogCode = N'goi-tuan')
    INSERT INTO dbo.SubscriptionPackages(CatalogCode, Name, MealCount, DurationDays, Price, CostPrice, Description) VALUES (N'goi-tuan', N'Gói ăn theo tuần', 5, 7, 315000, 126000, N'5 bữa/tuần');
IF NOT EXISTS (SELECT 1 FROM dbo.SubscriptionPackages WHERE CatalogCode = N'goi-thang')
    INSERT INTO dbo.SubscriptionPackages(CatalogCode, Name, MealCount, DurationDays, Price, CostPrice, Description) VALUES (N'goi-thang', N'Gói ăn theo tháng', 20, 30, 1200000, 480000, N'20 bữa/tháng');

UPDATE dbo.SubscriptionPackages SET Name = N'Gói ăn theo tuần', Price = 315000, CostPrice = 126000, Description = N'5 bữa/tuần' WHERE CatalogCode = N'goi-tuan';
UPDATE dbo.SubscriptionPackages SET Name = N'Gói ăn theo tháng', Price = 1200000, CostPrice = 480000, Description = N'20 bữa/tháng' WHERE CatalogCode = N'goi-thang';
COMMIT;
GO

BEGIN TRANSACTION;
UPDATE dbo.Meals SET Goal = CASE CatalogCode
  WHEN N'eat-clean-uc-ga-teriyaki' THEN N'EatClean'
  WHEN N'healthy-bo-gao-lut' THEN N'Balanced'
  WHEN N'low-carb-ca-hoi-chanh-day' THEN N'LowCarb'
  WHEN N'keto-heo-cuon-mang-tay' THEN N'Keto'
  WHEN N'chay-dau-phu-ngu-coc' THEN N'Vegetarian'
  ELSE Goal END
WHERE CatalogCode IN (N'eat-clean-uc-ga-teriyaki', N'healthy-bo-gao-lut', N'low-carb-ca-hoi-chanh-day', N'keto-heo-cuon-mang-tay', N'chay-dau-phu-ngu-coc');
COMMIT;
GO
