using backend.Data;
using backend.DTOs;
using backend.Entities;
using backend.Extensions;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        private readonly ApplicationDbContext _context;

        public AccountController(UserManager<User> userManager, TokenService tokenService, ApplicationDbContext context)
        {
            _context = context;
            _tokenService = tokenService;
            _userManager = userManager;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
                return Unauthorized();

            var userCart = await RetrieveCart(user.UserName);

            // Clear any existing anonymous cart
            var anonCart = await RetrieveCart(Request.Cookies["buyerId"]);
            if (anonCart != null)
            {
                _context.Carts.Remove(anonCart);
                await _context.SaveChangesAsync();
            }

            return new UserDto
            {
                Email = user.Email,
                FirstName = user.FirstName,  // Add this
                LastName = user.LastName,    // Add this
                Token = await _tokenService.GenerateToken(user),
                Cart = userCart?.MapCartToDto()
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            var user = new User
            {
                UserName = registerDto.Username,
                Email = registerDto.Email,
                FirstName = registerDto.FirstName,  // Added
                LastName = registerDto.LastName    // Added
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }

                return ValidationProblem();
            }

            await _userManager.AddToRoleAsync(user, "Member");

            return StatusCode(201);
        }

        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            var userCart = await RetrieveCart(User.Identity.Name);

            return new UserDto
            {
                Email = user.Email,
                FirstName = user.FirstName,  // Add this
                LastName = user.LastName,    // Add this
                Token = await _tokenService.GenerateToken(user),
                Cart = userCart?.MapCartToDto()
            };
        }

        [Authorize]
        [HttpGet("savedAddress")]
        public async Task<ActionResult<UserAddress>> GetSavedAddress()
        {
            return await _userManager.Users
                .Where(x => x.UserName == User.Identity.Name)
                .Select(user => user.Address)
                .FirstOrDefaultAsync();
        }

        private async Task<Cart> RetrieveCart(string buyerId)
        {
            return await _context.Carts
                .Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
        }

        [Authorize]
        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UserProfileUpdateDto profileDto)
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            if (user == null) return Unauthorized();

            // Update FirstName and LastName
            user.FirstName = profileDto.FirstName;
            user.LastName = profileDto.LastName;

            // Handle Password Change
            if (!string.IsNullOrEmpty(profileDto.Password) && !string.IsNullOrEmpty(profileDto.NewPassword))
            {
                var result = await _userManager.ChangePasswordAsync(user, profileDto.Password, profileDto.NewPassword);
                if (!result.Succeeded)
                {
                    return BadRequest(result.Errors);
                }
            }

            // Save changes to FirstName and LastName
            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                return BadRequest(updateResult.Errors);
            }

            return Ok("Profile updated successfully");
        }
    }
}
