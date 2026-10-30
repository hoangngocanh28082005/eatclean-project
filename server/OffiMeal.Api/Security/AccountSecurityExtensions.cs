using System.Security.Claims;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using OffiMeal.Api.Data;

namespace OffiMeal.Api.Security;

public static class AccountSecurityExtensions
{
    public static IServiceCollection AddAccountSecurity(this IServiceCollection services, IHostEnvironment environment)
    {
        services.AddAntiforgery(options =>
        {
            options.HeaderName = "X-CSRF-TOKEN";
            options.Cookie.Name = "OffiMeal.Csrf";
            options.Cookie.SameSite = SameSiteMode.Strict;
            options.Cookie.SecurePolicy = environment.IsDevelopment() ? CookieSecurePolicy.SameAsRequest : CookieSecurePolicy.Always;
        });
        services.AddAuthentication(AccountSession.Scheme).AddCookie(AccountSession.Scheme, options =>
        {
            options.Cookie.Name = "OffiMeal.Session";
            options.Cookie.HttpOnly = true;
            options.Cookie.SameSite = SameSiteMode.Lax;
            options.Cookie.SecurePolicy = environment.IsDevelopment() ? CookieSecurePolicy.SameAsRequest : CookieSecurePolicy.Always;
            options.ExpireTimeSpan = TimeSpan.FromHours(8);
            options.SlidingExpiration = false;
            options.Events.OnRedirectToLogin = context => { context.Response.StatusCode = 401; return Task.CompletedTask; };
            options.Events.OnRedirectToAccessDenied = context => { context.Response.StatusCode = 403; return Task.CompletedTask; };
            options.Events.OnValidatePrincipal = async context =>
            {
                var db = context.HttpContext.RequestServices.GetRequiredService<OffiMealDbContext>();
                if (!int.TryParse(context.Principal?.FindFirstValue(ClaimTypes.NameIdentifier), out var id)) { context.RejectPrincipal(); return; }
                var user = await db.Users.AsNoTracking().SingleOrDefaultAsync(user => user.UserId == id);
                if (user is null || !user.IsActive || user.SecurityStamp.ToString() != context.Principal?.FindFirstValue("stamp"))
                {
                    context.RejectPrincipal();
                    await context.HttpContext.SignOutAsync(AccountSession.Scheme);
                }
                else context.ReplacePrincipal(AccountSession.Principal(user));
            };
        });
        services.AddAuthorization(options =>
        {
            options.AddPolicy(AccountSession.VerifiedPolicy, policy => policy.RequireAuthenticatedUser().RequireClaim("verified", "true"));
            options.AddPolicy(AccountSession.AdminPolicy, policy => policy.RequireAuthenticatedUser().RequireRole("Admin"));
        });
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = 429;
            options.AddPolicy("accounts", context => RateLimitPartition.GetFixedWindowLimiter(
                context.Connection.RemoteIpAddress?.ToString() ?? "local", _ => new FixedWindowRateLimiterOptions
                { PermitLimit = 30, Window = TimeSpan.FromMinutes(15), QueueLimit = 0 }));
        });
        return services;
    }
}
