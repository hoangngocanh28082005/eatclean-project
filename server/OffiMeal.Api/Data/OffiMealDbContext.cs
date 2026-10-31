using Microsoft.EntityFrameworkCore;
using OffiMeal.Api.Models.Entities;

namespace OffiMeal.Api.Data;

// DbContext is the EF Core unit of work; business services own transaction boundaries.
public sealed class OffiMealDbContext(DbContextOptions<OffiMealDbContext> options) : DbContext(options)
{
    public DbSet<Meal> Meals => Set<Meal>();
    public DbSet<SubscriptionPackage> Packages => Set<SubscriptionPackage>();
    public DbSet<AccountUser> Users => Set<AccountUser>();
    public DbSet<AccountToken> Tokens => Set<AccountToken>();
    public DbSet<DeliveryAddress> Addresses => Set<DeliveryAddress>();
    public DbSet<WorkoutPlan> WorkoutPlans => Set<WorkoutPlan>();
    public DbSet<WorkoutLog> WorkoutLogs => Set<WorkoutLog>();
    public DbSet<UserProfile> UserProfiles => Set<UserProfile>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AccountUser>(entity =>
        {
            entity.ToTable("Users", "dbo");
            entity.HasKey(user => user.UserId);
            entity.Property(user => user.SecurityStamp).IsConcurrencyToken();
        });
        modelBuilder.Entity<AccountToken>(entity => { entity.ToTable("AccountTokens", "dbo"); entity.HasKey(token => token.TokenHash); });
        modelBuilder.Entity<DeliveryAddress>(entity => { entity.ToTable("DeliveryAddresses", "dbo"); entity.HasKey(address => address.AddressId); });
        modelBuilder.Entity<Meal>(entity =>
        {
            entity.ToTable("Meals", "dbo");
            entity.HasKey(meal => meal.MealId);
            entity.Property(meal => meal.Calories).HasPrecision(8, 2);
            entity.Property(meal => meal.ProteinG).HasPrecision(8, 2);
            entity.Property(meal => meal.CarbsG).HasPrecision(8, 2);
            entity.Property(meal => meal.FatG).HasPrecision(8, 2);
            entity.Property(meal => meal.Price).HasPrecision(12, 2);
        });
        modelBuilder.Entity<SubscriptionPackage>(entity =>
        {
            entity.ToTable("SubscriptionPackages", "dbo");
            entity.HasKey(package => package.PackageId);
            entity.Property(package => package.Price).HasPrecision(12, 2);
        });
        modelBuilder.Entity<WorkoutPlan>(entity =>
        {
            entity.ToTable("WorkoutPlans", "dbo");
            entity.HasKey(plan => plan.WorkoutPlanId);
        });
        modelBuilder.Entity<WorkoutLog>(entity =>
        {
            entity.ToTable("WorkoutLogs", "dbo");
            entity.HasKey(log => log.WorkoutLogId);
        });
        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.ToTable("UserProfiles", "dbo");
            entity.HasKey(p => p.UserId);
            entity.Property(p => p.HeightCm).HasPrecision(5, 2);
            entity.Property(p => p.WeightKg).HasPrecision(5, 2);
            entity.Property(p => p.Bmr).HasPrecision(8, 2);
            entity.Property(p => p.Tdee).HasPrecision(8, 2);
        });
    }
}
