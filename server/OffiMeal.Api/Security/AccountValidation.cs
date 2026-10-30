using System.ComponentModel.DataAnnotations;

namespace OffiMeal.Api.Security;

public static class AccountValidation
{
    public static bool ValidEmail(string? email) => email is { Length: <= 255 } && new EmailAddressAttribute().IsValid(email.Trim());
    public static bool ValidPassword(string? password, string? confirmation) => !string.IsNullOrWhiteSpace(password) && password is { Length: >= 10 and <= 128 } && password == confirmation;
    public static bool ValidPhone(string? phone) => phone is { Length: >= 8 and <= 20 } && phone.All(c => char.IsAsciiDigit(c) || "+- ().".Contains(c)) && phone.Count(char.IsAsciiDigit) >= 8;
}
