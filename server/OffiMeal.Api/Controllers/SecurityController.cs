using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc;

namespace OffiMeal.Api.Controllers;

// Infrastructure endpoints intentionally do not consume the login rate-limit budget.
[ApiController]
[Route("api/auth")]
public sealed class SecurityController(IAntiforgery antiforgery, IWebHostEnvironment environment, IConfiguration configuration) : ControllerBase
{
    [HttpGet("csrf")]
    public IActionResult Csrf() => Ok(new { token = antiforgery.GetAndStoreTokens(HttpContext).RequestToken });

    [HttpGet("delivery-mode")]
    public IActionResult DeliveryMode() => Ok(new { localMail = environment.IsDevelopment() && configuration["Email:Mode"] == "Local" });
}
