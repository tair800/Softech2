namespace WebOnlyAPI.DTOs
{
    public class CreateProductDto
    {
        public string Name { get; set; } = string.Empty;
        public string? NameEn { get; set; }
        public string? NameRu { get; set; }
        public string? Subtext { get; set; }
        public string? SubtextEn { get; set; }
        public string? SubtextRu { get; set; }
        public string? ImageUrl { get; set; }
        public string? Icon { get; set; }
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
        public string? Section3Image { get; set; }
    }

    public class UpdateProductDto
    {
        public string Name { get; set; } = string.Empty;
        public string? NameEn { get; set; }
        public string? NameRu { get; set; }
        public string? Subtext { get; set; }
        public string? SubtextEn { get; set; }
        public string? SubtextRu { get; set; }
        public string? ImageUrl { get; set; }
        public string? Icon { get; set; }
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
        public string? Section3Image { get; set; }
    }

    public class ProductResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? NameEn { get; set; }
        public string? NameRu { get; set; }
        public string? Subtext { get; set; }
        public string? SubtextEn { get; set; }
        public string? SubtextRu { get; set; }
        public string? Icon { get; set; }
        public string? Alt { get; set; }
        public string? Path { get; set; }
        public string? MainImage { get; set; }
        public string? ImageUrl { get; set; }
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
        public string? Section3Image { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<ProductImageDto> Images { get; set; } = new();
    }

    public class ProductImageDto
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string? Alt { get; set; }
        public int OrderIndex { get; set; }
    }
}
