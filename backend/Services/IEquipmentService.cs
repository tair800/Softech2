using WebOnlyAPI.DTOs;

namespace WebOnlyAPI.Services
{
    public interface IEquipmentService
    {
        Task<IEnumerable<EquipmentListResponseDto>> GetAllAsync(string? language = null);
        Task<IEnumerable<EquipmentResponseDto>> GetAllFullAsync(string? language = null);
        Task<EquipmentResponseDto?> GetByIdAsync(int id, string? language = null);
        Task<EquipmentResponseDto> CreateAsync(CreateEquipmentDto dto);
        Task<EquipmentResponseDto?> UpdateAsync(int id, UpdateEquipmentDto dto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<EquipmentResponseDto>> SearchByNameAsync(string searchTerm);

        // Category CRUD operations
        Task<IEnumerable<EquipmentCategoryDto>> GetCategoriesAsync();
        Task<EquipmentCategoryDto> CreateCategoryAsync(CreateEquipmentCategoryDto dto);
        Task<EquipmentCategoryDto?> UpdateCategoryAsync(int id, UpdateEquipmentCategoryDto dto);
        Task<bool> DeleteCategoryAsync(int id);

        // Tag CRUD operations
        Task<IEnumerable<EquipmentTagDto>> GetTagsAsync();
        Task<EquipmentTagDto> CreateTagAsync(CreateEquipmentTagDto dto);
        Task<EquipmentTagDto?> UpdateTagAsync(int id, UpdateEquipmentTagDto dto);
        Task<bool> DeleteTagAsync(int id);
        Task<int> FixBlobUrlsAsync();
    }
}
