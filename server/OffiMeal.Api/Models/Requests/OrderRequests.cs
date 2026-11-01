
namespace OffiMeal.Api.Models.Requests;

public record CreateOrderRequest(
    int SubscriptionId,
    int AddressId,
    DateTime DeliveryDate,
    string? DeliverySlot,
    string? Note,
    List<OrderItemRequest> Items
);

public record OrderItemRequest(
    int MealId,
    int Quantity
);
