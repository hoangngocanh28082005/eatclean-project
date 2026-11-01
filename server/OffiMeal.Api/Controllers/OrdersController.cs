
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
[Route("api/orders")]
[Authorize]
public class OrdersController : ControllerBase
{
    // Trang thai dich -> trang thai lien truoc: don chi di tung buoc, khong nhay coc
    private static readonly Dictionary<string, string> PreviousStatus = new()
    {
        ["Confirmed"] = "Pending",
        ["Delivering"] = "Confirmed",
        ["Delivered"] = "Delivering"
    };

    private readonly OffiMealDbContext _context;

    public OrdersController(OffiMealDbContext context)
    {
        _context = context;
    }

    // POST: api/orders
    // Moi don la mot lan giao trong goi da thanh toan: khong thu them tien, tru so bua con lai
    [HttpPost]
    [Authorize(Policy = AccountSession.VerifiedPolicy)]
    public async Task<IActionResult> CreateOrder(CreateOrderRequest request)
    {
        int userId = AccountSession.UserId(User);

        if (request.Items == null || request.Items.Count == 0)
        {
            return BadRequest(new { message = "Đơn phải có ít nhất một món." });
        }

        if (request.Items.Any(i => i.MealId <= 0 || i.Quantity <= 0))
        {
            return BadRequest(new { message = "Món hoặc số lượng không hợp lệ." });
        }

        var deliveryDate = request.DeliveryDate.Date;

        if (deliveryDate <= DateTime.Today)
        {
            return BadRequest(new { message = "Vui lòng đặt trước ngày giao ít nhất 1 ngày." });
        }

        // Kiem tra dia chi
        var address = await _context.Addresses
            .FirstOrDefaultAsync(a =>
                a.AddressId == request.AddressId &&
                a.UserId == userId);

        if (address == null)
        {
            return BadRequest(new { message = "Không tìm thấy địa chỉ giao hàng." });
        }

        // Kiem tra goi: phai dang hoat dong va ngay giao nam trong thoi han goi
        var subscription = await _context.Subscriptions
            .AsNoTracking()
            .FirstOrDefaultAsync(s =>
                s.SubscriptionId == request.SubscriptionId &&
                s.UserId == userId);

        if (subscription == null)
        {
            return BadRequest(new { message = "Không tìm thấy gói ăn." });
        }

        if (subscription.Status != "Active")
        {
            return BadRequest(new { message = "Gói ăn chưa được kích hoạt nên chưa đặt bữa được." });
        }

        if (deliveryDate < subscription.StartDate || deliveryDate > subscription.EndDate)
        {
            return BadRequest(new { message = "Ngày giao nằm ngoài thời hạn của gói ăn." });
        }

        // Gom cac mon trung nhau
        var items = request.Items
            .GroupBy(i => i.MealId)
            .Select(g => new
            {
                MealId = g.Key,
                Quantity = g.Sum(i => i.Quantity)
            })
            .ToList();

        var mealIds = items.Select(i => i.MealId).ToList();

        var meals = await _context.Meals
            .Where(m => mealIds.Contains(m.MealId) && m.IsAvailable)
            .ToListAsync();

        if (meals.Count != mealIds.Count)
        {
            return BadRequest(new
            {
                message = "Có món đã ngừng bán hoặc không tồn tại."
            });
        }

        // Moi ngay giao chi phuc vu cac mon da xep trong thuc don ngay do
        int onMenuCount = await _context.DailyMenus
            .CountAsync(d => d.MenuDate == deliveryDate && mealIds.Contains(d.MealId));

        if (onMenuCount != mealIds.Count)
        {
            return BadRequest(new
            {
                message = "Có món không nằm trong thực đơn của ngày giao."
            });
        }

        int mealsUsed = items.Sum(i => i.Quantity);

        await using var transaction = await _context.Database.BeginTransactionAsync();

        // Tru so bua ngay trong cau UPDATE de hai request dong thoi khong the cung qua kiem tra
        int updated = await _context.Subscriptions
            .Where(s =>
                s.SubscriptionId == subscription.SubscriptionId &&
                s.Status == "Active" &&
                s.RemainingMeals >= mealsUsed)
            .ExecuteUpdateAsync(setters => setters.SetProperty(
                s => s.RemainingMeals,
                s => s.RemainingMeals - mealsUsed));

        if (updated == 0)
        {
            return BadRequest(new { message = "Gói ăn không còn đủ số bữa." });
        }

        var order = new Order
        {
            UserId = userId,
            SubscriptionId = request.SubscriptionId,
            AddressId = request.AddressId,
            OrderDate = DateTime.Now,
            DeliveryDate = deliveryDate,
            DeliverySlot = request.DeliverySlot,
            Status = "Pending",
            TotalAmount = 0,
            Note = request.Note
        };

        _context.Orders.Add(order);

        foreach (var item in items)
        {
            var detail = new OrderDetail
            {
                Order = order,
                MealId = item.MealId,
                Quantity = item.Quantity,
                UnitPrice = 0
            };

            _context.OrderDetails.Add(detail);
        }

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ex.InnerException is SqlException { Number: 2601 or 2627 })
        {
            return Conflict(new { message = "Gói ăn đã có đơn cho ngày giao này." });
        }

        await transaction.CommitAsync();

