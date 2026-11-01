namespace OffiMeal.Api.Models.Entities;

public sealed class Subscription
{
    public int SubscriptionId { get; set; }
    public int UserId { get; set; }
    public int PackageId { get; set; }
    public int? MealPlanId { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public string Status { get; set; } = "Pending";

    public decimal TotalPrice { get; set; }
    public int RemainingMeals { get; set; }

    public DateTime CreatedAt { get; set; }
    public SubscriptionPackage Package { get; set; } = null!;
}