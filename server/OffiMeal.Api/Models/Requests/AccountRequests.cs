namespace OffiMeal.Api.Models.Requests;

public record UpdateAccountRequest(string? FullName, string? Phone);
public record AddressRequest(string? RecipientName, string? RecipientPhone, string? AddressLine, string? Ward, string? District, string? City, string? Note, bool IsDefault);
