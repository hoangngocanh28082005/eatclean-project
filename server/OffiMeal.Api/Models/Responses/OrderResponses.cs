
namespace OffiMeal.Api.Models.Responses;

public record OrderItemResponse(
    int MealId,
    string MealName,
    int Quantity,
    decimal UnitPrice,
    decimal TotalPrice
);

public record OrderResponse(
    int OrderId,
    int AddressId,
    DateTime OrderDate,
    DateTime DeliveryDate,
    string? DeliverySlot,
    string Status,
    decimal TotalAmount,
    string? Note,
    List<OrderItemResponse> Items
);

public record ManagedOrderItemResponse(
    string MealName,
    int Quantity
);

public record ManagedOrderResponse(
    int OrderId,
    DateTime DeliveryDate,
    string? DeliverySlot,
    string Status,
    string? Note,
    string CustomerName,
    string CustomerEmail,
    string RecipientName,
    string RecipientPhone,
    string AddressLine,
    string? Ward,
    string? District,
    string City,
    List<ManagedOrderItemResponse> Items
);
