using System.ComponentModel.DataAnnotations;

namespace OffiMeal.Api.Models.Requests;

public sealed class MealRequest
{
    [Required]
    [StringLength(150)]
    public string Name { get; set; } = "";

    [StringLength(1000)]
    public string? Description { get; set; }

    [Required]
    [RegularExpression("Breakfast|Lunch|Dinner|Snack")]
    public string MealType { get; set; } = "";

    [Range(0, 10000)]
    public decimal Calories { get; set; }

    [Range(0, 1000)]
    public decimal ProteinG { get; set; }

    [Range(0, 1000)]
    public decimal CarbsG { get; set; }

    [Range(0, 1000)]
    public decimal FatG { get; set; }

    [Range(0, 100000000)]
    public decimal Price { get; set; }

    [StringLength(500)]
    public string? ImageUrl { get; set; }

    [StringLength(100)]
    public string? ServingSize { get; set; }

    [StringLength(500)]
    public string? Allergens { get; set; }

    [RegularExpression("EatClean|Keto|LowCarb|Balanced")]
    public string? Goal { get; set; }

    public bool IsAvailable { get; set; } = true;
}