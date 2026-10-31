namespace OffiMeal.Api.Models.Entities;

public sealed class WorkoutPlan
{
    public int WorkoutPlanId { get; set; }
    public string Title { get; set; } = "";
    public string? Description { get; set; }
    public string Difficulty { get; set; } = "Beginner";
    public int DurationMinutes { get; set; }
    public string? VideoUrl { get; set; }
    public string? Goal { get; set; }
    public bool IsActive { get; set; } = true;
}
