using OffiMeal.Api.Exceptions;

namespace OffiMeal.Api.Middleware;

public sealed class BusinessExceptionMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try { await next(context); }
        catch (BusinessException exception)
        {
            context.Response.StatusCode = exception.Error switch
            {
                BusinessError.NotFound => 404,
                BusinessError.Conflict => 409,
                BusinessError.Unauthorized => 401,
                BusinessError.RateLimited => 429,
                _ => 400
            };
            await context.Response.WriteAsJsonAsync(new { message = exception.Message });
        }
    }
}
