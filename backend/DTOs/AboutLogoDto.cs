using WebOnlyAPI.Models;

namespace WebOnlyAPI.DTOs
{
    public class AboutLogoDto
    {
        public int Id { get; set; }
        public string Heading { get; set; } = string.Empty;
        public string Subtext { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public static AboutLogoDto FromModel(AboutLogo m, string? language)
        {
            string lang = (language ?? "az").ToLowerInvariant();
            string heading = m.Heading;
            string subtext = m.Subtext;

            if (lang == "en")
            {
                heading = string.IsNullOrWhiteSpace(m.HeadingEn) ? m.Heading : m.HeadingEn!;
                subtext = string.IsNullOrWhiteSpace(m.SubtextEn) ? m.Subtext : m.SubtextEn!;
            }
            else if (lang == "ru")
            {
                heading = string.IsNullOrWhiteSpace(m.HeadingRu) ? m.Heading : m.HeadingRu!;
                subtext = string.IsNullOrWhiteSpace(m.SubtextRu) ? m.Subtext : m.SubtextRu!;
            }

            return new AboutLogoDto
            {
                Id = m.Id,
                Heading = heading,
                Subtext = subtext,
                ImageUrl = m.ImageUrl,
                CreatedAt = m.CreatedAt,
                UpdatedAt = m.UpdatedAt
            };
        }
    }
}


