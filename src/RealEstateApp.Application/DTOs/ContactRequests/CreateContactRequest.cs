namespace RealEstateApp.Application.DTOs.ContactRequests;

public class CreateContactRequest
{
    public Guid PropertyId { get; set; }
    public string Message { get; set; } = string.Empty;
}