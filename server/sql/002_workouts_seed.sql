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

-- Ensure table dbo.WorkoutPlans exists
IF OBJECT_ID('dbo.WorkoutPlans', 'U') IS NOT NULL
BEGIN
    SET IDENTITY_INSERT dbo.WorkoutPlans ON;

    -- Plan 1: Default fallback for custom activities (walking, jogging, outside sports)
    IF NOT EXISTS (SELECT 1 FROM dbo.WorkoutPlans WHERE WorkoutPlanId = 1)
    BEGIN
        INSERT INTO dbo.WorkoutPlans (WorkoutPlanId, Title, Description, Difficulty, DurationMinutes, VideoUrl, Goal, IsActive)
        VALUES (
            1,
            N'Hoạt động tự chọn / Ngoài thư viện',
            N'Ghi nhận các bài tập thể chất tự do ngoài website (chạy bộ, đạp xe, bơi lội, yoga ngoài trời...)',
            N'Beginner',
            15,
            NULL,
            N'HealthyEating',
            1
        );
    END;

    -- Plan 2: Office stretch
    IF NOT EXISTS (SELECT 1 FROM dbo.WorkoutPlans WHERE WorkoutPlanId = 2)
    BEGIN
        INSERT INTO dbo.WorkoutPlans (WorkoutPlanId, Title, Description, Difficulty, DurationMinutes, VideoUrl, Goal, IsActive)
        VALUES (
            2,
            N'Giãn cơ nghỉ trưa văn phòng 10 phút',
            N'Xả stress và giải phóng căng cứng cổ vai gáy sau nửa ngày ngồi máy tính',
            N'Beginner',
            10,
            N'https://www.youtube.com/watch?v=kcK0niStxLM',
            N'HealthyEating',
            1
        );
    END;

    -- Plan 3: Spine restorative yoga
    IF NOT EXISTS (SELECT 1 FROM dbo.WorkoutPlans WHERE WorkoutPlanId = 3)
    BEGIN
        INSERT INTO dbo.WorkoutPlans (WorkoutPlanId, Title, Description, Difficulty, DurationMinutes, VideoUrl, Goal, IsActive)
        VALUES (
            3,
            N'Yoga phục hồi cột sống cho người ngồi nhiều',
            N'Kéo giãn thắt lưng, mở rộng lồng ngực và hông giúp giảm đau mỏi do ngồi sai tư thế',
            N'Beginner',
            10,
            N'https://www.youtube.com/watch?v=pmJ4n4emj6o',
            N'MaintainWeight',
            1
        );
    END;

    -- Plan 4: 5-minute beginner cardio
    IF NOT EXISTS (SELECT 1 FROM dbo.WorkoutPlans WHERE WorkoutPlanId = 4)
    BEGIN
        INSERT INTO dbo.WorkoutPlans (WorkoutPlanId, Title, Description, Difficulty, DurationMinutes, VideoUrl, Goal, IsActive)
        VALUES (
            4,
            N'Cardio 5 phút cho người mới bắt đầu',
            N'Không thiết bị, không bật nhảy (Low Impact) — an toàn cho khớp gối',
            N'Beginner',
            5,
            N'https://www.youtube.com/watch?v=q2NZyW5EP5A',
            N'LoseWeight',
            1
        );
    END;

    -- Plan 5: 5-minute fat burning cardio
    IF NOT EXISTS (SELECT 1 FROM dbo.WorkoutPlans WHERE WorkoutPlanId = 5)
    BEGIN
        INSERT INTO dbo.WorkoutPlans (WorkoutPlanId, Title, Description, Difficulty, DurationMinutes, VideoUrl, Goal, IsActive)
        VALUES (
            5,
            N'Cardio 5 phút đốt mỡ & đánh thức năng lượng',
            N'5 động tác năng động tăng nhịp tim nhanh chóng, xua tan cảm giác uể oải',
            N'Intermediate',
            5,
            N'https://www.youtube.com/watch?v=l2ADeM1HD88',
            N'LoseWeight',
            1
        );
    END;

    -- Plan 6: 15-minute HIIT cardio
    IF NOT EXISTS (SELECT 1 FROM dbo.WorkoutPlans WHERE WorkoutPlanId = 6)
    BEGIN
        INSERT INTO dbo.WorkoutPlans (WorkoutPlanId, Title, Description, Difficulty, DurationMinutes, VideoUrl, Goal, IsActive)
        VALUES (
            6,
            N'Cardio HIIT 15 phút tại nhà không dụng cụ',
            N'Chuỗi toàn thân không lặp lại động tác, tối ưu đốt mỡ dư thừa',
            N'Intermediate',
            15,
            N'https://www.youtube.com/watch?v=9PCGvkXV-Bo',
            N'LoseWeight',
            1
        );
    END;

    -- Plan 7: Core and glutes
    IF NOT EXISTS (SELECT 1 FROM dbo.WorkoutPlans WHERE WorkoutPlanId = 7)
    BEGIN
        INSERT INTO dbo.WorkoutPlans (WorkoutPlanId, Title, Description, Difficulty, DurationMinutes, VideoUrl, Goal, IsActive)
        VALUES (
            7,
            N'Tập săn chắc cơ thể 15 phút (Core & Mông)',
            N'Kích hoạt nhóm cơ trung tâm và cơ mông bị ức chế do ngồi nhiều',
            N'Beginner',
            15,
            N'https://www.youtube.com/watch?v=dcKwz_C8pkg',
            N'GainMuscle',
            1
        );
    END;

    -- Plan 8: Low-impact strength
    IF NOT EXISTS (SELECT 1 FROM dbo.WorkoutPlans WHERE WorkoutPlanId = 8)
    BEGIN
        INSERT INTO dbo.WorkoutPlans (WorkoutPlanId, Title, Description, Difficulty, DurationMinutes, VideoUrl, Goal, IsActive)
        VALUES (
            8,
            N'Sức mạnh toàn thân Low-Impact 20 phút',
            N'Kiểm soát nhịp thở, không bật nhảy, giữ an toàn tối đa cho cột sống và khớp',
            N'Beginner',
            20,
            N'https://www.youtube.com/watch?v=0DWkbOGQQXA',
            N'GainMuscle',
            1
        );
    END;

    -- Plan 9: Advanced bodyweight
    IF NOT EXISTS (SELECT 1 FROM dbo.WorkoutPlans WHERE WorkoutPlanId = 9)
    BEGIN
        INSERT INTO dbo.WorkoutPlans (WorkoutPlanId, Title, Description, Difficulty, DurationMinutes, VideoUrl, Goal, IsActive)
        VALUES (
            9,
            N'Kháng lực trọng lượng cơ thể 20 phút nâng cao',
            N'Tập trung phát triển sức bền và cơ bắp với các biến thể chống đẩy, squat và plank nâng cao',
            N'Advanced',
            20,
            N'https://www.youtube.com/watch?v=bM2ueLV0A4I',
            N'GainMuscle',
            1
        );
    END;

    SET IDENTITY_INSERT dbo.WorkoutPlans OFF;
END;

COMMIT;
GO
