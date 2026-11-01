namespace OffiMeal.Api.Models.Entities;

public sealed class OrderDetail
{
    public int OrderDetailId { get; set; }
    public int OrderId { get; set; }
    public int MealId { get; set; }

    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public Order Order { get; set; } = null!;
}