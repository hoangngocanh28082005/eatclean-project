
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OffiMeal.Api.Data;
using OffiMeal.Api.Models.Entities;
using OffiMeal.Api.Models.Requests;
using OffiMeal.Api.Models.Responses;
using OffiMeal.Api.Security;

namespace OffiMeal.Api.Controllers;

[ApiController]
[Route("api/meals")]
public class MealsController : ControllerBase
{
    private readonly OffiMealDbContext _context;

    public MealsController(OffiMealDbContext context)
    {
        _context = context;
    }

    // GET: api/meals
    [HttpGet]
    public async Task<IActionResult> GetMeals(
        [FromQuery] string? search,
        [FromQuery] string? mealType,
        [FromQuery] string? goal)
    {
        var query = _context.Meals
            .AsNoTracking()
            .Where(m => m.IsAvailable);

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(m =>
                m.Name.Contains(search) ||
                (m.Description != null &&
                 m.Description.Contains(search)));
        }

        if (!string.IsNullOrWhiteSpace(mealType))
        {
            query = query.Where(m => m.MealType == mealType);
        }

        if (!string.IsNullOrWhiteSpace(goal))
        {
            query = query.Where(m => m.Goal == goal);
        }

        var meals = await query
            .OrderBy(m => m.MealId)
            .Select(m => new MealResponse(
                m.MealId.ToString(),
                m.Name,
                m.Description ?? "",
                m.Calories,
                m.ProteinG,
                m.CarbsG,
                m.FatG,
                m.Price,
                m.ImageUrl ?? "",
                m.Name,
                m.MealType,
                false,
                m.ServingSize,
                m.Allergens,
                m.Goal
            ))
            .ToListAsync();

        return Ok(meals);
    }

    // GET: api/meals/1
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetMeal(int id)
    {
        var meal = await _context.Meals
            .AsNoTracking()
            .Where(m => m.MealId == id && m.IsAvailable)
            .Select(m => new MealResponse(
                m.MealId.ToString(),
                m.Name,
                m.Description ?? "",
                m.Calories,
                m.ProteinG,
                m.CarbsG,
                m.FatG,
                m.Price,
                m.ImageUrl ?? "",
                m.Name,
                m.MealType,
                false,
                m.ServingSize,
                m.Allergens,
                m.Goal
            ))
            .FirstOrDefaultAsync();

        if (meal == null)
        {
            return NotFound(new { message = "Meal not found." });
        }

        return Ok(meal);
    }

    // GET: api/meals/manage
    // Admin xem tat ca mon an
    [HttpGet("manage")]
    [Authorize(Policy = AccountSession.AdminPolicy)]
    public async Task<IActionResult> GetAllMeals()
    {
        var meals = await _context.Meals
            .AsNoTracking()
            .OrderBy(m => m.MealId)
            .ToListAsync();

        return Ok(meals);
    }

    // POST: api/meals
    // Admin them mon an
    [HttpPost]
    [Authorize(Policy = AccountSession.AdminPolicy)]
    public async Task<IActionResult> CreateMeal(MealRequest request)
    {
        var meal = new Meal
        {
            Name = request.Name.Trim(),
            Description = request.Description?.Trim(),
            MealType = request.MealType,
            Calories = request.Calories,
            ProteinG = request.ProteinG,
            CarbsG = request.CarbsG,
            FatG = request.FatG,
            Price = request.Price,
            ImageUrl = request.ImageUrl?.Trim(),
            ServingSize = request.ServingSize?.Trim(),
            Allergens = request.Allergens?.Trim(),
            Goal = request.Goal,
            IsAvailable = request.IsAvailable
        };

        _context.Meals.Add(meal);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetMeal),
            new { id = meal.MealId },
            meal
        );
    }

    // PUT: api/meals/1
    // Admin sua mon an
    [HttpPut("{id:int}")]
    [Authorize(Policy = AccountSession.AdminPolicy)]
    public async Task<IActionResult> UpdateMeal(
        int id,
        MealRequest request)
    {
        var meal = await _context.Meals
            .FirstOrDefaultAsync(m => m.MealId == id);

        if (meal == null)
        {
            return NotFound(new { message = "Meal not found." });
        }

        meal.Name = request.Name.Trim();
        meal.Description = request.Description?.Trim();
        meal.MealType = request.MealType;
        meal.Calories = request.Calories;
        meal.ProteinG = request.ProteinG;
        meal.CarbsG = request.CarbsG;
        meal.FatG = request.FatG;
        meal.Price = request.Price;
        meal.ImageUrl = request.ImageUrl?.Trim();
        meal.ServingSize = request.ServingSize?.Trim();
        meal.Allergens = request.Allergens?.Trim();
        meal.Goal = request.Goal;
        meal.IsAvailable = request.IsAvailable;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Meal updated successfully.",
            meal
        });
    }

    // PATCH: api/meals/1/availability
    // Admin an/hien mon an
    [HttpPatch("{id:int}/availability")]
    [Authorize(Policy = AccountSession.AdminPolicy)]
    public async Task<IActionResult> UpdateAvailability(
        int id,
        [FromQuery] bool isAvailable)
    {
        var meal = await _context.Meals
            .FirstOrDefaultAsync(m => m.MealId == id);

        if (meal == null)
        {
            return NotFound(new { message = "Meal not found." });
        }

        meal.IsAvailable = isAvailable;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = isAvailable
                ? "Meal is now available."
                : "Meal is now hidden.",
            mealId = meal.MealId,
            isAvailable = meal.IsAvailable
        });
    }

    // DELETE: api/meals/1
    // Xoa mem: chuyen IsAvailable = false
    [HttpDelete("{id:int}")]
    [Authorize(Policy = AccountSession.AdminPolicy)]
    public async Task<IActionResult> DeleteMeal(int id)
    {
        var meal = await _context.Meals
            .FirstOrDefaultAsync(m => m.MealId == id);

        if (meal == null)
        {
            return NotFound(new { message = "Meal not found." });
        }

        meal.IsAvailable = false;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Meal deleted successfully.",
            mealId = meal.MealId
        });
    }
}
