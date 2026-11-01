namespace OffiMeal.Api.Models.Entities;

public sealed class MealPlanDetail
{
    public int MealPlanId { get; set; }
    public int MealId { get; set; }
    public byte WeekNumber { get; set; }
    public byte DayNumber { get; set; }
}