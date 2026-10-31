namespace OffiMeal.Api.Models.Entities;

public sealed class WorkoutLog
{
    public int WorkoutLogId { get; set; }
    public int UserId { get; set; }
    public int WorkoutPlanId { get; set; }
    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
    public int? DurationMinutes { get; set; }
    public string? Note { get; set; }
}
