using System;

namespace WebOnlyAPI.DTOs
{
    public class EquipmentListResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Version { get; set; }
        public string? Core { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsMain { get; set; }
        public List<string> CategoryNames { get; set; } = new List<string>();
        public List<string> TagNames { get; set; } = new List<string>();
        // Convenience fields for up to 4 images in list payloads
        public string? MainImage { get; set; }
        public string? DetailImage1 { get; set; }
        public string? DetailImage2 { get; set; }
        public string? DetailImage3 { get; set; }
    }
}
