using Microsoft.AspNetCore.Mvc;
using OffiMeal.Api.Services;

namespace OffiMeal.Api.Controllers;

[ApiController]
[Route("api")]
public sealed class CatalogController(CatalogService service) : ControllerBase
{
    [HttpGet("meals")]
    public async Task<IActionResult> Meals(CancellationToken cancellationToken) => Ok(await service.Meals(cancellationToken));

    [HttpGet("packages")]
    public async Task<IActionResult> Packages(CancellationToken cancellationToken) => Ok(await service.Packages(cancellationToken));
}
