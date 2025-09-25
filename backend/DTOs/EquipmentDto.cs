using System;
using System.ComponentModel.DataAnnotations;

namespace WebOnlyAPI.DTOs
{
    public class CreateEquipmentDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        [StringLength(100)]
        public string? Version { get; set; }
        [StringLength(100)]
        public string? Core { get; set; }
        [StringLength(2000)]
        public string? Description { get; set; }
        [StringLength(2000)]
        public string? DescriptionEn { get; set; }
        [StringLength(2000)]
        public string? DescriptionRu { get; set; }
        [StringLength(500)]
        public string? ImageUrl { get; set; }
        public List<int> CategoryIds { get; set; } = new List<int>();
        public List<int> TagIds { get; set; } = new List<int>();
        public List<CreateEquipmentFeatureDto> Features { get; set; } = new List<CreateEquipmentFeatureDto>();
        public List<CreateEquipmentSpecificationDto> Specifications { get; set; } = new List<CreateEquipmentSpecificationDto>();
    }

    public class UpdateEquipmentDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        [StringLength(100)]
        public string? Version { get; set; }
        [StringLength(100)]
        public string? Core { get; set; }
        [StringLength(2000)]
        public string? Description { get; set; }
        [StringLength(2000)]
        public string? DescriptionEn { get; set; }
        [StringLength(2000)]
        public string? DescriptionRu { get; set; }
        [StringLength(500)]
        public string? ImageUrl { get; set; }
        public List<int> CategoryIds { get; set; } = new List<int>();
        public List<int> TagIds { get; set; } = new List<int>();
        public List<CreateEquipmentFeatureDto> Features { get; set; } = new List<CreateEquipmentFeatureDto>();
        public List<CreateEquipmentSpecificationDto> Specifications { get; set; } = new List<CreateEquipmentSpecificationDto>();
    }

    public class EquipmentResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Version { get; set; }
        public string? Core { get; set; }
        public string? Description { get; set; }
        public string? DescriptionEn { get; set; }
        public string? DescriptionRu { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<EquipmentFeatureDto> Features { get; set; } = new List<EquipmentFeatureDto>();
        public List<EquipmentSpecificationDto> Specifications { get; set; } = new List<EquipmentSpecificationDto>();
        public List<EquipmentCategoryDto> Categories { get; set; } = new List<EquipmentCategoryDto>();
        public List<EquipmentTagDto> Tags { get; set; } = new List<EquipmentTagDto>();
    }

    public class EquipmentFeatureDto
    {
        public int Id { get; set; }
        public string Feature { get; set; } = string.Empty;
        public string? FeatureEn { get; set; }
        public string? FeatureRu { get; set; }
        public int OrderIndex { get; set; }
    }

    public class CreateEquipmentFeatureDto
    {
        [Required]
        [StringLength(200)]
        public string Feature { get; set; } = string.Empty;
        [StringLength(200)]
        public string? FeatureEn { get; set; }
        [StringLength(200)]
        public string? FeatureRu { get; set; }
        public int OrderIndex { get; set; }
    }

    public class UpdateEquipmentFeatureDto
    {
        [Required]
        [StringLength(200)]
        public string Feature { get; set; } = string.Empty;
        [StringLength(200)]
        public string? FeatureEn { get; set; }
        [StringLength(200)]
        public string? FeatureRu { get; set; }
        public int OrderIndex { get; set; }
    }

    public class EquipmentSpecificationDto
    {
        public int Id { get; set; }
        public string Key { get; set; } = string.Empty;
        public string? KeyEn { get; set; }
        public string? KeyRu { get; set; }
        public string? Value { get; set; }
        public string? ValueEn { get; set; }
        public string? ValueRu { get; set; }
        public int OrderIndex { get; set; }
    }

    public class CreateEquipmentSpecificationDto
    {
        [Required]
        [StringLength(100)]
        public string Key { get; set; } = string.Empty;
        [StringLength(100)]
        public string? KeyEn { get; set; }
        [StringLength(100)]
        public string? KeyRu { get; set; }
        [StringLength(500)]
        public string? Value { get; set; }
        [StringLength(500)]
        public string? ValueEn { get; set; }
        [StringLength(500)]
        public string? ValueRu { get; set; }
        public int OrderIndex { get; set; }
    }

    public class UpdateEquipmentSpecificationDto
    {
        [Required]
        [StringLength(100)]
        public string Key { get; set; } = string.Empty;
        [StringLength(100)]
        public string? KeyEn { get; set; }
        [StringLength(100)]
        public string? KeyRu { get; set; }
        [StringLength(500)]
        public string? Value { get; set; }
        [StringLength(500)]
        public string? ValueEn { get; set; }
        [StringLength(500)]
        public string? ValueRu { get; set; }
        public int OrderIndex { get; set; }
    }

    public class EquipmentCategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? NameEn { get; set; }
        public string? NameRu { get; set; }
        public string? Description { get; set; }
        public string? DescriptionEn { get; set; }
        public string? DescriptionRu { get; set; }
        public string? Icon { get; set; }
        public string? Color { get; set; }
        public int OrderIndex { get; set; }
        public int EquipmentCount { get; set; }
    }

    public class EquipmentTagDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? NameEn { get; set; }
        public string? NameRu { get; set; }
        public string? Description { get; set; }
        public string? DescriptionEn { get; set; }
        public string? DescriptionRu { get; set; }
        public string? Color { get; set; }
        public int OrderIndex { get; set; }
        public int EquipmentCount { get; set; }
    }

    // Create and Update DTOs for Categories
    public class CreateEquipmentCategoryDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        [StringLength(100)]
        public string? NameEn { get; set; }
        [StringLength(100)]
        public string? NameRu { get; set; }
        
        [StringLength(2000)]
        public string? Description { get; set; }
        [StringLength(2000)]
        public string? DescriptionEn { get; set; }
        [StringLength(2000)]
        public string? DescriptionRu { get; set; }
        
        [StringLength(100)]
        public string? Icon { get; set; }
        
        [StringLength(50)]
        public string? Color { get; set; }
        
        public int OrderIndex { get; set; } = 0;
    }

    public class UpdateEquipmentCategoryDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        [StringLength(100)]
        public string? NameEn { get; set; }
        [StringLength(100)]
        public string? NameRu { get; set; }
        
        [StringLength(2000)]
        public string? Description { get; set; }
        [StringLength(2000)]
        public string? DescriptionEn { get; set; }
        [StringLength(2000)]
        public string? DescriptionRu { get; set; }
        
        [StringLength(100)]
        public string? Icon { get; set; }
        
        [StringLength(50)]
        public string? Color { get; set; }
        
        public int OrderIndex { get; set; } = 0;
    }

    // Create and Update DTOs for Tags
    public class CreateEquipmentTagDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        [StringLength(100)]
        public string? NameEn { get; set; }
        [StringLength(100)]
        public string? NameRu { get; set; }
        
        [StringLength(2000)]
        public string? Description { get; set; }
        [StringLength(2000)]
        public string? DescriptionEn { get; set; }
        [StringLength(2000)]
        public string? DescriptionRu { get; set; }
        
        [StringLength(50)]
        public string? Color { get; set; }
        
        public int OrderIndex { get; set; } = 0;
    }

    public class UpdateEquipmentTagDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        [StringLength(100)]
        public string? NameEn { get; set; }
        [StringLength(100)]
        public string? NameRu { get; set; }
        
        [StringLength(2000)]
        public string? Description { get; set; }
        [StringLength(2000)]
        public string? DescriptionEn { get; set; }
        [StringLength(2000)]
        public string? DescriptionRu { get; set; }
        
        [StringLength(50)]
        public string? Color { get; set; }
        
        public int OrderIndex { get; set; } = 0;
    }
}
