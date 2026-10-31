using Microsoft.EntityFrameworkCore;
using OffiMeal.Api.Data;
using OffiMeal.Api.Models.Entities;

namespace OffiMeal.Api.Services;

public sealed record WorkoutLogRequest(int WorkoutPlanId, int? DurationMinutes, string? Note);

public sealed record WorkoutLogResponse(int WorkoutLogId, int WorkoutPlanId, string WorkoutTitle, DateTime CompletedAt, int? DurationMinutes, string? Note);

public sealed class WorkoutService(OffiMealDbContext db)
{
    public async Task<List<WorkoutPlan>> GetPlans(string? goal, CancellationToken cancellationToken)
    {
        var query = db.WorkoutPlans.AsNoTracking().Where(p => p.IsActive);
        if (!string.IsNullOrWhiteSpace(goal))
        {
            query = query.Where(p => p.Goal == null || p.Goal == goal);
        }
        return await query.OrderBy(p => p.WorkoutPlanId).ToListAsync(cancellationToken);
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
        var entity = new WorkoutLog
        {
            UserId = userId,
            WorkoutPlanId = request.WorkoutPlanId,
            CompletedAt = DateTime.UtcNow,
            DurationMinutes = request.DurationMinutes,
            Note = request.Note
        };

        db.WorkoutLogs.Add(entity);
        await db.SaveChangesAsync(cancellationToken);

        var plan = await db.WorkoutPlans.AsNoTracking().FirstOrDefaultAsync(p => p.WorkoutPlanId == request.WorkoutPlanId, cancellationToken);

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
