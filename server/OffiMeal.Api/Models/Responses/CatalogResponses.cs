namespace OffiMeal.Api.Models.Responses;

public record MealResponse(string Id, string Name, string Description, decimal Calories, decimal Protein, decimal Carbs, decimal Fat, decimal Price, string ImageUrl, string ImageAlt, string MealType, bool AllergenInfoVerified);
public record PackageResponse(int Id, string Name, int MealCount, int DurationDays, decimal Price, string? Description);
