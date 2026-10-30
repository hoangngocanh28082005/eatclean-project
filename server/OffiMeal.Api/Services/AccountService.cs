using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OffiMeal.Api.Data;
using OffiMeal.Api.Exceptions;
using OffiMeal.Api.Models.Requests;
using OffiMeal.Api.Models.Responses;
using static OffiMeal.Api.Security.AccountValidation;

namespace OffiMeal.Api.Services;

public sealed class AccountService(OffiMealDbContext db, PasswordService passwords)
{
    public async Task<AccountResponse> Get(int userId) => AccountResponse.From(await db.Users.AsNoTracking().SingleAsync(user => user.UserId == userId));

    public async Task<AccountResponse> Update(int userId, UpdateAccountRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FullName) || request.FullName.Trim().Length > 100 || (!string.IsNullOrWhiteSpace(request.Phone) && !ValidPhone(request.Phone)))
            throw new BusinessException("Họ tên tối đa 100 ký tự; số điện thoại cần 8–20 ký tự hợp lệ.");
        var user = await db.Users.SingleAsync(user => user.UserId == userId);
        user.FullName = request.FullName.Trim();
        user.Phone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim();
        await db.SaveChangesAsync();
        return AccountResponse.From(user);
    }

    public async Task ChangePassword(int userId, ChangePasswordRequest request)
    {
        if (!ValidPassword(request.Password, request.ConfirmPassword) || request.CurrentPassword is not { Length: > 0 and <= 128 })
            throw new BusinessException("Kiểm tra mật khẩu hiện tại và mật khẩu mới (10–128 ký tự).");
        var user = await db.Users.SingleAsync(user => user.UserId == userId);
        if (passwords.Verify(user, request.CurrentPassword) == PasswordVerificationResult.Failed)
            throw new BusinessException("Mật khẩu hiện tại không đúng.");
        var hash = passwords.Hash(user, request.Password!);
        var stamp = Guid.NewGuid();
        var previousStamp = user.SecurityStamp;
        var changed = await db.Users.Where(user => user.UserId == userId && user.SecurityStamp == previousStamp)
            .ExecuteUpdateAsync(setters => setters.SetProperty(user => user.PasswordHash, hash).SetProperty(user => user.SecurityStamp, stamp));
        if (changed != 1) throw new BusinessException("Tài khoản vừa thay đổi. Hãy đăng nhập lại.", BusinessError.Conflict);
    }

    public async Task<List<AccountOrder>> Orders(int userId) =>
        await db.Database.SqlQuery<AccountOrder>($"SELECT OrderId, DeliveryDate, Status, TotalAmount FROM dbo.Orders WHERE UserId = {userId} ORDER BY OrderId DESC").ToListAsync();
}
