namespace OffiMeal.Api.Models.Entities;

public sealed class Payment
{
    public int PaymentId { get; set; }

    public int? SubscriptionId { get; set; }
    public int? OrderId { get; set; }

    public int UserId { get; set; }

    public decimal Amount { get; set; }

    public string PaymentMethod { get; set; } = "BankTransfer";
    public string Status { get; set; } = "Pending";

    public string? TransactionCode { get; set; }

    public DateTime? PaidAt { get; set; }
    public DateTime CreatedAt { get; set; }
}