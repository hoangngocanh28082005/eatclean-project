
namespace OffiMeal.Api.Models.Responses;

public record SubscriptionResponse(
    int SubscriptionId,
    int PackageId,
    string PackageName,
    int MealCount,
    int RemainingMeals,
    DateTime StartDate,
    DateTime EndDate,
    string Status,
    decimal TotalPrice
);
