using Microsoft.EntityFrameworkCore;
using OffiMeal.Api.Data;
using OffiMeal.Api.Models.Entities;

namespace OffiMeal.Api.Services;

public static class GoalMapping
{
    public static string ToDatabaseGoal(string? clientGoal)
    {
        if (string.IsNullOrWhiteSpace(clientGoal)) return "HealthyEating";
        return clientGoal.Trim().ToLowerInvariant() switch
        {
            "lose" or "loseweight" => "LoseWeight",
            "maintain" or "maintainweight" => "MaintainWeight",
            "gain" or "gainmuscle" => "GainMuscle",
            "healthy" or "healthyeating" => "HealthyEating",
            _ => "HealthyEating"
        };
    }

    public static string ToClientGoal(string? dbGoal)
    {
        if (string.IsNullOrWhiteSpace(dbGoal)) return "maintain";
        return dbGoal.Trim().ToLowerInvariant() switch
        {
            "loseweight" => "lose",
            "maintainweight" => "maintain",
            "gainmuscle" => "gain",
            _ => "maintain"
        };
    }
}

public sealed record WorkoutPlanResponse(
    int WorkoutPlanId,
    string Title,
    string Description,
    string Difficulty,
    int DurationMinutes,
    string? VideoUrl,
    string Goal,
    bool IsActive
);

public sealed record WorkoutLogRequest(int? WorkoutPlanId, int? DurationMinutes, string? Note);

public sealed record WorkoutLogResponse(
    int WorkoutLogId,
    int WorkoutPlanId,
    string WorkoutTitle,
    DateTime CompletedAt,
    int? DurationMinutes,
    string? Note
);

public sealed class WorkoutService(OffiMealDbContext db)
{
    public async Task<List<WorkoutPlanResponse>> GetPlans(string? goal, CancellationToken cancellationToken)
    {
        var query = db.WorkoutPlans.AsNoTracking().Where(p => p.IsActive);
        if (!string.IsNullOrWhiteSpace(goal))
        {
            var dbGoal = GoalMapping.ToDatabaseGoal(goal);
            query = query.Where(p => p.Goal == null || p.Goal == dbGoal || p.Goal == "HealthyEating");
        }

        var list = await query.OrderBy(p => p.WorkoutPlanId).ToListAsync(cancellationToken);

        return list.Select(p => new WorkoutPlanResponse(
            p.WorkoutPlanId,
            p.Title,
            p.Description ?? "",
            p.Difficulty,
            p.DurationMinutes,
            p.VideoUrl,
            GoalMapping.ToClientGoal(p.Goal),
            p.IsActive
        )).ToList();
    }

    public async Task<List<WorkoutLogResponse>> GetUserLogs(int userId, CancellationToken cancellationToken)
    {
        return await (from log in db.WorkoutLogs.AsNoTracking()
                      join plan in db.WorkoutPlans.AsNoTracking() on log.WorkoutPlanId equals plan.WorkoutPlanId into plans
                      from plan in plans.DefaultIfEmpty()
                      where log.UserId == userId
                      orderby log.CompletedAt descending
                      select new WorkoutLogResponse(
                          log.WorkoutLogId,
                          log.WorkoutPlanId,
                          plan != null ? plan.Title : "Bài tập tự chọn",
                          log.CompletedAt,
                          log.DurationMinutes,
                          log.Note
                      )).ToListAsync(cancellationToken);
    }

    public async Task<WorkoutLogResponse> LogWorkout(int userId, WorkoutLogRequest request, CancellationToken cancellationToken)
    {
        // Foreign Key Safe: If WorkoutPlanId is missing, zero, or does not exist, fallback to default Plan 1
        var targetPlanId = (request.WorkoutPlanId.HasValue && request.WorkoutPlanId.Value > 0)
            ? request.WorkoutPlanId.Value
            : 1;

        var planExists = await db.WorkoutPlans.AnyAsync(p => p.WorkoutPlanId == targetPlanId, cancellationToken);
        if (!planExists)
        {
            // Pick first available active plan in database to guarantee FK integrity
            var firstAvailable = await db.WorkoutPlans
                .OrderBy(p => p.WorkoutPlanId)
                .Select(p => p.WorkoutPlanId)
                .FirstOrDefaultAsync(cancellationToken);

            if (firstAvailable > 0)
            {
                targetPlanId = firstAvailable;
            }
        }

        var entity = new WorkoutLog
        {
            UserId = userId,
            WorkoutPlanId = targetPlanId,
            CompletedAt = DateTime.UtcNow,
            DurationMinutes = request.DurationMinutes,
            Note = request.Note
        };

        db.WorkoutLogs.Add(entity);
        await db.SaveChangesAsync(cancellationToken);

        var plan = await db.WorkoutPlans.AsNoTracking().FirstOrDefaultAsync(p => p.WorkoutPlanId == targetPlanId, cancellationToken);

        return new WorkoutLogResponse(
            entity.WorkoutLogId,
            entity.WorkoutPlanId,
            plan?.Title ?? "Bài tập tùy chỉnh",
            entity.CompletedAt,
            entity.DurationMinutes,
            entity.Note
        );
    }
}
