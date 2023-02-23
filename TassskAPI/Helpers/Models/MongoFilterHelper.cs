namespace ToDoAPI.Helpers.Models
{
    public class MongoFilterHelper
    {
        public string Filter { get; set; }
        public string FilterValue { get; set; }

        public MongoFilterHelper(string filter, string filterValue)
        {
            this.Filter = filter;
            this.FilterValue = filterValue;
        }
    }
}
