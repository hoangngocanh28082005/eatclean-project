using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using OffiMeal.Api.Data;
using OffiMeal.Api.Exceptions;
using OffiMeal.Api.Models.Entities;
using OffiMeal.Api.Models.Requests;
using OffiMeal.Api.Models.Responses;
using static OffiMeal.Api.Security.AccountValidation;

namespace OffiMeal.Api.Services;

public sealed class AddressService(OffiMealDbContext db)
{
    public async Task<List<AddressResponse>> List(int userId) =>
        (await db.Addresses.AsNoTracking().Where(address => address.UserId == userId)
            .OrderByDescending(address => address.IsDefault).ThenBy(address => address.AddressId).ToListAsync())
            .Select(AddressResponse.From).ToList();

    public async Task<AddressResponse> Save(int userId, int? id, AddressRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.RecipientName) || request.RecipientName.Trim().Length > 100 || !ValidPhone(request.RecipientPhone) ||
            string.IsNullOrWhiteSpace(request.AddressLine) || request.AddressLine.Trim().Length > 300 || string.IsNullOrWhiteSpace(request.City) ||
            request.City.Trim().Length > 100 || request.Ward?.Length > 100 || request.District?.Length > 100 || request.Note?.Length > 300)
            throw new BusinessException("Kiểm tra người nhận, điện thoại, địa chỉ và tỉnh/thành phố. Nội dung vượt quá độ dài cho phép.");

        await using var transaction = await db.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);
        var address = id is null ? new DeliveryAddress { UserId = userId } : await db.Addresses.SingleOrDefaultAsync(address => address.AddressId == id && address.UserId == userId);
        if (address is null) throw new BusinessException("Không tìm thấy địa chỉ.", BusinessError.NotFound);
        if (id is not null && await db.Database.SqlQuery<int>($"SELECT COUNT(*) AS Value FROM dbo.Orders WHERE AddressId = {id.Value}").SingleAsync() > 0)
            throw new BusinessException("Địa chỉ đã được dùng trong đơn hàng. Hãy thêm địa chỉ mới để giữ đúng lịch sử giao hàng.", BusinessError.Conflict);
        var makeDefault = request.IsDefault || !await db.Addresses.AnyAsync(address => address.UserId == userId && address.AddressId != (id ?? 0));
        if (makeDefault) await db.Addresses.Where(address => address.UserId == userId && address.IsDefault)
            .ExecuteUpdateAsync(setters => setters.SetProperty(address => address.IsDefault, false));
        address.RecipientName = request.RecipientName.Trim();
        address.RecipientPhone = request.RecipientPhone!.Trim();
        address.AddressLine = request.AddressLine.Trim();
        address.Ward = request.Ward?.Trim();
        address.District = request.District?.Trim();
        address.City = request.City.Trim();
        address.Note = request.Note?.Trim();
        address.IsDefault = makeDefault;
        if (id is null) db.Addresses.Add(address);
        await db.SaveChangesAsync();
        await transaction.CommitAsync();
        return AddressResponse.From(address);
    }

    public async Task Delete(int userId, int id)
    {
        var address = await db.Addresses.SingleOrDefaultAsync(address => address.AddressId == id && address.UserId == userId);
        if (address is null) throw new BusinessException("Không tìm thấy địa chỉ.", BusinessError.NotFound);
        db.Addresses.Remove(address);
        try { await db.SaveChangesAsync(); }
        catch (DbUpdateException ex) when (ex.InnerException is SqlException { Number: 547 })
        { throw new BusinessException("Địa chỉ đã được dùng trong đơn hàng nên không thể xóa. Bạn có thể thêm địa chỉ mới.", BusinessError.Conflict); }
    }
}
