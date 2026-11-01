using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OffiMeal.Api.Data;
using OffiMeal.Api.Security;

namespace OffiMeal.Api.Controllers;

[ApiController]
[Route("api/meals")]
[Authorize(Policy = AccountSession.AdminPolicy)]
public class MealImageController : ControllerBase
{
    private readonly OffiMealDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public MealImageController(
        OffiMealDbContext context,
        IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    // POST: api/meals/1/image
    [HttpPost("{id:int}/image")]
    [RequestSizeLimit(5 * 1024 * 1024)]
    public async Task<IActionResult> UploadImage(
        int id,
        IFormFile file)
    {
        var meal = await _context.Meals
            .FirstOrDefaultAsync(m => m.MealId == id);

        if (meal == null)
        {
            return NotFound(new
            {
                message = "Meal not found."
            });
        }

        if (file == null || file.Length == 0)
        {
            return BadRequest(new
            {
                message = "Please select an image."
            });
        }

        if (file.Length > 5 * 1024 * 1024)
        {
            return BadRequest(new
            {
                message = "Image size cannot exceed 5MB."
            });
        }

        var allowedTypes = new[]
        {
            "image/jpeg",
            "image/png",
            "image/webp"
        };

        if (!allowedTypes.Contains(file.ContentType))
        {
            return BadRequest(new
            {
                message = "Only JPG, PNG and WEBP images are allowed."
            });
        }

        var folder = Path.Combine(
            _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot"),
            "images",
            "meals"
        );

        Directory.CreateDirectory(folder);

        var extension = file.ContentType switch
        {
            "image/jpeg" => ".jpg",
            "image/png" => ".png",
            "image/webp" => ".webp",
            _ => ""
        };

        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(folder, fileName);

        await using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        meal.ImageUrl = $"/images/meals/{fileName}";

        await _context.SaveChangesAsync();

        var imageUrl = $"{Request.Scheme}://{Request.Host}{meal.ImageUrl}";

        return Ok(new
        {
            message = "Image uploaded successfully.",
            imageUrl
        });
    }
}