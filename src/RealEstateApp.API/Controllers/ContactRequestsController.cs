using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateApp.Application.DTOs.ContactRequests;
using RealEstateApp.Application.Interfaces.Services;

namespace RealEstateApp.API.Controllers;

[Authorize]
public class ContactRequestsController : BaseController
{
    private readonly IContactRequestService _contactRequestService;

    public ContactRequestsController(IContactRequestService contactRequestService)
    {
        _contactRequestService = contactRequestService;
    }

    // POST api/contactrequests
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateContactRequest request)
    {
        var result = await _contactRequestService.CreateAsync(CurrentUserId, request);
        return Ok(result);
    }

    // GET api/contactrequests/property/{propertyId}
    [HttpGet("property/{propertyId:guid}")]
    public async Task<IActionResult> GetByProperty(Guid propertyId)
    {
        var requests = await _contactRequestService.GetByPropertyIdAsync(propertyId, CurrentUserId);
        return Ok(requests);
    }
}