using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using OffiMeal.Api.Data;
using OffiMeal.Api.Exceptions;
using OffiMeal.Api.Models.Entities;
using OffiMeal.Api.Models.Requests;
using OffiMeal.Api.Models.Responses;
using static OffiMeal.Api.Security.AccountValidation;

namespace OffiMeal.Api.Services;

public sealed class AuthService(OffiMealDbContext db, TokenService tokens, PasswordService passwords)
{
    public async Task<RegistrationResponse> Register(RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FullName) || request.FullName.Trim().Length > 100 || !ValidEmail(request.Email) || !ValidPassword(request.Password, request.ConfirmPassword))
            throw new BusinessException("Kiểm tra họ tên, email và mật khẩu (10–128 ký tự); hai mật khẩu phải trùng nhau.");
        var email = request.Email!.Trim().ToLowerInvariant();
        if (await db.Users.AnyAsync(user => user.Email.ToUpper() == email.ToUpper())) throw new BusinessException("Email này đã được đăng ký.", BusinessError.Conflict);
        var user = new AccountUser { FullName = request.FullName.Trim(), Email = email };
        user.PasswordHash = passwords.Hash(user, request.Password!);
        db.Users.Add(user);
        try { await db.SaveChangesAsync(); }
        catch (DbUpdateException ex) when (ex.InnerException is SqlException { Number: 2601 or 2627 })
        { throw new BusinessException("Email này đã được đăng ký.", BusinessError.Conflict); }
        var sent = await tokens.Issue(user, "verify");
        return new RegistrationResponse(sent ? "Đã tạo tài khoản. Hãy kiểm tra thư xác minh trước khi thêm địa chỉ giao hàng." : "Đã tạo tài khoản nhưng chưa gửi được thư. Hãy thử gửi lại email xác minh.", sent);
    }

    public async Task<AccountUser> Login(LoginRequest request)
    {
        if (!ValidEmail(request.Email) || request.Password is not { Length: > 0 and <= 128 })
            throw new BusinessException("Email hoặc mật khẩu không đúng.", BusinessError.Unauthorized);
        var email = request.Email!.Trim().ToLowerInvariant();
        var user = await db.Users.SingleOrDefaultAsync(user => user.Email.ToUpper() == email.ToUpper());
        var result = passwords.Verify(user, request.Password);
        if (user is null || !user.IsActive || result == PasswordVerificationResult.Failed)
            throw new BusinessException("Email hoặc mật khẩu không đúng.", BusinessError.Unauthorized);
        if (result == PasswordVerificationResult.SuccessRehashNeeded)
        { user.PasswordHash = passwords.Hash(user, request.Password); await db.SaveChangesAsync(); }
        return user;
    }

    public async Task ForgotPassword(EmailRequest request)
    {
        if (!ValidEmail(request.Email)) throw new BusinessException("Vui lòng nhập email hợp lệ.");
        var email = request.Email!.Trim().ToLowerInvariant();
        var user = await db.Users.SingleOrDefaultAsync(user => user.Email.ToUpper() == email.ToUpper() && user.IsActive);
        if (user is not null) await tokens.Issue(user, "reset");
    }

    public async Task<string> ResendVerification(int userId)
    {
        var user = await db.Users.SingleAsync(user => user.UserId == userId);
        if (user.EmailConfirmed) return "Email của bạn đã được xác minh.";
        if (!await tokens.Issue(user, "verify"))
            throw new BusinessException("Chưa gửi được thư hoặc bạn vừa yêu cầu. Chờ ít nhất 60 giây rồi thử lại.", BusinessError.RateLimited);
        return "Đã gửi thư xác minh. Liên kết có hiệu lực 24 giờ.";
    }

    public async Task VerifyEmail(TokenRequest request)
    {
        if (await tokens.Consume(request.Token, "verify") is null)
            throw new BusinessException("Liên kết xác minh không hợp lệ, đã dùng hoặc hết hạn.");
    }

    public async Task ResetPassword(ResetRequest request)
    {
        if (!ValidPassword(request.Password, request.ConfirmPassword)) throw new BusinessException("Mật khẩu cần 10–128 ký tự và xác nhận phải trùng nhau.");
        if (await tokens.Consume(request.Token, "reset", request.Password) is null)
            throw new BusinessException("Liên kết khôi phục không hợp lệ, đã dùng hoặc hết hạn.");
    }
}
