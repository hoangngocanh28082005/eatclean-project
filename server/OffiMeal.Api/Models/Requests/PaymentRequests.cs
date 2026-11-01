
namespace OffiMeal.Api.Models.Requests;

public record CreatePaymentRequest(
    int? OrderId,
    int? SubscriptionId,
    string PaymentMethod
);

public record ConfirmPaymentRequest(
    string? TransactionCode
);
