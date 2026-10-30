using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OffiMeal.Api.Models.Requests;
using OffiMeal.Api.Security;
using OffiMeal.Api.Services;

namespace OffiMeal.Api.Controllers;

[ApiController]
[Route("api/account/addresses")]
[Authorize]
public sealed class AddressesController(AddressService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> List() => Ok(await service.List(AccountSession.UserId(User)));

    [HttpPost]
    [Authorize(Policy = AccountSession.VerifiedPolicy)]
    public async Task<IActionResult> Create(AddressRequest request) => Ok(await service.Save(AccountSession.UserId(User), null, request));

    [HttpPut("{id:int}")]
    [Authorize(Policy = AccountSession.VerifiedPolicy)]
    public async Task<IActionResult> Update(int id, AddressRequest request) => Ok(await service.Save(AccountSession.UserId(User), id, request));

    [HttpDelete("{id:int}")]
    [Authorize(Policy = AccountSession.VerifiedPolicy)]
    public async Task<IActionResult> Delete(int id)
    {
        await service.Delete(AccountSession.UserId(User), id);
        return NoContent();
    }
}
