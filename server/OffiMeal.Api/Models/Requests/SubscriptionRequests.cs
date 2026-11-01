
namespace OffiMeal.Api.Models.Requests;

public record CreateSubscriptionRequest(
    int PackageId,
    int? MealPlanId,
    DateTime StartDate
);
