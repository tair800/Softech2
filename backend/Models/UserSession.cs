using System.ComponentModel.DataAnnotations;

namespace WebOnlyAPI.Models
{
    public class UserSession
    {
        public int Id { get; set; }
        
        public int UserId { get; set; }
        
        [Required]
        [StringLength(255)]
        public string SessionToken { get; set; } = string.Empty;
        
        public bool RememberMe { get; set; } = false;
        
        public DateTime ExpiresAt { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime LastAccessedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public virtual User User { get; set; } = null!;
    }
}
