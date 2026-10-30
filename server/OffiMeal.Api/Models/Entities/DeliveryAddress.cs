namespace OffiMeal.Api.Models.Entities;

public sealed class DeliveryAddress
{
    public int AddressId { get; set; }
    public int UserId { get; set; }
    public string RecipientName { get; set; } = "";
    public string RecipientPhone { get; set; } = "";
    public string AddressLine { get; set; } = "";
    public string? Ward { get; set; }
    public string? District { get; set; }
    public string City { get; set; } = "";
    public string? Note { get; set; }
    public bool IsDefault { get; set; }
}
