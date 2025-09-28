using WebOnlyAPI.DTOs;

namespace WebOnlyAPI.Services
{
    public interface IBlogSectionService
    {
        Task<IEnumerable<BlogSectionResponseDto>> GetAllByBlogIdAsync(int blogId);
        Task<BlogSectionResponseDto?> GetByIdAsync(int id);
        Task<BlogSectionResponseDto> CreateAsync(CreateBlogSectionDto createDto);
        Task<BlogSectionResponseDto?> UpdateAsync(int id, UpdateBlogSectionDto updateDto);
        Task<bool> DeleteAsync(int id);
    }
}
