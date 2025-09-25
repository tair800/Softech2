using System.ComponentModel.DataAnnotations;

namespace WebOnlyAPI.Models
{
    public class PasswordResetToken
    {
        [Key]
        public int Id { get; set; }
        
        public int UserId { get; set; }
        
        [Required]
        [StringLength(255)]
        public string ResetToken { get; set; } = string.Empty;
        
        public DateTime ExpiresAt { get; set; }
        
        public DateTime CreatedAt { get; set; }
        
        // Navigation property
        public User User { get; set; } = null!;
    }
}
