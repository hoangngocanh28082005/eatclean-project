namespace OffiMeal.Api.Models.Entities;

public sealed class Order
{
    public int OrderId { get; set; }
    public int UserId { get; set; }
    public int? SubscriptionId { get; set; }
    public int AddressId { get; set; }

    public DateTime OrderDate { get; set; }
    public DateTime DeliveryDate { get; set; }

    public string? DeliverySlot { get; set; }
    public string Status { get; set; } = "Pending";

    public decimal TotalAmount { get; set; }
    public string? Note { get; set; }
}