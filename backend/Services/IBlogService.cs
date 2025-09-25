using WebOnlyAPI.DTOs;

namespace WebOnlyAPI.Services
{
    public interface IBlogService
    {
        Task<IEnumerable<BlogResponseDto>> GetAllAsync();
        Task<BlogResponseDto?> GetByIdAsync(int id);
        Task<BlogResponseDto> CreateAsync(CreateBlogDto createDto);
        Task<BlogResponseDto?> UpdateAsync(int id, UpdateBlogDto updateDto);
        Task<bool> DeleteAsync(int id);
    }
}


