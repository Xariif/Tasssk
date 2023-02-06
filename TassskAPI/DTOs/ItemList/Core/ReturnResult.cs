#nullable enable

namespace ToDoAPI.DTOs.Core
{
    public class ReturnResult<T>
    {
     public ResultCodes? Code { get; set; }
        public string? Message { get; set; }
        public T? Data { get; set; }
    }

    public enum ResultCodes
    {
        Ok,
        NoData,
        Fail,
        ServiceUnavailable
    }
}
