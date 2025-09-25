namespace WebOnlyAPI.DTOs
{
    public class ProductListItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Subtext { get; set; }
        public string? Icon { get; set; }
        public string? Alt { get; set; }
        public string? Path { get; set; }
        public string? MainImage { get; set; }
        public string? Description { get; set; }
    }
}


