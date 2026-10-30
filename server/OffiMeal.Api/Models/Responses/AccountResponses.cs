using Microsoft.EntityFrameworkCore;
using OffiMeal.Api.Models.Entities;

namespace OffiMeal.Api.Models.Responses;

public record AccountResponse(int UserId, string FullName, string Email, string? Phone, string Role, bool EmailConfirmed)
{
    public static AccountResponse From(AccountUser user) => new(user.UserId, user.FullName, user.Email, user.Phone, user.Role, user.EmailConfirmed);
}

public record MessageResponse(string Message);
public record RegistrationResponse(string Message, bool EmailDelivered);
public record AddressResponse(int AddressId, string RecipientName, string RecipientPhone, string AddressLine, string? Ward, string? District, string City, string? Note, bool IsDefault)
{
    public static AddressResponse From(DeliveryAddress address) => new(address.AddressId, address.RecipientName, address.RecipientPhone, address.AddressLine, address.Ward, address.District, address.City, address.Note, address.IsDefault);
}

public sealed class AccountOrder
{
    public int OrderId { get; set; }
    public DateTime DeliveryDate { get; set; }
    public string Status { get; set; } = "";
    [Precision(12, 2)] public decimal TotalAmount { get; set; }
}
