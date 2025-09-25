using Microsoft.EntityFrameworkCore;
using WebOnlyAPI.Data;
using WebOnlyAPI.DTOs;
using WebOnlyAPI.Models;

namespace WebOnlyAPI.Services
{
    public interface IUserService
    {
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto, string ipAddress, string userAgent);
        Task<AuthResponseDto> LogoutAsync(string token);
        Task<bool> ValidateTokenAsync(string token);
        Task<UserDto?> GetUserByTokenAsync(string token);
        Task<List<UserDto>> GetAllUsersAsync();
        Task<UserDto?> GetUserByIdAsync(int id);
        Task<UserDto> CreateUserAsync(CreateUserDto createUserDto);
        Task<UserDto?> UpdateUserAsync(int id, CreateUserDto updateUserDto);
        Task<bool> DeleteUserAsync(int id);
        Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword);
        Task<bool> DeactivateUserAsync(int id);
        Task<bool> ActivateUserAsync(int id);
        Task<UserDto?> GetUserByEmailAsync(string email);
        Task<bool> StorePasswordResetTokenAsync(int userId, string resetToken, DateTime expiresAt);
        Task<bool> ResetPasswordWithTokenAsync(string resetToken, string newPassword);
    }

    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public UserService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto, string ipAddress, string userAgent)
        {
            try
            {
                // Find user by username
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == loginDto.Username && u.IsActive);

                if (user == null)
                {
                    await LogLoginAttempt(loginDto.Username, false, ipAddress, userAgent);
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "Invalid username or password"
                    };
                }

                // Check password (in production, use proper hashing)
                if (user.PasswordHash != loginDto.Password)
                {
                    await LogLoginAttempt(loginDto.Username, false, ipAddress, userAgent);
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "Invalid username or password"
                    };
                }

                // Generate session token
                var token = Guid.NewGuid().ToString();
                var expiresAt = loginDto.RememberMe 
                    ? DateTime.UtcNow.AddDays(30) 
                    : DateTime.UtcNow.AddHours(24);

                // Create user session
                var userSession = new UserSession
                {
                    UserId = user.Id,
                    SessionToken = token,
                    RememberMe = loginDto.RememberMe,
                    ExpiresAt = expiresAt,
                    LastAccessedAt = DateTime.UtcNow
                };

                _context.UserSessions.Add(userSession);

                // Update user's last login
                user.LastLoginAt = DateTime.UtcNow;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // Log successful login
                await LogLoginAttempt(loginDto.Username, true, ipAddress, userAgent, user.Id);

                return new AuthResponseDto
                {
                    Success = true,
                    Message = "Login successful",
                    Token = token,
                    User = MapToUserDto(user),
                    ExpiresAt = expiresAt
                };
            }
            catch (Exception ex)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = $"Login failed: {ex.Message}"
                };
            }
        }

        public async Task<AuthResponseDto> LogoutAsync(string token)
        {
            try
            {
                var session = await _context.UserSessions
                    .FirstOrDefaultAsync(s => s.SessionToken == token);

                if (session != null)
                {
                    _context.UserSessions.Remove(session);
                    await _context.SaveChangesAsync();
                }

                return new AuthResponseDto
                {
                    Success = true,
                    Message = "Logout successful"
                };
            }
            catch (Exception ex)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = $"Logout failed: {ex.Message}"
                };
            }
        }

        public async Task<bool> ValidateTokenAsync(string token)
        {
            var session = await _context.UserSessions
                .FirstOrDefaultAsync(s => s.SessionToken == token && s.ExpiresAt > DateTime.UtcNow);

            if (session != null)
            {
                // Update last accessed time
                session.LastAccessedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<UserDto?> GetUserByTokenAsync(string token)
        {
            var session = await _context.UserSessions
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.SessionToken == token && s.ExpiresAt > DateTime.UtcNow);

            return session?.User != null ? MapToUserDto(session.User) : null;
        }

        public async Task<List<UserDto>> GetAllUsersAsync()
        {
            var users = await _context.Users
                .Where(u => u.IsActive)
                .OrderBy(u => u.Username)
                .ToListAsync();

            return users.Select(MapToUserDto).ToList();
        }

        public async Task<UserDto?> GetUserByIdAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            return user != null ? MapToUserDto(user) : null;
        }

        public async Task<UserDto> CreateUserAsync(CreateUserDto createUserDto)
        {
            // Check if username or email already exists
            if (await _context.Users.AnyAsync(u => u.Username == createUserDto.Username))
                throw new InvalidOperationException("Username already exists");

            if (await _context.Users.AnyAsync(u => u.Email == createUserDto.Email))
                throw new InvalidOperationException("Email already exists");

            var user = new User
            {
                Username = createUserDto.Username,
                Email = createUserDto.Email,
                PasswordHash = createUserDto.Password, // In production, hash this
                FirstName = createUserDto.FirstName,
                LastName = createUserDto.LastName,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return MapToUserDto(user);
        }

        public async Task<UserDto?> UpdateUserAsync(int id, CreateUserDto updateUserDto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return null;

            // Check if new username or email conflicts with other users
            if (await _context.Users.AnyAsync(u => u.Id != id && u.Username == updateUserDto.Username))
                throw new InvalidOperationException("Username already exists");

            if (await _context.Users.AnyAsync(u => u.Id != id && u.Email == updateUserDto.Email))
                throw new InvalidOperationException("Email already exists");

            user.Username = updateUserDto.Username;
            user.Email = updateUserDto.Email;
            user.FirstName = updateUserDto.FirstName;
            user.LastName = updateUserDto.LastName;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapToUserDto(user);
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            if (user.PasswordHash != currentPassword)
                return false;

            user.PasswordHash = newPassword; // In production, hash this
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeactivateUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            user.IsActive = false;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ActivateUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            user.IsActive = true;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<UserDto?> GetUserByEmailAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            return user != null ? MapToUserDto(user) : null;
        }

        public async Task<bool> StorePasswordResetTokenAsync(int userId, string resetToken, DateTime expiresAt)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            var passwordResetToken = new PasswordResetToken
            {
                UserId = userId,
                ResetToken = resetToken,
                ExpiresAt = expiresAt,
                CreatedAt = DateTime.UtcNow
            };

            _context.PasswordResetTokens.Add(passwordResetToken);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ResetPasswordWithTokenAsync(string resetToken, string newPassword)
        {
            var passwordResetToken = await _context.PasswordResetTokens
                .FirstOrDefaultAsync(t => t.ResetToken == resetToken && t.ExpiresAt > DateTime.UtcNow);

            if (passwordResetToken == null) return false;

            var user = await _context.Users.FindAsync(passwordResetToken.UserId);
            if (user == null) return false;

            user.PasswordHash = newPassword; // In production, hash this
            user.UpdatedAt = DateTime.UtcNow;

            _context.PasswordResetTokens.Remove(passwordResetToken);
            await _context.SaveChangesAsync();

            return true;
        }

        private async Task LogLoginAttempt(string username, bool isSuccessful, string ipAddress, string userAgent, int? userId = null)
        {
            var loginHistory = new UserLoginHistory
            {
                UserId = userId,
                Username = username,
                IsSuccessful = isSuccessful,
                IpAddress = ipAddress,
                UserAgent = userAgent
            };

            _context.UserLoginHistory.Add(loginHistory);
            await _context.SaveChangesAsync();
        }

        private static UserDto MapToUserDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                IsActive = user.IsActive,
                LastLoginAt = user.LastLoginAt,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };
        }
    }
}
