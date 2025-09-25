using System.ComponentModel.DataAnnotations;

namespace WebOnlyAPI.Models
{
    public class ProductImage
    {
        public int Id { get; set; }
        public int ProductId { get; set; }

        [Required]
        [StringLength(500)]
        public string ImageUrl { get; set; } = string.Empty;

        [StringLength(100)]
        public string? Alt { get; set; }

        public int OrderIndex { get; set; } = 0;

        public Product? Product { get; set; }
    }
}


