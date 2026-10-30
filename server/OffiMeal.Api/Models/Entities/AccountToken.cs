namespace OffiMeal.Api.Models.Entities;

public sealed class AccountToken
{
    public string TokenHash { get; set; } = "";
    public int UserId { get; set; }
    public string Purpose { get; set; } = "";
    public Guid SecurityStamp { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime? UsedAt { get; set; }
}
