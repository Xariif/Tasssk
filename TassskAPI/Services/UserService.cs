using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;
using TassskAPI.Helpers.Models;
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
        private readonly string UserCollection;
        private readonly string ItemListCollection;

        public UserService(ITokenService tokenService)
        {
            UserCollection = "User";
            ItemListCollection = "ItemList";
            db = new MongoCRUD();
            _tokenService = tokenService;
        }

        public async Task<UserDataDTO> Login(LoginDTO loginDTO)
        {
            try
            {
                var filterHelper = new MongoFilterHelper
                {
                    FilterField = "Email",
                    FilterValue = loginDTO.Email
                };

                var user = await db.FindFirstAsync<User>(UserCollection, filterHelper);

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

                var filterHelper = new MongoFilterHelper
                {
                    FilterField = "Email",
                    FilterValue = registerDTO.Email,
                };

                if (await db.FindFirstAsync<User>(UserCollection, filterHelper) != null)
                    throw new Exception(message: "Email already exist!");

                var newUser = new User
                {
                    Email = registerDTO.Email,
                    PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password)),
                    PasswordSalt = hmac.Key,
                    BirthDate = registerDTO.BirthDate,
                };
                await db.InsertOneAsync<User>(UserCollection, newUser);
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
            var filterHelper = new MongoFilterHelper
            {
                FilterField = "Email",
                FilterValue = email
            };
            var user = await db.FindFirstAsync<User>(UserCollection, filterHelper);

            var userLists = await db.FindManyAsync<ItemList>(ItemListCollection, filterHelper);
            foreach (var list in userLists)
            {
                await db.DeleteOneAsync<ItemList>("ItemList", list.Id.ToString());
            }
            await db.DeleteOneAsync<User>(UserCollection, user.Id.ToString());
            return true;
        }

        public async Task<bool> ChangeTheme(string email)
        {
            var filterHelper = new MongoFilterHelper
            {
                FilterField = "Email",
                FilterValue = email
            };
            var user = await db.FindFirstAsync<User>(UserCollection, filterHelper);

            if (user == null)
                return false;

            user.DarkMode = !user.DarkMode;

            await db.FindOneAndReplaceAsync<User>(UserCollection, user.Id.ToString(), user);
            return user.DarkMode;
        }

        public async Task<bool> ChangePassword(string email, string password)
        {
            var filterHelper = new MongoFilterHelper
            {
                FilterField = "Email",
                FilterValue = email
            };
            var user = await db.FindFirstAsync<User>(UserCollection, filterHelper);

            if (user == null)
                return false;

            using var hmac = new HMACSHA512();
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            user.PasswordSalt = hmac.Key;

            await db.FindOneAndReplaceAsync<User>(UserCollection, user.Id.ToString(), user);

            return true;
        }
        //Notifications
        public async Task<List<Notification>> GetNotifications(string email)
        {
            var filterHelper = new MongoFilterHelper
            {
                FilterField = "Email",
                FilterValue = email
            };
            var user = await db.FindFirstAsync<User>(UserCollection, filterHelper);

            return user.Notifications.ToList();
        }

        public async Task<bool> AddNotification(string email, string header, string body)
        {
            var notification = new Notification
            {
                Id = ObjectId.GenerateNewId(),
                Header = header,
                Body = body
            };
            var nestedHelper = new MongoNestedArrayHelper<Notification>
            {
                FilterField = "Email",
                FilterValue = email,
                NestedArray = "Notifications",
                NestedObject = notification
            };
            await db.PushObjectToNestedArrayAsync(UserCollection, nestedHelper);
            return true;
        }
        public async Task<bool> DeleteNotification(string email, string notificationId)
        {
            var NotificationToDelete = GetNotifications(email).Result.FirstOrDefault(x => x.Id == ObjectId.Parse(notificationId));

            var nestedHelper = new MongoNestedArrayHelper<Notification>
            {
                FilterField = "Email",
                FilterValue = email,
                NestedArray = "Notifications",
                NestedObject = NotificationToDelete
            };
            await db.PullObjectFromNestedArrayAsync(UserCollection, nestedHelper);
            return true;
        }
        public async Task<bool> SetNotificationReaded(string email, string notificationId)
        {
            var NotificationToDelete = GetNotifications(email).Result.FirstOrDefault(x => x.Id == ObjectId.Parse(notificationId));
            var nestedHelper = new MongoNestedArrayHelper<Notification>
            {
                FilterField = "Email",
                FilterValue = email,
                NestedArray = "Notifications",
                NestedObject = NotificationToDelete
            };
            await db.PullObjectFromNestedArrayAsync(UserCollection, nestedHelper);

            NotificationToDelete.IsReaded = true;
            await db.PushObjectToNestedArrayAsync(UserCollection, nestedHelper);

            return true;
        }
    }
}
