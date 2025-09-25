using System.ComponentModel.DataAnnotations;

namespace WebOnlyAPI.Models
{
    public class Product
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(100)]
        public string? NameEn { get; set; }

        [StringLength(100)]
        public string? NameRu { get; set; }
        
        [StringLength(1000)]
        public string? Subtext { get; set; }

        [StringLength(1000)]
        public string? SubtextEn { get; set; }

        [StringLength(1000)]
        public string? SubtextRu { get; set; }
        
        [StringLength(100)]
        public string? Icon { get; set; }
        
        [StringLength(100)]
        public string? Alt { get; set; }
        
        [StringLength(100)]
        public string? Path { get; set; }
        
        [StringLength(500)]
        public string? MainImage { get; set; }
        
        [StringLength(2000)]
        public string? Description { get; set; }
        
        [StringLength(500)]
        public string? ImageUrl { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Detail text fields (Unicode)
        public string? DetailDescription { get; set; }
        public string? DetailDescriptionEn { get; set; }
        public string? DetailDescriptionRu { get; set; }
        public string? Section1Title { get; set; }
        public string? Section1TitleEn { get; set; }
        public string? Section1TitleRu { get; set; }
        public string? Section1Description { get; set; }
        public string? Section1DescriptionEn { get; set; }
        public string? Section1DescriptionRu { get; set; }
        public string? Section1MoreText { get; set; }
        public string? Section1MoreTextEn { get; set; }
        public string? Section1MoreTextRu { get; set; }
        [StringLength(500)]
        public string? Section1Image { get; set; }

        public string? Section2Title { get; set; }
        public string? Section2TitleEn { get; set; }
        public string? Section2TitleRu { get; set; }
        public string? Section2Description { get; set; }
        public string? Section2DescriptionEn { get; set; }
        public string? Section2DescriptionRu { get; set; }
        public string? Section2MoreText { get; set; }
        public string? Section2MoreTextEn { get; set; }
        public string? Section2MoreTextRu { get; set; }
        [StringLength(500)]
        public string? Section2Image { get; set; }

        public string? Section3Title { get; set; }
        public string? Section3TitleEn { get; set; }
        public string? Section3TitleRu { get; set; }
        public string? Section3Description { get; set; }
        public string? Section3DescriptionEn { get; set; }
        public string? Section3DescriptionRu { get; set; }
        public string? Section3MoreText { get; set; }
        public string? Section3MoreTextEn { get; set; }
        public string? Section3MoreTextRu { get; set; }
        [StringLength(500)]
        public string? Section3Image { get; set; }

        // Navigation properties
        public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    }
}
