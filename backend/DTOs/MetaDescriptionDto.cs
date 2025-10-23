using System.ComponentModel.DataAnnotations;

namespace WebOnlyAPI.DTOs
{
    public class CreateMetaDescriptionDto
    {
        [Required]
        [StringLength(100)]
        public string PageKey { get; set; } = string.Empty;
        
        [Required]
        [StringLength(10)]
        public string Language { get; set; } = string.Empty;
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [StringLength(500)]
        public string Description { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? OpenGraphTitle { get; set; }
        
        [StringLength(500)]
        public string? OpenGraphDescription { get; set; }
        
        [StringLength(500)]
        public string? TwitterTitle { get; set; }
        
        [StringLength(500)]
        public string? TwitterDescription { get; set; }
    }

    public class UpdateMetaDescriptionDto
    {
        [StringLength(200)]
        public string? Title { get; set; }
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        [StringLength(500)]
        public string? OpenGraphTitle { get; set; }
        
        [StringLength(500)]
        public string? OpenGraphDescription { get; set; }
        
        [StringLength(500)]
        public string? TwitterTitle { get; set; }
        
        [StringLength(500)]
        public string? TwitterDescription { get; set; }
        
        public bool? IsActive { get; set; }
    }

    public class MetaDescriptionResponseDto
    {
        public int Id { get; set; }
        public string PageKey { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? OpenGraphTitle { get; set; }
        public string? OpenGraphDescription { get; set; }
        public string? TwitterTitle { get; set; }
        public string? TwitterDescription { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class MetaDescriptionListDto
    {
        public string PageKey { get; set; } = string.Empty;
        public string PageName { get; set; } = string.Empty;
        public List<MetaDescriptionLanguageDto> Languages { get; set; } = new List<MetaDescriptionLanguageDto>();
    }

    public class MetaDescriptionLanguageDto
    {
        public string Language { get; set; } = string.Empty;
        public string LanguageName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public int Id { get; set; }
    }
}
