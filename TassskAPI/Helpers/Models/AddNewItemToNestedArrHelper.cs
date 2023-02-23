namespace ToDoAPI.Helpers.Models
{
    public class AddNewItemToNestedArrHelper<T>
    {
        public string ArrayName { get; set; }
        public T ObjectToAdd { get; set; }
    }
}
