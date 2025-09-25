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
        public List<string> CategoryNames { get; set; } = new List<string>();
        public List<string> TagNames { get; set; } = new List<string>();
    }
}
