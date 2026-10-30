using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OffiMeal.Api.Data;

namespace OffiMeal.Api.Controllers;

[ApiController]
[Route("api/health")]
public sealed class HealthController(OffiMealDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken) =>
        await db.Database.CanConnectAsync(cancellationToken)
            ? Ok(new { status = "ok", database = "connected" })
            : Problem("Không kết nối được database. Kiểm tra cấu hình SQL Server.", statusCode: 503);
}
