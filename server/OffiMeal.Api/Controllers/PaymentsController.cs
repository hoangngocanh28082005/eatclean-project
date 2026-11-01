
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OffiMeal.Api.Data;
using OffiMeal.Api.Models.Entities;
using OffiMeal.Api.Models.Requests;
using OffiMeal.Api.Models.Responses;
using OffiMeal.Api.Security;

namespace OffiMeal.Api.Controllers;

[ApiController]
[Route("api/payments")]
[Authorize]
public class PaymentsController : ControllerBase
{
    private readonly OffiMealDbContext _context;

    public PaymentsController(OffiMealDbContext context)
    {
        _context = context;
    }

    // POST: api/payments
    [HttpPost]
    [Authorize(Policy = AccountSession.VerifiedPolicy)]
    public async Task<IActionResult> CreatePayment(
        CreatePaymentRequest request)
    {
        int userId = AccountSession.UserId(User);

        // Chi duoc thanh toan cho mot don hang hoac mot subscription
        if (request.OrderId.HasValue == request.SubscriptionId.HasValue)
        {
            return BadRequest(new
            {
                message = "Choose either OrderId or SubscriptionId."
            });
        }

        string[] allowedMethods =
        {
            "BankTransfer",
            "EWallet",
            "PaymentGateway",
            "Cash"
        };

        if (!allowedMethods.Contains(request.PaymentMethod))
        {
            return BadRequest(new
            {
                message = "Invalid payment method."
            });
        }

        decimal amount;

        if (request.OrderId.HasValue)
        {
            var order = await _context.Orders
                .FirstOrDefaultAsync(o =>
                    o.OrderId == request.OrderId.Value &&
                    o.UserId == userId);

            if (order == null)
            {
                return NotFound(new { message = "Order not found." });
            }

            if (order.Status == "Cancelled")
            {
                return BadRequest(new
                {
                    message = "Cannot pay for a cancelled order."
                });
            }

            bool alreadyPaid = await _context.Payments.AnyAsync(p =>
                p.OrderId == order.OrderId &&
                p.Status == "Success");

            if (alreadyPaid)
            {
                return BadRequest(new
                {
                    message = "Order has already been paid."
                });
            }

            amount = order.TotalAmount;
        }
        else
        {
            var subscription = await _context.Subscriptions
                .FirstOrDefaultAsync(s =>
                    s.SubscriptionId == request.SubscriptionId!.Value &&
                    s.UserId == userId);

            if (subscription == null)
            {
                return NotFound(new
                {
                    message = "Subscription not found."
                });
            }

            if (subscription.Status == "Cancelled")
            {
                return BadRequest(new
                {
                    message = "Cannot pay for a cancelled subscription."
                });
            }

            bool alreadyPaid = await _context.Payments.AnyAsync(p =>
                p.SubscriptionId == subscription.SubscriptionId &&
                p.Status == "Success");

            if (alreadyPaid)
            {
                return BadRequest(new
                {
                    message = "Subscription has already been paid."
                });
            }

            amount = subscription.TotalPrice;
        }

        bool alreadyPending = await _context.Payments.AnyAsync(p =>
            p.Status == "Pending" &&
            p.OrderId == request.OrderId &&
            p.SubscriptionId == request.SubscriptionId);

        if (alreadyPending)
        {
            return Conflict(new
            {
                message = "Đã có khoản thanh toán đang chờ xác nhận."
            });
        }

        var payment = new Payment
        {
            OrderId = request.OrderId,
            SubscriptionId = request.SubscriptionId,
            UserId = userId,
            Amount = amount,
            PaymentMethod = request.PaymentMethod,
            Status = "Pending",
            CreatedAt = DateTime.Now
        };

        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Payment created. Waiting for confirmation.",
            paymentId = payment.PaymentId,
            amount = payment.Amount,
            status = payment.Status
        });
    }

    // POST: api/payments/1/confirm
    // Admin doi soat chuyen khoan: xac nhan thanh toan va kich hoat goi
    [HttpPost("{id:int}/confirm")]
    [Authorize(Policy = AccountSession.AdminPolicy)]
    public async Task<IActionResult> ConfirmPayment(
        int id,
        ConfirmPaymentRequest request)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();

        // Chi mot request doi duoc Pending -> Success, nen goi khong bi kich hoat hai lan
        int updated = await _context.Payments
            .Where(p => p.PaymentId == id && p.Status == "Pending")
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(p => p.Status, "Success")
                .SetProperty(p => p.TransactionCode, request.TransactionCode)
                .SetProperty(p => p.PaidAt, DateTime.Now));

        if (updated == 0)
        {
            return NotFound(new
            {
                message = "Không tìm thấy khoản thanh toán đang chờ xác nhận."
            });
        }

        int? subscriptionId = await _context.Payments
            .Where(p => p.PaymentId == id)
            .Select(p => p.SubscriptionId)
            .FirstAsync();

        if (subscriptionId.HasValue)
        {
            await _context.Subscriptions
                .Where(s => s.SubscriptionId == subscriptionId && s.Status == "Pending")
                .ExecuteUpdateAsync(setters => setters.SetProperty(s => s.Status, "Active"));
        }

        await transaction.CommitAsync();

        return Ok(new { message = "Đã xác nhận thanh toán." });
    }

    // GET: api/payments/pending
    // Admin xem cac khoan cho doi soat, khoan cu nhat len dau
    [HttpGet("pending")]
    [Authorize(Policy = AccountSession.AdminPolicy)]
    public async Task<IActionResult> GetPendingPayments()
    {
        var payments = await _context.Payments
            .AsNoTracking()
            .Where(p => p.Status == "Pending")
            .OrderBy(p => p.CreatedAt)
            .Join(
                _context.Users,
                p => p.UserId,
                u => u.UserId,
                (p, u) => new PendingPaymentResponse(
                    p.PaymentId,
                    p.SubscriptionId,
                    _context.Subscriptions
                        .Where(s => s.SubscriptionId == p.SubscriptionId)
                        .Select(s => s.Package.Name)
                        .FirstOrDefault(),
                    u.FullName,
                    u.Email,
                    u.Phone,
                    p.Amount,
                    p.CreatedAt
                ))
            .ToListAsync();

        return Ok(payments);
    }

    // GET: api/payments
    [HttpGet]
    public async Task<IActionResult> GetUserPayments()
    {
        int userId = AccountSession.UserId(User);

        var payments = await _context.Payments
            .AsNoTracking()
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new PaymentResponse(
                p.PaymentId,
                p.OrderId,
                p.SubscriptionId,
                p.Amount,
                p.PaymentMethod,
                p.Status,
                p.TransactionCode,
                p.PaidAt,
                p.CreatedAt
            ))
            .ToListAsync();

        return Ok(payments);
    }

    // GET: api/payments/1
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetPayment(int id)
    {
        int userId = AccountSession.UserId(User);

        var payment = await _context.Payments
            .AsNoTracking()
            .Where(p =>
                p.PaymentId == id &&
                p.UserId == userId)
            .Select(p => new PaymentResponse(
                p.PaymentId,
                p.OrderId,
                p.SubscriptionId,
                p.Amount,
                p.PaymentMethod,
                p.Status,
                p.TransactionCode,
                p.PaidAt,
                p.CreatedAt
            ))
            .FirstOrDefaultAsync();

        if (payment == null)
        {
            return NotFound(new
            {
                message = "Payment not found."
            });
        }

        return Ok(payment);
    }
}
