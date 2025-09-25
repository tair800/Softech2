using Microsoft.EntityFrameworkCore;
using WebOnlyAPI.Data;
using WebOnlyAPI.DTOs;
using WebOnlyAPI.Models;

namespace WebOnlyAPI.Services
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _context;

        public ProductService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProductResponseDto>> GetAllProductsAsync(string? language = null)
        {
            var products = await _context.Products
                .Include(p => p.Images)
                .OrderBy(p => p.CreatedAt)
                .ToListAsync();

            var list = products.Select(MapToResponseDto).ToList();
            if (!string.IsNullOrWhiteSpace(language))
            {
                var lang = language.ToLowerInvariant();
                foreach (var dto in list)
                {
                    var src = products.First(p => p.Id == dto.Id);
                    if (lang == "en")
                    {
                        dto.Name = string.IsNullOrWhiteSpace(src.NameEn) ? dto.Name : src.NameEn!;
                        dto.Subtext = string.IsNullOrWhiteSpace(src.SubtextEn) ? dto.Subtext : src.SubtextEn!;
                        dto.DetailDescription = string.IsNullOrWhiteSpace(src.DetailDescriptionEn) ? dto.DetailDescription : src.DetailDescriptionEn!;
                        dto.Section1Title = string.IsNullOrWhiteSpace(src.Section1TitleEn) ? dto.Section1Title : src.Section1TitleEn!;
                        dto.Section1Description = string.IsNullOrWhiteSpace(src.Section1DescriptionEn) ? dto.Section1Description : src.Section1DescriptionEn!;
                        dto.Section1MoreText = string.IsNullOrWhiteSpace(src.Section1MoreTextEn) ? dto.Section1MoreText : src.Section1MoreTextEn!;
                        dto.Section2Title = string.IsNullOrWhiteSpace(src.Section2TitleEn) ? dto.Section2Title : src.Section2TitleEn!;
                        dto.Section2Description = string.IsNullOrWhiteSpace(src.Section2DescriptionEn) ? dto.Section2Description : src.Section2DescriptionEn!;
                        dto.Section2MoreText = string.IsNullOrWhiteSpace(src.Section2MoreTextEn) ? dto.Section2MoreText : src.Section2MoreTextEn!;
                        dto.Section3Title = string.IsNullOrWhiteSpace(src.Section3TitleEn) ? dto.Section3Title : src.Section3TitleEn!;
                        dto.Section3Description = string.IsNullOrWhiteSpace(src.Section3DescriptionEn) ? dto.Section3Description : src.Section3DescriptionEn!;
                        dto.Section3MoreText = string.IsNullOrWhiteSpace(src.Section3MoreTextEn) ? dto.Section3MoreText : src.Section3MoreTextEn!;
                    }
                    else if (lang == "ru")
                    {
                        dto.Name = string.IsNullOrWhiteSpace(src.NameRu) ? dto.Name : src.NameRu!;
                        dto.Subtext = string.IsNullOrWhiteSpace(src.SubtextRu) ? dto.Subtext : src.SubtextRu!;
                        dto.DetailDescription = string.IsNullOrWhiteSpace(src.DetailDescriptionRu) ? dto.DetailDescription : src.DetailDescriptionRu!;
                        dto.Section1Title = string.IsNullOrWhiteSpace(src.Section1TitleRu) ? dto.Section1Title : src.Section1TitleRu!;
                        dto.Section1Description = string.IsNullOrWhiteSpace(src.Section1DescriptionRu) ? dto.Section1Description : src.Section1DescriptionRu!;
                        dto.Section1MoreText = string.IsNullOrWhiteSpace(src.Section1MoreTextRu) ? dto.Section1MoreText : src.Section1MoreTextRu!;
                        dto.Section2Title = string.IsNullOrWhiteSpace(src.Section2TitleRu) ? dto.Section2Title : src.Section2TitleRu!;
                        dto.Section2Description = string.IsNullOrWhiteSpace(src.Section2DescriptionRu) ? dto.Section2Description : src.Section2DescriptionRu!;
                        dto.Section2MoreText = string.IsNullOrWhiteSpace(src.Section2MoreTextRu) ? dto.Section2MoreText : src.Section2MoreTextRu!;
                        dto.Section3Title = string.IsNullOrWhiteSpace(src.Section3TitleRu) ? dto.Section3Title : src.Section3TitleRu!;
                        dto.Section3Description = string.IsNullOrWhiteSpace(src.Section3DescriptionRu) ? dto.Section3Description : src.Section3DescriptionRu!;
                        dto.Section3MoreText = string.IsNullOrWhiteSpace(src.Section3MoreTextRu) ? dto.Section3MoreText : src.Section3MoreTextRu!;
                    }
                }
            }
            return list;
        }

        public async Task<ProductResponseDto?> GetProductByIdAsync(int id, string? language = null)
        {
            var product = await _context.Products
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id);
            if (product == null) return null;
            var dto = MapToResponseDto(product);
            if (!string.IsNullOrWhiteSpace(language))
            {
                var lang = language.ToLowerInvariant();
                if (lang == "en")
                {
                    dto.Name = string.IsNullOrWhiteSpace(product.NameEn) ? dto.Name : product.NameEn!;
                    dto.Subtext = string.IsNullOrWhiteSpace(product.SubtextEn) ? dto.Subtext : product.SubtextEn!;
                    dto.DetailDescription = string.IsNullOrWhiteSpace(product.DetailDescriptionEn) ? dto.DetailDescription : product.DetailDescriptionEn!;
                    dto.Section1Title = string.IsNullOrWhiteSpace(product.Section1TitleEn) ? dto.Section1Title : product.Section1TitleEn!;
                    dto.Section1Description = string.IsNullOrWhiteSpace(product.Section1DescriptionEn) ? dto.Section1Description : product.Section1DescriptionEn!;
                    dto.Section1MoreText = string.IsNullOrWhiteSpace(product.Section1MoreTextEn) ? dto.Section1MoreText : product.Section1MoreTextEn!;
                    dto.Section2Title = string.IsNullOrWhiteSpace(product.Section2TitleEn) ? dto.Section2Title : product.Section2TitleEn!;
                    dto.Section2Description = string.IsNullOrWhiteSpace(product.Section2DescriptionEn) ? dto.Section2Description : product.Section2DescriptionEn!;
                    dto.Section2MoreText = string.IsNullOrWhiteSpace(product.Section2MoreTextEn) ? dto.Section2MoreText : product.Section2MoreTextEn!;
                    dto.Section3Title = string.IsNullOrWhiteSpace(product.Section3TitleEn) ? dto.Section3Title : product.Section3TitleEn!;
                    dto.Section3Description = string.IsNullOrWhiteSpace(product.Section3DescriptionEn) ? dto.Section3Description : product.Section3DescriptionEn!;
                    dto.Section3MoreText = string.IsNullOrWhiteSpace(product.Section3MoreTextEn) ? dto.Section3MoreText : product.Section3MoreTextEn!;
                }
                else if (lang == "ru")
                {
                    dto.Name = string.IsNullOrWhiteSpace(product.NameRu) ? dto.Name : product.NameRu!;
                    dto.Subtext = string.IsNullOrWhiteSpace(product.SubtextRu) ? dto.Subtext : product.SubtextRu!;
                    dto.DetailDescription = string.IsNullOrWhiteSpace(product.DetailDescriptionRu) ? dto.DetailDescription : product.DetailDescriptionRu!;
                    dto.Section1Title = string.IsNullOrWhiteSpace(product.Section1TitleRu) ? dto.Section1Title : product.Section1TitleRu!;
                    dto.Section1Description = string.IsNullOrWhiteSpace(product.Section1DescriptionRu) ? dto.Section1Description : product.Section1DescriptionRu!;
                    dto.Section1MoreText = string.IsNullOrWhiteSpace(product.Section1MoreTextRu) ? dto.Section1MoreText : product.Section1MoreTextRu!;
                    dto.Section2Title = string.IsNullOrWhiteSpace(product.Section2TitleRu) ? dto.Section2Title : product.Section2TitleRu!;
                    dto.Section2Description = string.IsNullOrWhiteSpace(product.Section2DescriptionRu) ? dto.Section2Description : product.Section2DescriptionRu!;
                    dto.Section2MoreText = string.IsNullOrWhiteSpace(product.Section2MoreTextRu) ? dto.Section2MoreText : product.Section2MoreTextRu!;
                    dto.Section3Title = string.IsNullOrWhiteSpace(product.Section3TitleRu) ? dto.Section3Title : product.Section3TitleRu!;
                    dto.Section3Description = string.IsNullOrWhiteSpace(product.Section3DescriptionRu) ? dto.Section3Description : product.Section3DescriptionRu!;
                    dto.Section3MoreText = string.IsNullOrWhiteSpace(product.Section3MoreTextRu) ? dto.Section3MoreText : product.Section3MoreTextRu!;
                }
            }
            return dto;
        }

        public async Task<ProductResponseDto> CreateProductAsync(CreateProductDto createDto)
        {
            var product = new Product
            {
                Name = createDto.Name,
                NameEn = createDto.NameEn,
                NameRu = createDto.NameRu,
                Subtext = createDto.Subtext,
                SubtextEn = createDto.SubtextEn,
                SubtextRu = createDto.SubtextRu,
                ImageUrl = createDto.ImageUrl,
                Icon = createDto.Icon,
                DetailDescription = createDto.DetailDescription,
                DetailDescriptionEn = createDto.DetailDescriptionEn,
                DetailDescriptionRu = createDto.DetailDescriptionRu,
                Section1Title = createDto.Section1Title,
                Section1TitleEn = createDto.Section1TitleEn,
                Section1TitleRu = createDto.Section1TitleRu,
                Section1Description = createDto.Section1Description,
                Section1DescriptionEn = createDto.Section1DescriptionEn,
                Section1DescriptionRu = createDto.Section1DescriptionRu,
                Section1MoreText = createDto.Section1MoreText,
                Section1MoreTextEn = createDto.Section1MoreTextEn,
                Section1MoreTextRu = createDto.Section1MoreTextRu,
                Section1Image = createDto.Section1Image,
                Section2Title = createDto.Section2Title,
                Section2TitleEn = createDto.Section2TitleEn,
                Section2TitleRu = createDto.Section2TitleRu,
                Section2Description = createDto.Section2Description,
                Section2DescriptionEn = createDto.Section2DescriptionEn,
                Section2DescriptionRu = createDto.Section2DescriptionRu,
                Section2MoreText = createDto.Section2MoreText,
                Section2MoreTextEn = createDto.Section2MoreTextEn,
                Section2MoreTextRu = createDto.Section2MoreTextRu,
                Section2Image = createDto.Section2Image,
                Section3Title = createDto.Section3Title,
                Section3TitleEn = createDto.Section3TitleEn,
                Section3TitleRu = createDto.Section3TitleRu,
                Section3Description = createDto.Section3Description,
                Section3DescriptionEn = createDto.Section3DescriptionEn,
                Section3DescriptionRu = createDto.Section3DescriptionRu,
                Section3MoreText = createDto.Section3MoreText,
                Section3MoreTextEn = createDto.Section3MoreTextEn,
                Section3MoreTextRu = createDto.Section3MoreTextRu,
                Section3Image = createDto.Section3Image,
                CreatedAt = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return MapToResponseDto(product);
        }

        public async Task<ProductResponseDto?> UpdateProductAsync(int id, UpdateProductDto updateDto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return null;

            product.Name = updateDto.Name;
            product.NameEn = updateDto.NameEn;
            product.NameRu = updateDto.NameRu;
            product.Subtext = updateDto.Subtext;
            product.SubtextEn = updateDto.SubtextEn;
            product.SubtextRu = updateDto.SubtextRu;
            product.ImageUrl = updateDto.ImageUrl;
            if (!string.IsNullOrWhiteSpace(updateDto.Icon)) product.Icon = updateDto.Icon;
            product.DetailDescription = updateDto.DetailDescription;
            product.DetailDescriptionEn = updateDto.DetailDescriptionEn;
            product.DetailDescriptionRu = updateDto.DetailDescriptionRu;
            product.Section1Title = updateDto.Section1Title;
            product.Section1TitleEn = updateDto.Section1TitleEn;
            product.Section1TitleRu = updateDto.Section1TitleRu;
            product.Section1Description = updateDto.Section1Description;
            product.Section1DescriptionEn = updateDto.Section1DescriptionEn;
            product.Section1DescriptionRu = updateDto.Section1DescriptionRu;
            product.Section1MoreText = updateDto.Section1MoreText;
            product.Section1MoreTextEn = updateDto.Section1MoreTextEn;
            product.Section1MoreTextRu = updateDto.Section1MoreTextRu;
            product.Section1Image = updateDto.Section1Image;
            product.Section2Title = updateDto.Section2Title;
            product.Section2TitleEn = updateDto.Section2TitleEn;
            product.Section2TitleRu = updateDto.Section2TitleRu;
            product.Section2Description = updateDto.Section2Description;
            product.Section2DescriptionEn = updateDto.Section2DescriptionEn;
            product.Section2DescriptionRu = updateDto.Section2DescriptionRu;
            product.Section2MoreText = updateDto.Section2MoreText;
            product.Section2MoreTextEn = updateDto.Section2MoreTextEn;
            product.Section2MoreTextRu = updateDto.Section2MoreTextRu;
            product.Section2Image = updateDto.Section2Image;
            product.Section3Title = updateDto.Section3Title;
            product.Section3TitleEn = updateDto.Section3TitleEn;
            product.Section3TitleRu = updateDto.Section3TitleRu;
            product.Section3Description = updateDto.Section3Description;
            product.Section3DescriptionEn = updateDto.Section3DescriptionEn;
            product.Section3DescriptionRu = updateDto.Section3DescriptionRu;
            product.Section3MoreText = updateDto.Section3MoreText;
            product.Section3MoreTextEn = updateDto.Section3MoreTextEn;
            product.Section3MoreTextRu = updateDto.Section3MoreTextRu;
            product.Section3Image = updateDto.Section3Image;
            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapToResponseDto(product);
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return true;
        }

        private static ProductResponseDto MapToResponseDto(Product product)
        {
            return new ProductResponseDto
            {
                Id = product.Id,
                Name = product.Name,
                NameEn = product.NameEn,
                NameRu = product.NameRu,
                Subtext = product.Subtext,
                SubtextEn = product.SubtextEn,
                SubtextRu = product.SubtextRu,
                Icon = product.Icon,
                Alt = product.Alt,
                Path = product.Path,
                MainImage = product.MainImage,
                ImageUrl = product.ImageUrl,
                DetailDescription = product.DetailDescription,
                DetailDescriptionEn = product.DetailDescriptionEn,
                DetailDescriptionRu = product.DetailDescriptionRu,
                CreatedAt = product.CreatedAt,
                UpdatedAt = product.UpdatedAt,
                Section1Title = product.Section1Title,
                Section1TitleEn = product.Section1TitleEn,
                Section1TitleRu = product.Section1TitleRu,
                Section1Description = product.Section1Description,
                Section1DescriptionEn = product.Section1DescriptionEn,
                Section1DescriptionRu = product.Section1DescriptionRu,
                Section1MoreText = product.Section1MoreText,
                Section1MoreTextEn = product.Section1MoreTextEn,
                Section1MoreTextRu = product.Section1MoreTextRu,
                Section1Image = product.Section1Image,
                Section2Title = product.Section2Title,
                Section2TitleEn = product.Section2TitleEn,
                Section2TitleRu = product.Section2TitleRu,
                Section2Description = product.Section2Description,
                Section2DescriptionEn = product.Section2DescriptionEn,
                Section2DescriptionRu = product.Section2DescriptionRu,
                Section2MoreText = product.Section2MoreText,
                Section2MoreTextEn = product.Section2MoreTextEn,
                Section2MoreTextRu = product.Section2MoreTextRu,
                Section2Image = product.Section2Image,
                Section3Title = product.Section3Title,
                Section3TitleEn = product.Section3TitleEn,
                Section3TitleRu = product.Section3TitleRu,
                Section3Description = product.Section3Description,
                Section3DescriptionEn = product.Section3DescriptionEn,
                Section3DescriptionRu = product.Section3DescriptionRu,
                Section3MoreText = product.Section3MoreText,
                Section3MoreTextEn = product.Section3MoreTextEn,
                Section3MoreTextRu = product.Section3MoreTextRu,
                Section3Image = product.Section3Image,
                Images = product.Images?.OrderBy(i => i.OrderIndex).Select(i => new ProductImageDto
                {
                    Id = i.Id,
                    ImageUrl = i.ImageUrl,
                    Alt = i.Alt,
                    OrderIndex = i.OrderIndex
                }).ToList() ?? new List<ProductImageDto>()
            };
        }

        public async Task<IEnumerable<ProductImageDto>> GetImagesAsync(int productId)
        {
            var images = await _context.ProductImages
                .Where(pi => pi.ProductId == productId)
                .OrderBy(pi => pi.OrderIndex)
                .ToListAsync();
            return images.Select(i => new ProductImageDto { Id = i.Id, ImageUrl = i.ImageUrl, Alt = i.Alt, OrderIndex = i.OrderIndex });
        }

        public async Task<ProductImageDto> AddImageAsync(int productId, ProductImageDto dto)
        {
            var maxOrder = await _context.ProductImages.Where(pi => pi.ProductId == productId).MaxAsync(pi => (int?)pi.OrderIndex) ?? -1;
            var entity = new ProductImage
            {
                ProductId = productId,
                ImageUrl = dto.ImageUrl,
                Alt = dto.Alt,
                OrderIndex = maxOrder + 1
            };
            _context.ProductImages.Add(entity);
            await _context.SaveChangesAsync();
            return new ProductImageDto { Id = entity.Id, ImageUrl = entity.ImageUrl, Alt = entity.Alt, OrderIndex = entity.OrderIndex };
        }

        public async Task<bool> DeleteImageAsync(int productId, int imageId)
        {
            var entity = await _context.ProductImages.FirstOrDefaultAsync(pi => pi.Id == imageId && pi.ProductId == productId);
            if (entity == null) return false;
            _context.ProductImages.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<ProductImageDto?> UpdateImageAsync(int productId, int imageId, ProductImageDto dto)
        {
            var entity = await _context.ProductImages.FirstOrDefaultAsync(pi => pi.Id == imageId && pi.ProductId == productId);
            if (entity == null) return null;
            if (!string.IsNullOrWhiteSpace(dto.ImageUrl)) entity.ImageUrl = dto.ImageUrl;
            entity.Alt = dto.Alt;
            entity.OrderIndex = dto.OrderIndex;
            await _context.SaveChangesAsync();
            return new ProductImageDto { Id = entity.Id, ImageUrl = entity.ImageUrl, Alt = entity.Alt, OrderIndex = entity.OrderIndex };
        }

        public async Task<bool> SetMainImageAsync(int productId, int imageId)
        {
            var img = await _context.ProductImages.FirstOrDefaultAsync(x => x.Id == imageId && x.ProductId == productId);
            var prod = await _context.Products.FirstOrDefaultAsync(x => x.Id == productId);
            if (img == null || prod == null) return false;
            prod.ImageUrl = img.ImageUrl;
            prod.MainImage = img.ImageUrl;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<ProductResponseDto>> SearchByNameAsync(string searchTerm)
        {
            var results = await _context.Products
                .Include(p => p.Images)
                .Where(p => p.Name.ToLower().StartsWith(searchTerm.ToLower()))
                .OrderBy(p => p.CreatedAt)
                .ToListAsync();

            return results.Select(MapToResponseDto);
        }
    }
}
