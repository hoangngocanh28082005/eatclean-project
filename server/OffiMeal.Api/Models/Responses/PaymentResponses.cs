
namespace OffiMeal.Api.Models.Responses;

public record PaymentResponse(
    int PaymentId,
    int? OrderId,
    int? SubscriptionId,
    decimal Amount,
    string PaymentMethod,
    string Status,
    string? TransactionCode,
    DateTime? PaidAt,
    DateTime CreatedAt
);
