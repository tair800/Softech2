using WebOnlyAPI.DTOs;

namespace WebOnlyAPI.Services
{
    public interface IProductService
    {
        Task<IEnumerable<ProductResponseDto>> GetAllProductsAsync(string? language = null);
        Task<ProductResponseDto?> GetProductByIdAsync(int id, string? language = null);
        Task<ProductResponseDto> CreateProductAsync(CreateProductDto createDto);
        Task<ProductResponseDto?> UpdateProductAsync(int id, UpdateProductDto updateDto);
        Task<bool> DeleteProductAsync(int id);

        // Images
        Task<IEnumerable<ProductImageDto>> GetImagesAsync(int productId);
        Task<ProductImageDto> AddImageAsync(int productId, ProductImageDto dto);
        Task<bool> DeleteImageAsync(int productId, int imageId);
        Task<ProductImageDto?> UpdateImageAsync(int productId, int imageId, ProductImageDto dto);
        Task<bool> SetMainImageAsync(int productId, int imageId);
        Task<IEnumerable<ProductResponseDto>> SearchByNameAsync(string searchTerm);
    }
}
