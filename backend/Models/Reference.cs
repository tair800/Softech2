using System;
using System.ComponentModel.DataAnnotations;

namespace WebOnlyAPI.Models
{
    public class Reference
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? ImageUrl { get; set; }

        [StringLength(100)]
        public string? Alt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
