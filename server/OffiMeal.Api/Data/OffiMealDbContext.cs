using Microsoft.EntityFrameworkCore;
using OffiMeal.Api.Models.Entities;

namespace OffiMeal.Api.Data;

public sealed class OffiMealDbContext(
    DbContextOptions<OffiMealDbContext> options) : DbContext(options)
{
    public DbSet<Meal> Meals => Set<Meal>();

    public DbSet<SubscriptionPackage> Packages => Set<SubscriptionPackage>();

    public DbSet<AccountUser> Users => Set<AccountUser>();

    public DbSet<AccountToken> Tokens => Set<AccountToken>();

    public DbSet<DeliveryAddress> Addresses => Set<DeliveryAddress>();

    public DbSet<MealPlan> MealPlans => Set<MealPlan>();

    public DbSet<MealPlanDetail> MealPlanDetails => Set<MealPlanDetail>();

    public DbSet<Subscription> Subscriptions => Set<Subscription>();

    public DbSet<Order> Orders => Set<Order>();

    public DbSet<OrderDetail> OrderDetails => Set<OrderDetail>();

    public DbSet<Payment> Payments => Set<Payment>();

    public DbSet<SubscriptionRequest> SubscriptionRequests
        => Set<SubscriptionRequest>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // USERS
        modelBuilder.Entity<AccountUser>(entity =>
        {
            entity.ToTable("Users", "dbo");

            entity.HasKey(x => x.UserId);

            entity.Property(x => x.SecurityStamp)
                .IsConcurrencyToken();
        });

        // ACCOUNT TOKENS
        modelBuilder.Entity<AccountToken>(entity =>
        {
            entity.ToTable("AccountTokens", "dbo");

            entity.HasKey(x => x.TokenHash);

            entity.Property(x => x.TokenHash)
                .HasColumnType("varchar(64)");

            entity.Property(x => x.Purpose)
                .HasColumnType("varchar(10)");
        });

        // DELIVERY ADDRESSES
        modelBuilder.Entity<DeliveryAddress>(entity =>
        {
            entity.ToTable("DeliveryAddresses", "dbo");

            entity.HasKey(x => x.AddressId);
        });

        // MEALS
        modelBuilder.Entity<Meal>(entity =>
        {
            entity.ToTable("Meals", "dbo");

            entity.HasKey(x => x.MealId);

            entity.Property(x => x.Calories).HasPrecision(8, 2);
            entity.Property(x => x.ProteinG).HasPrecision(8, 2);
            entity.Property(x => x.CarbsG).HasPrecision(8, 2);
            entity.Property(x => x.FatG).HasPrecision(8, 2);
            entity.Property(x => x.Price).HasPrecision(12, 2);
        });

        // SUBSCRIPTION PACKAGES
        modelBuilder.Entity<SubscriptionPackage>(entity =>
        {
            entity.ToTable("SubscriptionPackages", "dbo");

            entity.HasKey(x => x.PackageId);

            entity.Property(x => x.Price).HasPrecision(12, 2);
        });

        // MEAL PLANS
        modelBuilder.Entity<MealPlan>(entity =>
        {
            entity.ToTable("MealPlans", "dbo");

            entity.HasKey(x => x.MealPlanId);
        });

        // MEAL PLAN DETAILS
        modelBuilder.Entity<MealPlanDetail>(entity =>
        {
            entity.ToTable("MealPlanDetails", "dbo");

            entity.HasKey(x => new
            {
                x.MealPlanId,
                x.WeekNumber,
                x.DayNumber,
                x.MealId
            });
        });

        // SUBSCRIPTIONS
        modelBuilder.Entity<Subscription>(entity =>
        {
            entity.ToTable("Subscriptions", "dbo");

            entity.HasKey(x => x.SubscriptionId);

            entity.Property(x => x.TotalPrice)
                .HasPrecision(12, 2);
        });

        // ORDERS
        modelBuilder.Entity<Order>(entity =>
        {
            entity.ToTable("Orders", "dbo");

            entity.HasKey(x => x.OrderId);

            entity.Property(x => x.TotalAmount)
                .HasPrecision(12, 2);
        });

        // ORDER DETAILS
        modelBuilder.Entity<OrderDetail>(entity =>
        {
            entity.ToTable("OrderDetails", "dbo");

            entity.HasKey(x => x.OrderDetailId);

            entity.Property(x => x.UnitPrice)
                .HasPrecision(12, 2);
        });

        // PAYMENTS
        modelBuilder.Entity<Payment>(entity =>
        {
            entity.ToTable("Payments", "dbo");

            entity.HasKey(x => x.PaymentId);

            entity.Property(x => x.Amount)
                .HasPrecision(12, 2);
        });

        // SUBSCRIPTION REQUESTS
        modelBuilder.Entity<SubscriptionRequest>(entity =>
        {
            entity.ToTable("SubscriptionRequests", "dbo");

            entity.HasKey(x => x.RequestId);
        });
        modelBuilder.Entity<Subscription>()
    .HasOne(s => s.Package)
    .WithMany()
    .HasForeignKey(s => s.PackageId);
    }
}