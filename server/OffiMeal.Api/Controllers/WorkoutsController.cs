using Microsoft.AspNetCore.Mvc;
using OffiMeal.Api.Services;

namespace OffiMeal.Api.Controllers;

[ApiController]
[Route("api/workouts")]
public sealed class WorkoutsController(WorkoutService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetPlans([FromQuery] string? goal, CancellationToken cancellationToken) =>
        Ok(await service.GetPlans(goal, cancellationToken));

    [HttpGet("logs")]
    public async Task<IActionResult> GetLogs([FromQuery] int? userId, CancellationToken cancellationToken)
    {
        var targetUserId = userId ?? 1; // Default test user if unauthenticated
        return Ok(await service.GetUserLogs(targetUserId, cancellationToken));
    }

    [HttpPost("logs")]
    public async Task<IActionResult> LogWorkout([FromBody] WorkoutLogRequest request, [FromQuery] int? userId, CancellationToken cancellationToken)
    {
        var targetUserId = userId ?? 1; // Default test user if unauthenticated
        var result = await service.LogWorkout(targetUserId, request, cancellationToken);
        return Ok(result);
    }
}
