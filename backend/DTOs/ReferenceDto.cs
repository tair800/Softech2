using System;
using System.ComponentModel.DataAnnotations;

namespace WebOnlyAPI.DTOs
{
    public class ReferenceResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? Alt { get; set; }
    }

    public class CreateReferenceDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        [StringLength(500)]
        public string? ImageUrl { get; set; }
        [StringLength(100)]
        public string? Alt { get; set; }
    }

    public class UpdateReferenceDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        [StringLength(500)]
        public string? ImageUrl { get; set; }
        [StringLength(100)]
        public string? Alt { get; set; }
    }
}
