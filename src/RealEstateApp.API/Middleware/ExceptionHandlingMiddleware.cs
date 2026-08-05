using System.Net;
using System.Text.Json;

namespace RealEstateApp.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        // Map known exception types to HTTP status codes
        (int statusCode, string message) = exception switch
        {
            KeyNotFoundException     => (StatusCodes.Status404NotFound,     exception.Message),
            UnauthorizedAccessException => (StatusCodes.Status403Forbidden, exception.Message),
            InvalidOperationException   => (StatusCodes.Status400BadRequest, exception.Message),
            ArgumentException           => (StatusCodes.Status400BadRequest, exception.Message),
            _                           => (StatusCodes.Status500InternalServerError, exception.Message)
        };

        context.Response.StatusCode = statusCode;

        var response = new
        {
            status  = statusCode,
            message = message
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}