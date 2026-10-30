using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using OffiMeal.Api.Data;
using OffiMeal.Api.Models.Entities;

namespace OffiMeal.Api.Services;

public sealed class TokenService(OffiMealDbContext db, AccountMailer mailer, PasswordService passwords)
{
    private static string HashToken(string token) => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));

    public async Task<bool> Issue(AccountUser user, string purpose)
    {
        await using var transaction = await db.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);
        var cutoff = DateTime.UtcNow.AddSeconds(-60);
        if (await db.Tokens.AnyAsync(token => token.UserId == user.UserId && token.Purpose == purpose && token.CreatedAt > cutoff)) return false;
        await db.Tokens.Where(token => token.UserId == user.UserId && token.Purpose == purpose && token.UsedAt == null)
            .ExecuteUpdateAsync(setters => setters.SetProperty(token => token.UsedAt, DateTime.UtcNow));
        var raw = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
        db.Tokens.Add(new AccountToken
        {
            TokenHash = HashToken(raw), UserId = user.UserId, Purpose = purpose, SecurityStamp = user.SecurityStamp,
            CreatedAt = DateTime.UtcNow, ExpiresAt = purpose == "verify" ? DateTime.UtcNow.AddHours(24) : DateTime.UtcNow.AddMinutes(30)
        });
        await db.SaveChangesAsync();
        await transaction.CommitAsync();
        return await mailer.Send(user.Email, purpose, raw);
    }

    public async Task<AccountUser?> Consume(string? raw, string purpose, string? newPassword = null)
    {
        if (raw is not { Length: 64 } || !raw.All(Uri.IsHexDigit)) return null;
        var hash = HashToken(raw);
        await using var transaction = await db.Database.BeginTransactionAsync();
        var token = await db.Tokens.AsNoTracking().SingleOrDefaultAsync(token => token.TokenHash == hash && token.Purpose == purpose);
        if (token is null || token.UsedAt is not null || token.ExpiresAt <= DateTime.UtcNow) return null;
        var consumed = await db.Tokens.Where(token => token.TokenHash == hash && token.UsedAt == null && token.ExpiresAt > DateTime.UtcNow)
            .ExecuteUpdateAsync(setters => setters.SetProperty(token => token.UsedAt, DateTime.UtcNow));
        if (consumed != 1) return null;
        var user = await db.Users.SingleOrDefaultAsync(user => user.UserId == token.UserId && user.IsActive && user.SecurityStamp == token.SecurityStamp);
        if (user is null) return null;
        if (purpose == "verify") user.EmailConfirmed = true;
        else { user.PasswordHash = passwords.Hash(user, newPassword!); user.SecurityStamp = Guid.NewGuid(); }
        try { await db.SaveChangesAsync(); await transaction.CommitAsync(); return user; }
        catch (DbUpdateConcurrencyException) { return null; }
    }
}
