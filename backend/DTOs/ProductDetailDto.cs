using System.Collections.Generic;

namespace WebOnlyAPI.DTOs
{
    public class ProductDetailDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Subtext { get; set; }
        public string? Icon { get; set; }
        public string? Alt { get; set; }
        public string? Path { get; set; }
        public string? MainImage { get; set; }
        public string? Description { get; set; }

        public List<string> SectionImages { get; set; } = new List<string>();
        public List<ProductSectionDto> Sections { get; set; } = new List<ProductSectionDto>();
    }

    public class ProductSectionDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? MoreText { get; set; }
    }
}




 




