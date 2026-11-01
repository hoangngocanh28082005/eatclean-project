
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

public record PendingPaymentResponse(
    int PaymentId,
    int? SubscriptionId,
    string? PackageName,
    string CustomerName,
    string CustomerEmail,
    string? CustomerPhone,
    decimal Amount,
    DateTime CreatedAt
);
