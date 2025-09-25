using System.ComponentModel.DataAnnotations;

namespace WebOnlyAPI.Models
{
    public class UserLoginHistory
    {
        public int Id { get; set; }
        
        public int? UserId { get; set; } // NULL for failed login attempts
        
        [Required]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty;
        
        public DateTime LoginAttempt { get; set; } = DateTime.UtcNow;
        
        public bool IsSuccessful { get; set; }
        
        [StringLength(45)] // IPv6 support
        public string? IpAddress { get; set; }
        
        [StringLength(500)]
        public string? UserAgent { get; set; }
        
        // Navigation property
        public virtual User? User { get; set; }
    }
}
