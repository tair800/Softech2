using Microsoft.AspNetCore.Mvc;
using WebOnlyAPI.DTOs;
using WebOnlyAPI.Services;

namespace WebOnlyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
            var userAgent = HttpContext.Request.Headers["User-Agent"].ToString();

            var result = await _userService.LoginAsync(loginDto, ipAddress, userAgent);

            if (!result.Success)
                return Unauthorized(result);

            return Ok(result);
        }

        [HttpPost("logout")]
        public async Task<ActionResult<AuthResponseDto>> Logout([FromHeader(Name = "Authorization")] string? authorization)
        {
            if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Bearer "))
                return BadRequest("Invalid authorization header");

            var token = authorization.Substring("Bearer ".Length);
            var result = await _userService.LogoutAsync(token);

            return Ok(result);
        }

        [HttpPost("forgot-password")]
        public async Task<ActionResult<object>> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                // Check if user exists with this email
                var user = await _userService.GetUserByEmailAsync(forgotPasswordDto.Email);
                if (user == null)
                {
                    // For security reasons, don't reveal if email exists or not
                    return Ok(new { success = true, message = "If the email exists, a reset link has been sent." });
                }

                // Generate reset token
                var resetToken = Guid.NewGuid().ToString();
                var expiresAt = DateTime.UtcNow.AddHours(24); // Token expires in 24 hours

                // Store reset token in database
                var success = await _userService.StorePasswordResetTokenAsync(user.Id, resetToken, expiresAt);
                
                if (success)
                {
                    // In a real application, you would send an email here
                    // For now, we'll just return the token (in production, send via email)
                    return Ok(new { 
                        success = true, 
                        message = "Password reset link sent successfully.",
                        resetToken = resetToken, // Remove this in production
                        expiresAt = expiresAt
                    });
                }
                else
                {
                    return BadRequest(new { success = false, message = "Failed to process password reset request." });
                }
            }
            catch (Exception)
            {
                return BadRequest(new { success = false, message = "An error occurred while processing the request." });
            }
        }

        [HttpPost("reset-password")]
        public async Task<ActionResult<object>> ResetPassword([FromBody] ResetPasswordDto? resetPasswordDto)
        {
            if (resetPasswordDto == null)
                return BadRequest(new { success = false, message = "Invalid request data" });
            
            // Log the received data for debugging
            Console.WriteLine($"ResetPassword called with Token: {resetPasswordDto.Token}, NewPassword: {resetPasswordDto.NewPassword?.Length} chars, ConfirmPassword: {resetPasswordDto.ConfirmPassword?.Length} chars");
            
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                Console.WriteLine($"Model validation failed: {string.Join(", ", errors)}");
                return BadRequest(new { success = false, message = "Validation failed", errors = errors });
            }

            // Validate passwords match
            if (resetPasswordDto.NewPassword != resetPasswordDto.ConfirmPassword)
            {
                Console.WriteLine("Password confirmation mismatch");
                return BadRequest(new { success = false, message = "New password and confirmation password do not match." });
            }

            // Validate password length
            if (string.IsNullOrEmpty(resetPasswordDto.NewPassword) || resetPasswordDto.NewPassword.Length < 6)
            {
                Console.WriteLine($"Password too short: {resetPasswordDto.NewPassword?.Length ?? 0} chars");
                return BadRequest(new { success = false, message = "Password must be at least 6 characters long." });
            }

            try
            {
                // Verify reset token and reset password
                var success = await _userService.ResetPasswordWithTokenAsync(resetPasswordDto.Token, resetPasswordDto.NewPassword);
                
                if (success)
                {
                    Console.WriteLine("Password reset successful");
                    return Ok(new { success = true, message = "Password has been reset successfully." });
                }
                else
                {
                    Console.WriteLine("Invalid or expired reset token");
                    return BadRequest(new { success = false, message = "Invalid or expired reset token." });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception in ResetPassword: {ex.Message}");
                return BadRequest(new { success = false, message = "An error occurred while resetting the password." });
            }
        }

        [HttpPost("change-password")]
        public async Task<ActionResult<object>> ChangePassword([FromBody] ChangePasswordDto changePasswordDto, [FromHeader(Name = "Authorization")] string? authorization)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Bearer "))
                return Unauthorized("Invalid authorization header");

            // Validate passwords match
            if (changePasswordDto.NewPassword != changePasswordDto.ConfirmPassword)
            {
                return BadRequest(new { success = false, message = "New password and confirmation password do not match." });
            }

            // Validate password length
            if (changePasswordDto.NewPassword.Length < 6)
            {
                return BadRequest(new { success = false, message = "Password must be at least 6 characters long." });
            }

            var token = authorization!.Substring("Bearer ".Length);
            var user = await _userService.GetUserByTokenAsync(token);

            if (user == null)
                return Unauthorized("Invalid or expired token");

            var success = await _userService.ChangePasswordAsync(user.Id, changePasswordDto.OldPassword, changePasswordDto.NewPassword);

            if (!success)
                return BadRequest(new { success = false, message = "Current password is incorrect" });

            return Ok(new { success = true, message = "Password changed successfully" });
        }

        [HttpGet("validate")]
        public async Task<ActionResult<bool>> ValidateToken([FromHeader(Name = "Authorization")] string? authorization)
        {
            if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Bearer "))
                return false;

            var token = authorization.Substring("Bearer ".Length);
            var isValid = await _userService.ValidateTokenAsync(token);

            return Ok(isValid);
        }

        [HttpGet("me")]
        public async Task<ActionResult<UserDto>> GetCurrentUser([FromHeader(Name = "Authorization")] string? authorization)
        {
            if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Bearer "))
                return Unauthorized("Invalid authorization header");

            var token = authorization.Substring("Bearer ".Length);
            var user = await _userService.GetUserByTokenAsync(token);

            if (user == null)
                return Unauthorized("Invalid or expired token");

            return Ok(user);
        }
    }
}
