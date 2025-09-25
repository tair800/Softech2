using WebOnlyAPI.DTOs;

namespace WebOnlyAPI.Services
{
    public interface IReferenceService
    {
        Task<IEnumerable<ReferenceResponseDto>> GetAllAsync();
        Task<ReferenceResponseDto?> GetByIdAsync(int id);
        Task<ReferenceResponseDto> CreateAsync(CreateReferenceDto dto);
        Task<ReferenceResponseDto?> UpdateAsync(int id, UpdateReferenceDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
