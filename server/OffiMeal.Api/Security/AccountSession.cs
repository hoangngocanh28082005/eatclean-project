using System.Security.Claims;
using OffiMeal.Api.Models.Entities;

namespace OffiMeal.Api.Security;

public static class AccountSession
{
    public const string Scheme = "OffiMealCookie";
    public const string VerifiedPolicy = "Verified";
    public const string AdminPolicy = "Admin";
    public static int UserId(ClaimsPrincipal principal) => int.Parse(principal.FindFirstValue(ClaimTypes.NameIdentifier)!);

    public static ClaimsPrincipal Principal(AccountUser user) => new(new ClaimsIdentity(new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()), new Claim(ClaimTypes.Name, user.FullName),
        new Claim(ClaimTypes.Role, user.Role), new Claim("stamp", user.SecurityStamp.ToString()),
        new Claim("verified", user.EmailConfirmed ? "true" : "false")
    }, Scheme));
}
