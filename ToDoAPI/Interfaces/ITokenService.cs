using ToDoAPI.Models.User;

namespace ToDoAPI.Interfaces
{
    public interface ITokenService
    {
        string CreateTokenDisciple(User user);
    }
}
