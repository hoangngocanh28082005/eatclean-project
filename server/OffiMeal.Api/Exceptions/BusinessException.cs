namespace OffiMeal.Api.Exceptions;

public enum BusinessError { Validation, NotFound, Conflict, Unauthorized, RateLimited }

// Services describe business failures; HTTP mapping belongs to middleware.
public sealed class BusinessException(string message, BusinessError error = BusinessError.Validation) : Exception(message)
{
    public BusinessError Error { get; } = error;
}
