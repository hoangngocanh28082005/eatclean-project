using Microsoft.EntityFrameworkCore;
using OffiMeal.Api.Data;
using OffiMeal.Api.Models.Responses;

namespace OffiMeal.Api.Services;

public sealed class CatalogService(OffiMealDbContext db)
{
    public async Task<List<MealResponse>> Meals(CancellationToken cancellationToken) =>
        await db.Meals.AsNoTracking().Where(meal => meal.IsAvailable).OrderBy(meal => meal.MealId)
            .Select(meal => new MealResponse(meal.MealId.ToString(), meal.Name, meal.Description ?? "", meal.Calories,
                meal.ProteinG, meal.CarbsG, meal.FatG, meal.Price, meal.ImageUrl ?? "", meal.Name, meal.MealType, false))
            .ToListAsync(cancellationToken);

    public async Task<List<PackageResponse>> Packages(CancellationToken cancellationToken) =>
        await db.Packages.AsNoTracking().Where(package => package.IsActive).OrderBy(package => package.PackageId)
            .Select(package => new PackageResponse(package.PackageId, package.Name, package.MealCount, package.DurationDays, package.Price, package.Description))
            .ToListAsync(cancellationToken);
}
