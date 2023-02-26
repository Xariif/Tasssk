using ToDoAPI.Helpers.Models;

namespace TassskAPI.Helpers.Models
{
    public class MongoNestedArrayHelper<T> : MongoFilterHelper
    {
        public string? NestedArray { get; set; }
        public T? NestedObject { get; set; }
    }
}
