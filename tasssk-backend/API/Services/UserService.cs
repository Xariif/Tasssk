using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;
using TassskAPI.Models;
using TassskAPI.Services;
using TassskAPI.DTOs;
using TassskAPI.DTOs.User;
using TassskAPI.Interfaces;

namespace TassskAPI.Services
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

            Notification newAccountNotification = new Notification
            {
                Header = "Welcome in TASSSK!",
                Body = "We're here to make your day easier! Start by clicking list icon to make your first list!",
                CreatedAt = DateTime.UtcNow,
                IsReaded = false,
                Sender = "Tasssk Administration",
                Receiver = registerDTO.Email,
                Type = "Notification"

            };
            await db.GetCollection<Notification>(NotificationCollection).InsertOneAsync(newAccountNotification);

        }

        public async Task<bool> ValidateToken(string token)
        {        
            try
            {
                 _tokenService.ValidateToken(token);
            }
            catch 
            {
                throw new ArgumentException(message: "Token invalid");
            }
            return true;
        }

        public async Task<bool> DeleteAccount(string email)
        {
            await db.GetCollection<Notification>(NotificationCollection).DeleteManyAsync(x => x.Receiver== email);
            var userLists = await db.GetCollection<List>(ListCollection).Find(x=>x.Privileges.Find(z=>z.Email == email).Owner == true).ToListAsync();
            ListService listService = new ListService();
            foreach (var list in userLists)
            {
                await listService.DeleteList(list.Id.ToString(), email);
            }
            await db.GetCollection<User>(UserCollection).DeleteOneAsync(x => x.Email == email);

            return true;
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
