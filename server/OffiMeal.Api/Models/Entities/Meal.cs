namespace OffiMeal.Api.Models.Entities;

public sealed class Meal
{
    public int MealId { get; set; }
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public string MealType { get; set; } = "";
    public decimal Calories { get; set; }
    public decimal ProteinG { get; set; }
    public decimal CarbsG { get; set; }
    public decimal FatG { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsAvailable { get; set; }
}
