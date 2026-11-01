namespace OffiMeal.Api.Models.Entities;

public sealed class MealPlan
{
    public int MealPlanId { get; set; }
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public string PlanType { get; set; } = "";
    public bool IsActive { get; set; }
}