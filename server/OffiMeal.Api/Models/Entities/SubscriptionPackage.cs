namespace OffiMeal.Api.Models.Entities;

public sealed class SubscriptionPackage
{
    public int PackageId { get; set; }
    public string Name { get; set; } = "";
    public int MealCount { get; set; }
    public int DurationDays { get; set; }
    public decimal Price { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
}
