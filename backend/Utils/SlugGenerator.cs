using System.Text.RegularExpressions;

namespace WebOnlyAPI.Utils
{
    public static class SlugGenerator
    {
        public static string GenerateSlug(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return string.Empty;

            // Convert to lowercase
            text = text.ToLowerInvariant();

            // Replace Azerbaijani characters with their ASCII equivalents
            text = text
                .Replace('ə', 'e')
                .Replace('ü', 'u')
                .Replace('ö', 'o')
                .Replace('ı', 'i')
                .Replace('ğ', 'g')
                .Replace('ç', 'c')
                .Replace('ş', 's')
                .Replace('q', 'q');

            // Remove accents and diacritics
            text = RemoveAccents(text);

            // Replace spaces and special characters with hyphens
            text = Regex.Replace(text, @"[^a-z0-9\s-]", "");

            // Replace multiple spaces/hyphens with single hyphen
            text = Regex.Replace(text, @"[\s-]+", "-");

            // Trim hyphens from start and end
            text = text.Trim('-');

            // Ensure slug is not empty and has reasonable length
            if (string.IsNullOrWhiteSpace(text))
                return "item";

            // Limit length to 100 characters
            if (text.Length > 100)
                text = text.Substring(0, 100).TrimEnd('-');

            return text;
        }

        private static string RemoveAccents(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return text;

            byte[] bytes = System.Text.Encoding.GetEncoding("Cyrillic").GetBytes(text);
            return System.Text.Encoding.ASCII.GetString(bytes);
        }
    }
}
