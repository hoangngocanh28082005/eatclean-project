
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using OffiMeal.Api.Data;
using OffiMeal.Api.Models.Entities;
using OffiMeal.Api.Models.Requests;
using OffiMeal.Api.Models.Responses;
using OffiMeal.Api.Security;

namespace OffiMeal.Api.Controllers;

[ApiController]
[Route("api/subscriptions")]
[Authorize]
public class SubscriptionsController : ControllerBase
{
    private readonly OffiMealDbContext _context;

    public SubscriptionsController(OffiMealDbContext context)
    {
        _context = context;
    }

    // POST: api/subscriptions
    [HttpPost]
    [Authorize(Policy = AccountSession.VerifiedPolicy)]
    public async Task<IActionResult> CreateSubscription(
        CreateSubscriptionRequest request)
    {
        int userId = AccountSession.UserId(User);

        var package = await _context.Packages
            .FirstOrDefaultAsync(p =>
                p.PackageId == request.PackageId &&
                p.IsActive);

        if (package == null)
        {
            return NotFound(new { message = "Không tìm thấy gói ăn." });
        }

        if (request.StartDate.Date < DateTime.Today)
        {
            return BadRequest(new
            {
                message = "Ngày bắt đầu không được ở trong quá khứ."
            });
        }

        if (request.MealPlanId.HasValue)
        {
            bool planExists = await _context.MealPlans.AnyAsync(p =>
                p.MealPlanId == request.MealPlanId.Value &&
                p.IsActive);

            if (!planExists)
            {
                return BadRequest(new { message = "Không tìm thấy thực đơn." });
            }
        }

        var subscription = new Subscription
        {
            UserId = userId,
            PackageId = package.PackageId,
            MealPlanId = request.MealPlanId,
            StartDate = request.StartDate.Date,
            EndDate = request.StartDate.Date.AddDays(package.DurationDays - 1),
            Status = "Pending",
            TotalPrice = package.Price,
            RemainingMeals = package.MealCount,
            CreatedAt = DateTime.Now
        };

        await using var transaction = await _context.Database.BeginTransactionAsync();

        _context.Subscriptions.Add(subscription);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ex.InnerException is SqlException { Number: 2601 or 2627 })
        {
            return Conflict(new
            {
                message = "Bạn đã có gói này đang chờ thanh toán. Xem tại trang Đơn hàng."
            });
        }

        // Thu tien truoc: goi chi hoat dong sau khi khoan thanh toan nay duoc xac nhan
        var payment = new Payment
        {
            SubscriptionId = subscription.SubscriptionId,
            UserId = userId,
            Amount = subscription.TotalPrice,
            PaymentMethod = "BankTransfer",
            Status = "Pending",
            CreatedAt = DateTime.Now
        };

        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return Ok(new
        {
            message = "Đã tạo gói, đang chờ thanh toán.",
            subscriptionId = subscription.SubscriptionId,
            paymentId = payment.PaymentId,
            amount = payment.Amount
        });
    }

    // GET: api/subscriptions
    [HttpGet]
    public async Task<IActionResult> GetUserSubscriptions()
    {
        int userId = AccountSession.UserId(User);

        var subscriptions = await _context.Subscriptions
            .AsNoTracking()
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.CreatedAt)
            .Select(s => new SubscriptionResponse(
                s.SubscriptionId,
                s.PackageId,
                s.Package.Name,
                s.Package.MealCount,
                s.RemainingMeals,
                s.StartDate,
                s.EndDate,
                s.Status,
                s.TotalPrice
            ))
            .ToListAsync();

        return Ok(subscriptions);
    }

    // GET: api/subscriptions/1
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetSubscription(int id)
    {
        int userId = AccountSession.UserId(User);

        var subscription = await _context.Subscriptions
            .AsNoTracking()
            .Where(s =>
                s.SubscriptionId == id &&
                s.UserId == userId)
            .Select(s => new SubscriptionResponse(
                s.SubscriptionId,
                s.PackageId,
                s.Package.Name,
                s.Package.MealCount,
                s.RemainingMeals,
                s.StartDate,
                s.EndDate,
                s.Status,
                s.TotalPrice
            ))
            .FirstOrDefaultAsync();

        if (subscription == null)
        {
            return NotFound(new
            {
                message = "Subscription not found."
            });
        }

        return Ok(subscription);
    }
}
