using System;

namespace WebOnlyAPI.DTOs
{
    public class CreateEmployeeDto
    {
        public string Name { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public string? PositionEn { get; set; }
        public string? PositionRu { get; set; }
        public string? Description { get; set; }
        public string? DescriptionEn { get; set; }
        public string? DescriptionRu { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? LinkedIn { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class UpdateEmployeeDto
    {
        public string Name { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public string? PositionEn { get; set; }
        public string? PositionRu { get; set; }
        public string? Description { get; set; }
        public string? DescriptionEn { get; set; }
        public string? DescriptionRu { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? LinkedIn { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class EmployeeResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public string? PositionEn { get; set; }
        public string? PositionRu { get; set; }
        public string? Description { get; set; }
        public string? DescriptionEn { get; set; }
        public string? DescriptionRu { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? LinkedIn { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
