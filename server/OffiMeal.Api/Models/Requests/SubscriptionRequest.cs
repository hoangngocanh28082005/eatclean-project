namespace OffiMeal.Api.Models.Entities;

public sealed class SubscriptionRequest
{
    public int RequestId { get; set; }

    public int SubscriptionId { get; set; }
    public int UserId { get; set; }

    public string RequestType { get; set; } = "";

    public int? OrderDetailId { get; set; }
    public int? NewMealId { get; set; }

    public DateTime? RequestedDate { get; set; }

    public string Reason { get; set; } = "";

    public string Status { get; set; } = "Pending";

    public string? AdminNote { get; set; }

    public DateTime RequestedAt { get; set; }
    public DateTime DeadlineAt { get; set; }

    public DateTime? ProcessedAt { get; set; }
    public int? ProcessedByUserId { get; set; }
}