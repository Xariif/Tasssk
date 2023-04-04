using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;
using TassskAPI.Models;
using TassskAPI.Services;
using ToDoAPI.DTOs;
using ToDoAPI.DTOs.User;
using ToDoAPI.Interfaces;

namespace ToDoAPI.Services
{
    public class UserService : BaseService
    {
        private readonly ITokenService _tokenService;
        public UserService(ITokenService tokenService)
        {
            _tokenService = tokenService;
        }

        public async Task<UserDataDTO> Login(LoginDTO loginDTO)
        {

            var user = await db.GetCollection<User>(UserCollection).Find(x => x.Email == loginDTO.Email).FirstOrDefaultAsync() ?? throw new ArgumentException("User not exist");
            using var hmac = new HMACSHA512(user.PasswordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDTO.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i])
                    throw new ArgumentException("Bad password");
            }

            return new UserDataDTO
            {
                Email = user.Email,
                DarkMode = user.DarkMode,
                Token = _tokenService.CreateTokenDisciple(user)
            };
        }

        public async Task Register(RegisterDTO registerDTO)
        {
            using var hmac = new HMACSHA512();

            var user = await db.GetCollection<User>(UserCollection).Find(x => x.Email == registerDTO.Email).FirstOrDefaultAsync();

            if (user != null)
                throw new ArgumentException(message: "Email already exist!");

            var newUser = new User
            {
                Email = registerDTO.Email,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password)),
                PasswordSalt = hmac.Key,
                BirthDate = registerDTO.BirthDate,
            };
            await db.GetCollection<User>(UserCollection).InsertOneAsync(newUser);
        }

        public async Task<bool> ValidateToken(string token)
        {
            var mySecret = "agCa0sg!@FaWFG!KO*UY5hsdf1aq!";
            var mySecurityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(mySecret));

            var myIssuer = "http://mysite.com";
            var myAudience = "http://myaudience.com";

            var tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = myIssuer,
                    ValidAudience = myAudience,
                    IssuerSigningKey = mySecurityKey
                }, out SecurityToken validatedToken);
            }
            catch
            {
                throw new ArgumentException(message: "Token invalid");
            }
            return true;
        }

        public async Task<bool> DeleteAccount(string email)
        {
            var res = await db.GetCollection<User>(UserCollection).DeleteOneAsync(x => x.Email == email);

            if (res.DeletedCount > 0) { return true; }
            else { return false; }
        }

        public async Task<bool> ChangeTheme(string email)
        {
            var user = await db.GetCollection<User>(UserCollection).Find(x => x.Email == email).FirstOrDefaultAsync();

            user.DarkMode = !user.DarkMode;
            await db.GetCollection<User>(UserCollection).FindOneAndReplaceAsync<User>(x => x.Email == email, user);
            return user.DarkMode;
        }

        public async Task<bool> ChangePassword(string email, string password)
        {
            var user = await db.GetCollection<User>(UserCollection).Find(x => x.Email == email).FirstOrDefaultAsync();

            using var hmac = new HMACSHA512();
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            user.PasswordSalt = hmac.Key;

            await db.GetCollection<User>(UserCollection).FindOneAndReplaceAsync<User>(x => x.Email == email, user);

            return true;
        }
    }
}
