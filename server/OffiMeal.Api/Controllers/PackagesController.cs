
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OffiMeal.Api.Data;
using OffiMeal.Api.Models.Responses;

namespace OffiMeal.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PackagesController : ControllerBase
{
    private readonly OffiMealDbContext _context;

    public PackagesController(OffiMealDbContext context)
    {
        _context = context;
    }

    // GET: api/packages
    [HttpGet]
    public async Task<IActionResult> GetPackages()
    {
        var packages = await _context.Packages
            .AsNoTracking()
            .Where(p => p.IsActive)
            .OrderBy(p => p.MealCount)
            .Select(p => new PackageResponse(
                p.PackageId,
                p.Name,
                p.MealCount,
                p.DurationDays,
                p.Price,
                p.Description
            ))
            .ToListAsync();

        return Ok(packages);
    }

    // GET: api/packages/1
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetPackage(int id)
    {
        var package = await _context.Packages
            .AsNoTracking()
            .Where(p => p.PackageId == id && p.IsActive)
            .Select(p => new PackageResponse(
                p.PackageId,
                p.Name,
                p.MealCount,
                p.DurationDays,
                p.Price,
                p.Description
            ))
            .FirstOrDefaultAsync();

        if (package == null)
        {
            return NotFound(new
            {
                message = "Package not found."
            });
        }

        return Ok(package);
    }
}
