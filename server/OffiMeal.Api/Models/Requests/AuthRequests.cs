namespace OffiMeal.Api.Models.Requests;

public record RegisterRequest(string? FullName, string? Email, string? Password, string? ConfirmPassword);
public record LoginRequest(string? Email, string? Password);
public record EmailRequest(string? Email);
public record TokenRequest(string? Token);
public record ResetRequest(string? Token, string? Password, string? ConfirmPassword);
public record ChangePasswordRequest(string? CurrentPassword, string? Password, string? ConfirmPassword);
