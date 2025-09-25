using System;
using System.ComponentModel.DataAnnotations;

namespace WebOnlyAPI.Models
{
    public class Employee
    {
        public int Id { get; set; }

        // Align with teamData.js: name, position, phone, email, linkedin, image
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Position { get; set; } = string.Empty;

        [StringLength(100)]
        public string? PositionEn { get; set; }

        [StringLength(100)]
        public string? PositionRu { get; set; }

        [StringLength(2000)]
        public string? Description { get; set; }

        [StringLength(2000)]
        public string? DescriptionEn { get; set; }

        [StringLength(2000)]
        public string? DescriptionRu { get; set; }

        [StringLength(20)]
        public string? Phone { get; set; }

        [EmailAddress]
        [StringLength(100)]
        public string? Email { get; set; }

        [StringLength(200)]
        public string? LinkedIn { get; set; }

        [StringLength(500)]
        public string? ImageUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
