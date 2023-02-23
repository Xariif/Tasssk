using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;
using TassskAPI.DTOs.User;
using ToDoAPI.DTOs;
using ToDoAPI.DTOs.User;
using ToDoAPI.Helpers;
using ToDoAPI.Helpers.Models;
using ToDoAPI.Interfaces;
using ToDoAPI.Models.ItemList;
using ToDoAPI.Models.User;

namespace ToDoAPI.Services
{
    public class UserService
    {
        private readonly MongoCRUD db;
        private readonly ITokenService _tokenService;
        private readonly string collectionName;

        public UserService(ITokenService tokenService)
        {
            collectionName = "User";
            db = new MongoCRUD();
            _tokenService = tokenService;
        }

        public async Task<UserDataDTO> Login(LoginDTO loginDTO)
        {
            try
            {
                var user = await db.FindFirstAsync<User>(collectionName, new MongoFilterHelper("Email", loginDTO.Email));

                if (user == null)
                    return null;

                using var hmac = new HMACSHA512(user.PasswordSalt);

                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDTO.Password));

                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != user.PasswordHash[i]) return null;
                }
                return new UserDataDTO
                {
                    Email = user.Email,
                    DarkMode = user.DarkMode,
                    Token = _tokenService.CreateTokenDisciple(user)
                };
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<User> Register(RegisterDTO registerDTO)
        {
            try
            {
                if (registerDTO == null)
                    return null;

                using var hmac = new HMACSHA512();

                if (await db.FindFirstAsync<User>(collectionName, new MongoFilterHelper("Email", registerDTO.Email)) != null)
                    throw new Exception(message: "Email already exist!");

                var newUser = new User
                {
                    Email = registerDTO.Email,
                    PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password)),
                    PasswordSalt = hmac.Key,
                    BirthDate = registerDTO.BirthDate,
                };
                await db.InsertOneAsync<User>("User", newUser);
                return newUser;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public bool ValidateToken(string token)
        {
            var mySecret = "asdv234234^&%&^%&^hjsdfb2%%%";
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
                return false;
            }
            return true;
        }
        public async Task<bool> DeleteAccount(string email)
        {
            var user = await db.FindFirstAsync<User>(collectionName, new MongoFilterHelper("Email", email));

            var userLists = await db.FindManyAsync<ItemList>("ItemList", new MongoFilterHelper("Email", email));
            foreach (var list in userLists)
            {
                await db.DeleteOneAsync<ItemList>("ItemList", list.Id.ToString());
            }
            await db.DeleteOneAsync<User>(collectionName, user.Id.ToString());
            return true;
        }

        public async Task<bool> ChangeTheme(string email)
        {
            var user = await db.FindFirstAsync<User>(collectionName, new MongoFilterHelper("Email", email));

            if (user == null)
                return false;

            user.DarkMode = !user.DarkMode;

            await db.FindOneAndReplaceAsync<User>(collectionName, user.Id.ToString(), user);
            return user.DarkMode;
        }

        public async Task<bool> ChangePassword(string email, string password)
        {
            var user = await db.FindFirstAsync<User>(collectionName, new MongoFilterHelper("Email", email));

            if (user == null)
                return false;

            using var hmac = new HMACSHA512();
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            user.PasswordSalt = hmac.Key;

            await db.FindOneAndReplaceAsync<User>(collectionName, user.Id.ToString(), user);

            return true;
        }
    }
}
