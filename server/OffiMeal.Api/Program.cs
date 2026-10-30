using Microsoft.EntityFrameworkCore;
using OffiMeal.Api.Data;
using OffiMeal.Api.Middleware;
using OffiMeal.Api.Security;
using OffiMeal.Api.Services;

var builder = WebApplication.CreateBuilder(args);
var connection = builder.Configuration.GetConnectionString("OffiMealDB")
    ?? throw new InvalidOperationException("Missing ConnectionStrings:OffiMealDB configuration.");

builder.Services.AddDbContext<OffiMealDbContext>(options => options.UseSqlServer(connection));
builder.Services.AddControllers();
builder.Services.AddProblemDetails();
builder.Services.AddAccountSecurity(builder.Environment);
builder.Services.AddSingleton<PasswordService>();
builder.Services.AddScoped<AccountMailer>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<AccountService>();
builder.Services.AddScoped<AddressService>();
builder.Services.AddScoped<CatalogService>();

var app = builder.Build();
app.UseExceptionHandler();
app.UseMiddleware<BusinessExceptionMiddleware>();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseRateLimiter();
app.UseMiddleware<AccountSecurityMiddleware>();
app.MapControllers();

// SQL schema is managed explicitly; startup never changes existing tables.
app.Run();