        return Ok(new
        {
            message = "Đặt bữa thành công.",
            orderId = order.OrderId,
            remainingMeals = subscription.RemainingMeals - mealsUsed
        });
    }

    // GET: api/orders/manage
    // Admin xem don cua moi khach, ngay giao gan nhat len dau
    [HttpGet("manage")]
    [Authorize(Policy = AccountSession.AdminPolicy)]
    public async Task<IActionResult> GetManagedOrders()
    {
        var orders = await (
            from o in _context.Orders.AsNoTracking()
            join u in _context.Users on o.UserId equals u.UserId
            join a in _context.Addresses on o.AddressId equals a.AddressId
            orderby o.DeliveryDate, o.OrderId
            select new { Order = o, u.FullName, u.Email, Address = a }
        ).ToListAsync();

        var orderIds = orders.Select(x => x.Order.OrderId).ToList();

        var details = await _context.OrderDetails
            .AsNoTracking()
            .Where(d => orderIds.Contains(d.OrderId))
            .Join(
                _context.Meals,
                d => d.MealId,
                m => m.MealId,
                (d, m) => new { d.OrderId, m.Name, d.Quantity })
            .ToListAsync();

        var items = details.ToLookup(d => d.OrderId);

        var result = orders.Select(x => new ManagedOrderResponse(
            x.Order.OrderId,
            x.Order.DeliveryDate,
            x.Order.DeliverySlot,
            x.Order.Status,
            x.Order.Note,
            x.FullName,
            x.Email,
            x.Address.RecipientName,
            x.Address.RecipientPhone,
            x.Address.AddressLine,
            x.Address.Ward,
            x.Address.District,
            x.Address.City,
            items[x.Order.OrderId]
                .Select(d => new ManagedOrderItemResponse(d.Name, d.Quantity))
                .ToList()
        ));

        return Ok(result);
    }

    // PATCH: api/orders/1/status
    // Admin chuyen don sang buoc tiep theo
    [HttpPatch("{id:int}/status")]
    [Authorize(Policy = AccountSession.AdminPolicy)]
    public async Task<IActionResult> UpdateStatus(
        int id,
        UpdateOrderStatusRequest request)
    {
        if (!PreviousStatus.TryGetValue(request.Status, out var previous))
        {
            return BadRequest(new { message = "Trạng thái đơn không hợp lệ." });
        }

        if (request.Status == "Delivered")
        {
            bool notDueYet = await _context.Orders.AnyAsync(o =>
                o.OrderId == id &&
                o.Status == previous &&
                o.DeliveryDate > DateTime.Today);

            if (notDueYet)
            {
                return BadRequest(new { message = "Chưa tới ngày giao nên chưa đánh dấu đã giao được." });
            }
        }

        // Dieu kien nam trong cau UPDATE de hai admin bam cung luc khong the cung thanh cong
        int updated = await _context.Orders
            .Where(o => o.OrderId == id && o.Status == previous)
            .ExecuteUpdateAsync(setters => setters.SetProperty(o => o.Status, request.Status));

        if (updated == 0)
        {
            return NotFound(new
            {
                message = "Không tìm thấy đơn ở bước phù hợp. Vui lòng tải lại danh sách."
            });
        }

        return Ok(new { message = "Đã cập nhật trạng thái đơn." });
    }

    // POST: api/orders/1/received
    // Khach xac nhan da nhan bua khi don dang giao
    [HttpPost("{id:int}/received")]
    public async Task<IActionResult> ConfirmReceived(int id)
    {
        int userId = AccountSession.UserId(User);

        int updated = await _context.Orders
            .Where(o =>
                o.OrderId == id &&
                o.UserId == userId &&
                o.Status == "Delivering")
            .ExecuteUpdateAsync(setters => setters.SetProperty(o => o.Status, "Delivered"));

        if (updated == 0)
        {
            return NotFound(new
            {
                message = "Không tìm thấy đơn đang giao."
            });
        }

        return Ok(new { message = "Đã xác nhận nhận hàng." });
    }

    // GET: api/orders
    [HttpGet]
    public async Task<IActionResult> GetUserOrders()
    {
        int userId = AccountSession.UserId(User);

        var orders = await _context.Orders
            .AsNoTracking()
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

        var result = new List<OrderResponse>();

        foreach (var order in orders)
        {
            var details = await _context.OrderDetails
                .AsNoTracking()
                .Where(d => d.OrderId == order.OrderId)
                .Join(
                    _context.Meals,
                    d => d.MealId,
                    m => m.MealId,
                    (d, m) => new OrderItemResponse(
                        m.MealId,
                        m.Name,
                        d.Quantity,
                        d.UnitPrice,
                        d.Quantity * d.UnitPrice
                    ))
                .ToListAsync();

            result.Add(new OrderResponse(
                order.OrderId,
                order.AddressId,
                order.OrderDate,
                order.DeliveryDate,
                order.DeliverySlot,
                order.Status,
                order.TotalAmount,
                order.Note,
                details
            ));
        }

        return Ok(result);
    }

    // GET: api/orders/1
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetOrder(int id)
    {
        int userId = AccountSession.UserId(User);

        var order = await _context.Orders
            .AsNoTracking()
            .FirstOrDefaultAsync(o =>
                o.OrderId == id &&
                o.UserId == userId);

        if (order == null)
        {
            return NotFound(new { message = "Order not found." });
        }

        var details = await _context.OrderDetails
            .AsNoTracking()
            .Where(d => d.OrderId == order.OrderId)
            .Join(
                _context.Meals,
                d => d.MealId,
                m => m.MealId,
                (d, m) => new OrderItemResponse(
                    m.MealId,
                    m.Name,
                    d.Quantity,
                    d.UnitPrice,
                    d.Quantity * d.UnitPrice
                ))
            .ToListAsync();

        var result = new OrderResponse(
            order.OrderId,
            order.AddressId,
            order.OrderDate,
            order.DeliveryDate,
            order.DeliverySlot,
            order.Status,
            order.TotalAmount,
            order.Note,
            details
        );

        return Ok(result);
    }
}
