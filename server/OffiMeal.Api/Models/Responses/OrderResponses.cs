
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
