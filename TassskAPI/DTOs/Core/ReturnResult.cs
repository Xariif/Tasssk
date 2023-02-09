#nullable enable

using TassskAPI.DTOs.Core;

namespace TassskAPI.DTOs.Core
{
    public class ReturnResult<T>
    {
        public ResultCodes? Code { get; set; }
        public string? Message { get; set; }
        public T? Data { get; set; }
    }

    public enum ResultCodes
    {
        Ok = 200,
        NoData = 204,
        BadRequest = 400,
        Unauthorized = 401,
        ResourceAlreadyExists = 409,
        ServiceUnavailable = 503
    }
}
