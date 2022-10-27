using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;
using ToDoAPI.DTOs;
using ToDoAPI.DTOs.User;
using ToDoAPI.Helpers;
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

        public UserDataDTO Login(LoginDTO loginDTO)
        {
            try
            {
                var user = db.FindFirstByEmail<User>(collectionName,loginDTO.Email);

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
            catch(Exception)
            {
                throw;
            }
        }
        public User Register(RegisterDTO registerDTO)
        {
            try
            {
                if (registerDTO == null)
                    return null;

                using var hmac = new HMACSHA512();

                if (db.FindFirstByEmail<User>(collectionName,registerDTO.Email) != null)
                    throw new Exception(message: "Email already exist!");

                var newUser = new User
                {
                    Email = registerDTO.Email,
                    PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password)),
                    PasswordSalt = hmac.Key,
                    BirthDate = registerDTO.BirthDate,
                };
                db.InsertRecord<User>("User", newUser);
                return newUser;
            }
            catch(Exception)
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
        public bool DeleteAccount(string email)
        {
            var userId = db.FindFirstByEmail<User>(collectionName, email).Id;
           
            var userLists = db.FindListsByEmail<ItemList>("ItemList", email).ToList();
            foreach(var list in userLists)
            {
                db.DeleteRecord<ItemList>("ItemList", list.Id);
            }
            db.DeleteRecord<User>(collectionName, userId);
            return true;
        }

        public bool ChangeTheme(string email)
        {
            var user = db.FindFirstByEmail<User>(collectionName, email);

            if (user == null)
                return false;

            user.DarkMode = !user.DarkMode;

        
            db.UpsertRecord<User>(collectionName, user.Id,user);
            return true;
        }
    }
}
