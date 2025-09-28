using System.ComponentModel.DataAnnotations;

namespace WebOnlyAPI.DTOs
{
    public class CreateBlogSectionDto
    {
        [Required]
        public int BlogId { get; set; }
        
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string? TitleEn { get; set; }
        
        [StringLength(100)]
        public string? TitleRu { get; set; }
        
        [StringLength(2000)]
        public string? Description { get; set; }
        
        [StringLength(2000)]
        public string? DescriptionEn { get; set; }
        
        [StringLength(2000)]
        public string? DescriptionRu { get; set; }
        
        public int OrderIndex { get; set; }
    }

    public class UpdateBlogSectionDto
    {
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string? TitleEn { get; set; }
        
        [StringLength(100)]
        public string? TitleRu { get; set; }
        
        [StringLength(2000)]
        public string? Description { get; set; }
        
        [StringLength(2000)]
        public string? DescriptionEn { get; set; }
        
        [StringLength(2000)]
        public string? DescriptionRu { get; set; }
        
        public int OrderIndex { get; set; }
    }

    public class BlogSectionResponseDto
    {
        public int Id { get; set; }
        public int BlogId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? TitleEn { get; set; }
        public string? TitleRu { get; set; }
        public string? Description { get; set; }
        public string? DescriptionEn { get; set; }
        public string? DescriptionRu { get; set; }
        public int OrderIndex { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
