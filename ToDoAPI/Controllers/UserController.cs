using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Text;
using ToDoAPI.DTOs;
using ToDoAPI.DTOs.User;
using ToDoAPI.Interfaces;
using ToDoAPI.Models;
using ToDoAPI.Services;

namespace ToDoAPI.Controllers
{
    public class UserController : BaseAPIController
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }
        [AllowAnonymous]
        [HttpPost("Login")]
        public ActionResult<UserDataDTO> Login(LoginDTO loginDTO)
        {
            var userData = _userService.Login(loginDTO);

            if (userData != null)
                return Ok(userData);

            return BadRequest("Wrong email or password");      
        }

        [AllowAnonymous]
        [HttpPost("Register")]
        public  ActionResult Register(RegisterDTO registerDTO)
        {
            var newUser = _userService.Register(registerDTO); 
            if (newUser != null) return Ok("Register success!");

            return BadRequest("Register error!");
        }


        [Authorize]
        [HttpPost("ValidateToken")]
        public  bool ValidateToken()
        {          
            return true;
        }



        [Authorize]
        [HttpDelete("DeleteAccount")]
        public bool DeleteAccount(string password)
        {
            var loginDTO = new LoginDTO()
            {
                Email = GetUserEmail(),
                Password = password
            };

            if(_userService.Login(loginDTO)== null)
                return false;

            _userService.DeleteAccount(GetUserEmail());

            return true;
        }



        [Authorize]
        [HttpPost("ChangeTheme")]
        public bool ChangeTheme()
        {
            try
            {
                _userService.ChangeTheme(GetUserEmail());
                return true;

            }

            catch
            {
                return false;
            }
        }
        //[AllowAnonymous]
        //[HttpPut("ChangePassword")]
        //public async Task<ActionResult> ChangePassword(ResetPasswordDTO resetPasswordDTO)
        //{
        //    var user = await _userService.GetUserByEmail(resetPasswordDTO.Email);
        //    if (user == null)
        //        return Unauthorized("Account with th");
        //    if (resetPasswordDTO.Password != resetPasswordDTO.RePassword)
        //        return BadRequest("Passwords are diffrent!");

        //    if (user != null)
        //    {
        //        using var hmac = new HMACSHA512(user.PasswordSalt);

        //        user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(resetPasswordDTO.Password));
        //        user.PasswordSalt = hmac.Key;

        //        await _userService.UpdateUserAsync(user);


        //        return Ok("Password changed correctly!");

        //    }
        //    return BadRequest("Error!");
        //}
        //[Authorize]
        //[HttpDelete("DeleteUser")]
        //public async Task<ActionResult> DeleteUser()
        //{
        //    try
        //    {
        //        await _userService.DeleteUser(GetUserEmail());
        //        return Ok("User Deleted");

        //    }

        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}
    }
}
