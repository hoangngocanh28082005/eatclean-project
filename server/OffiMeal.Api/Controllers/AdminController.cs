using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OffiMeal.Api.Models.Responses;
using OffiMeal.Api.Security;

namespace OffiMeal.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Policy = AccountSession.AdminPolicy)]
public sealed class AdminController : ControllerBase
{
    [HttpGet("access")]
    public IActionResult Access() => Ok(new MessageResponse("Bạn có quyền quản trị."));
}
