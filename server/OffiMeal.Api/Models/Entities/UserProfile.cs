namespace OffiMeal.Api.Models.Entities;

public sealed class UserProfile
{
    public int UserId { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public decimal? HeightCm { get; set; }
    public decimal? WeightKg { get; set; }
    public string? Goal { get; set; }
    public string? ActivityLevel { get; set; }
    public decimal? Bmr { get; set; }
    public decimal? Tdee { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
