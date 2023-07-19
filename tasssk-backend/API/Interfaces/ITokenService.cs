using TassskAPI.Models;

namespace TassskAPI.Interfaces
{
    public interface ITokenService
    {
        string CreateTokenDisciple(User user);

        bool ValidateToken(string token);
    }
}
