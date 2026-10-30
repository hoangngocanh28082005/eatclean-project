namespace OffiMeal.Api.Models.Entities;

public sealed class AccountUser
{
    public int UserId { get; set; }
    public string FullName { get; set; } = "";
    public string Email { get; set; } = "";
    public string? Phone { get; set; }
    public string PasswordHash { get; set; } = "";
    public string Role { get; set; } = "Customer";
    public bool IsActive { get; set; } = true;
    public bool EmailConfirmed { get; set; }
    public Guid SecurityStamp { get; set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
