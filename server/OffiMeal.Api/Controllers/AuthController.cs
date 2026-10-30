using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using OffiMeal.Api.Models.Requests;
using OffiMeal.Api.Models.Responses;
using OffiMeal.Api.Security;
using OffiMeal.Api.Services;

namespace OffiMeal.Api.Controllers;

[ApiController]
[Route("api/auth")]
[EnableRateLimiting("accounts")]
public sealed class AuthController(AuthService service) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request) => StatusCode(201, await service.Register(request));

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var user = await service.Login(request);
        await HttpContext.SignInAsync(AccountSession.Scheme, AccountSession.Principal(user), new AuthenticationProperties { IsPersistent = false });
        return Ok(AccountResponse.From(user));
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(AccountSession.Scheme);
        return Ok(new MessageResponse("Đã đăng xuất."));
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(EmailRequest request)
    {
        await service.ForgotPassword(request);
        return Ok(new MessageResponse("Nếu email đã đăng ký, hướng dẫn khôi phục sẽ được gửi. Vui lòng chờ ít nhất 60 giây trước khi yêu cầu lại."));
    }

    [Authorize]
    [HttpPost("resend-verification")]
    public async Task<IActionResult> ResendVerification() => Ok(new MessageResponse(await service.ResendVerification(AccountSession.UserId(User))));

    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail(TokenRequest request)
    {
        await service.VerifyEmail(request);
        return Ok(new MessageResponse("Đã xác minh email. Bạn có thể tiếp tục sử dụng tài khoản."));
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetRequest request)
    {
        await service.ResetPassword(request);
        return Ok(new MessageResponse("Đã đặt lại mật khẩu và kết thúc các phiên cũ. Hãy đăng nhập lại."));
    }
}
