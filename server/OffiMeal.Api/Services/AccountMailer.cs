using System.Net;
using System.Net.Mail;
using System.Text.Json;

namespace OffiMeal.Api.Services;

public sealed class AccountMailer(IConfiguration config, IWebHostEnvironment env, ILogger<AccountMailer> logger)
{
    public async Task<bool> Send(string email, string purpose, string token)
    {
        var frontend = config["Email:FrontendUrl"] ?? "http://localhost:5173";
        var route = purpose == "verify" ? "xac-minh-email" : "dat-lai-mat-khau";
        // Fragment keeps the token out of HTTP request URLs and server access logs.
        var link = $"{frontend.TrimEnd('/')}/{route}#token={token}";
        var subject = purpose == "verify" ? "Xác minh email OffiMeal" : "Đặt lại mật khẩu OffiMeal";
        try
        {
            if (config["Email:Mode"] == "Local" && env.IsDevelopment())
            {
                var directory = Path.Combine(env.ContentRootPath, "App_Data", "mail");
                Directory.CreateDirectory(directory);
                await File.WriteAllTextAsync(Path.Combine(directory, $"{Guid.NewGuid():N}.json"), JsonSerializer.Serialize(new { to = email, subject, link, purpose }, new JsonSerializerOptions { WriteIndented = true }));
                return true;
            }
            var host = config["Email:SmtpHost"] ?? throw new InvalidOperationException("SMTP is not configured");
            using var client = new SmtpClient(host, config.GetValue("Email:SmtpPort", 587)) { EnableSsl = true, UseDefaultCredentials = false };
            client.Credentials = new NetworkCredential(config["Email:Username"], config["Email:Password"]);
            using var message = new MailMessage(config["Email:From"]!, email, subject, $"{subject}\n\n{link}\n\nNếu bạn không yêu cầu, hãy bỏ qua thư này.");
            await client.SendMailAsync(message); return true;
        }
        catch (Exception ex) when (ex is SmtpException or IOException or InvalidOperationException or ArgumentException)
        {
            logger.LogWarning("Account mail delivery failed ({ErrorType}); no tokens logged.", ex.GetType().Name);
            return false;
        }
    }
}
