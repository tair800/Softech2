using System;

namespace WebOnlyAPI.DTOs
{
    public class CreateBlogDto
    {
        public string Title1 { get; set; } = string.Empty;
        public string? Desc1 { get; set; }
        public string? Title1En { get; set; }
        public string? Title1Ru { get; set; }
        public string? Desc1En { get; set; }
        public string? Desc1Ru { get; set; }
        public string? Title2 { get; set; }
        public string? Desc2 { get; set; }
        public string? Title2En { get; set; }
        public string? Title2Ru { get; set; }
        public string? Desc2En { get; set; }
        public string? Desc2Ru { get; set; }
        public string? Features { get; set; } // JSON array string
        public string? Title3 { get; set; }
        public string? Desc3 { get; set; }
        public string? Title3En { get; set; }
        public string? Title3Ru { get; set; }
        public string? Desc3En { get; set; }
        public string? Desc3Ru { get; set; }
        public string? MainImageUrl { get; set; }
        public string? DetailImg1Url { get; set; }
        public string? DetailImg2Url { get; set; }
        public string? DetailImg3Url { get; set; }
        public string? DetailImg4Url { get; set; }
        public DateTimeOffset? PublishedAt { get; set; }
    }

    public class UpdateBlogDto
    {
        public string Title1 { get; set; } = string.Empty;
        public string? Desc1 { get; set; }
        public string? Title1En { get; set; }
        public string? Title1Ru { get; set; }
        public string? Desc1En { get; set; }
        public string? Desc1Ru { get; set; }
        public string? Title2 { get; set; }
        public string? Desc2 { get; set; }
        public string? Title2En { get; set; }
        public string? Title2Ru { get; set; }
        public string? Desc2En { get; set; }
        public string? Desc2Ru { get; set; }
        public string? Features { get; set; } // JSON array string
        public string? Title3 { get; set; }
        public string? Desc3 { get; set; }
        public string? Title3En { get; set; }
        public string? Title3Ru { get; set; }
        public string? Desc3En { get; set; }
        public string? Desc3Ru { get; set; }
        public string? MainImageUrl { get; set; }
        public string? DetailImg1Url { get; set; }
        public string? DetailImg2Url { get; set; }
        public string? DetailImg3Url { get; set; }
        public string? DetailImg4Url { get; set; }
        public DateTimeOffset? PublishedAt { get; set; }
    }

    public class BlogResponseDto
    {
        public int Id { get; set; }
        public string Title1 { get; set; } = string.Empty;
        public string? Desc1 { get; set; }
        public string? Title1En { get; set; }
        public string? Title1Ru { get; set; }
        public string? Desc1En { get; set; }
        public string? Desc1Ru { get; set; }
        public string? Title2 { get; set; }
        public string? Desc2 { get; set; }
        public string? Title2En { get; set; }
        public string? Title2Ru { get; set; }
        public string? Desc2En { get; set; }
        public string? Desc2Ru { get; set; }
        public string? Features { get; set; }
        public string? Title3 { get; set; }
        public string? Desc3 { get; set; }
        public string? Title3En { get; set; }
        public string? Title3Ru { get; set; }
        public string? Desc3En { get; set; }
        public string? Desc3Ru { get; set; }
        public string? MainImageUrl { get; set; }
        public string? DetailImg1Url { get; set; }
        public string? DetailImg2Url { get; set; }
        public string? DetailImg3Url { get; set; }
        public string? DetailImg4Url { get; set; }
        public DateTimeOffset? PublishedAt { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}


