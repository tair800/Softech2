using System.ComponentModel.DataAnnotations;

namespace WebOnlyAPI.Models
{
    public class EquipmentImage
    {
        public int Id { get; set; }
        public int EquipmentId { get; set; }

        [Required]
        [StringLength(500)]
        public string ImageUrl { get; set; } = string.Empty;

        [StringLength(100)]
        public string? Alt { get; set; }

        public int OrderIndex { get; set; } = 0;

        public Equipment? Equipment { get; set; }
    }
}


