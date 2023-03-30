using TassskAPI.Models;

namespace ToDoAPI.Interfaces
{
    public interface ITokenService
    {
        string CreateTokenDisciple(User user);
    }
}
