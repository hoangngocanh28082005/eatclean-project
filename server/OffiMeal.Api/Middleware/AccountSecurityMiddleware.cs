using Microsoft.AspNetCore.Antiforgery;

namespace OffiMeal.Api.Middleware;

public sealed class AccountSecurityMiddleware(RequestDelegate next)
{
    private static readonly string[] ProtectedPaths = ["/api/auth", "/api/account", "/api/admin", "/api/meals", "/api/orders", "/api/subscriptions", "/api/payments"];

    public async Task InvokeAsync(HttpContext context, IAntiforgery antiforgery)
    {
        context.Response.Headers["Referrer-Policy"] = "no-referrer";
        if (ProtectedPaths.Any(path => context.Request.Path.StartsWithSegments(path)))
        {
            context.Response.Headers.CacheControl = "no-cache, no-store";
            context.Response.Headers.Pragma = "no-cache";
            if (!HttpMethods.IsGet(context.Request.Method) && !HttpMethods.IsHead(context.Request.Method))
            {
                try { await antiforgery.ValidateRequestAsync(context); }
                catch (AntiforgeryValidationException)
                {
                    context.Response.StatusCode = 400;
                    await context.Response.WriteAsJsonAsync(new { message = "Phiên bảo mật không hợp lệ. Vui lòng tải lại trang và thử lại." });
                    return;
                }
            }
        }
        await next(context);
    }
}
