using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OffiMeal.Api.Models.Requests;
using OffiMeal.Api.Models.Responses;
using OffiMeal.Api.Security;
using OffiMeal.Api.Services;

namespace OffiMeal.Api.Controllers;

[ApiController]
[Route("api/account")]
[Authorize]
public sealed class AccountController(AccountService service) : ControllerBase
{
    [HttpGet("me")]
    public async Task<IActionResult> Me() => Ok(await service.Get(AccountSession.UserId(User)));

    [HttpPut("me")]
    public async Task<IActionResult> Update(UpdateAccountRequest request) => Ok(await service.Update(AccountSession.UserId(User), request));

    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
    {
        await service.ChangePassword(AccountSession.UserId(User), request);
        await HttpContext.SignOutAsync(AccountSession.Scheme);
        return Ok(new MessageResponse("Đã đổi mật khẩu và kết thúc các phiên cũ. Hãy đăng nhập lại."));
    }

    [HttpGet("orders")]
    public async Task<IActionResult> Orders() => Ok(await service.Orders(AccountSession.UserId(User)));
}
