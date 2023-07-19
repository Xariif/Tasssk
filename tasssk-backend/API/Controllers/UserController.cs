using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TassskAPI.DTOs.Core;
using TassskAPI.DTOs.User;
using TassskAPI.DTOs;
using TassskAPI.Services;

namespace TassskAPI.Controllers
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
        public async Task<ActionResult<UserDataDTO>> Login(LoginDTO loginDTO)
        {
            try
            {
                var userData = await _userService.Login(loginDTO);

                return Ok(userData);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpPost("Register")]
        public async Task<ActionResult> Register(RegisterDTO registerDTO)
        {
            try
            {
                await _userService.Register(registerDTO);

                return Ok("Register complete");

            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost("ValidateToken")]
        public async Task<ActionResult<bool>> ValidateToken(string token)
        {
            try
            {
                var res = await _userService.ValidateToken(token);
                return Ok(res);

            } 
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
        [Authorize]
        [HttpDelete("DeleteAccount")]
        public async Task<ActionResult<bool>> DeleteAccount(string password)
        {
            try
            {
                var loginDTO = new LoginDTO()
                {
                    Email = GetUserEmail(),
                    Password = password
                };
                await _userService.Login(loginDTO);  
                var res = await _userService.DeleteAccount(GetUserEmail());
                return Ok(res);

            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Authorize]
        [HttpPut("ChangeTheme")]
        public async Task<ActionResult<bool>> ChangeTheme()
        {
            try
            {
                var res = await _userService.ChangeTheme(GetUserEmail());
                return Ok(res);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Authorize]
        [HttpPut("ChangePassword")]
        public async Task<ActionResult<bool>> ChangePassword(ChangePasswordDTO changePasswordDTO)
        {
            try
            {
                var loginDTO = new LoginDTO()
                {
                    Email = GetUserEmail(),
                    Password = changePasswordDTO.OldPassword
                };

                var res = await _userService.Login(loginDTO);
                await _userService.ChangePassword(GetUserEmail(), changePasswordDTO.NewPassword);
                return Ok(res);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

}
