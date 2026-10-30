using Microsoft.AspNetCore.Identity;
using OffiMeal.Api.Models.Entities;

namespace OffiMeal.Api.Services;

public sealed class PasswordService
{
    private readonly PasswordHasher<AccountUser> hasher = new();
    private readonly string dummyHash;
    public PasswordService() => dummyHash = hasher.HashPassword(new(), "unused-timing-placeholder");
    public string Hash(AccountUser user, string password) => hasher.HashPassword(user, password);
    public PasswordVerificationResult Verify(AccountUser? user, string password)
    {
        try { return hasher.VerifyHashedPassword(user ?? new(), user?.PasswordHash ?? dummyHash, password); }
        catch (FormatException) { return PasswordVerificationResult.Failed; }
    }
}
