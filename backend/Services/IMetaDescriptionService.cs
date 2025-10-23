using WebOnlyAPI.DTOs;

namespace WebOnlyAPI.Services
{
    public interface IMetaDescriptionService
    {
        Task<List<MetaDescriptionListDto>> GetAllAsync();
        Task<MetaDescriptionResponseDto?> GetByPageAndLanguageAsync(string pageKey, string language);
        Task<MetaDescriptionResponseDto?> GetByIdAsync(int id);
        Task<MetaDescriptionResponseDto> CreateAsync(CreateMetaDescriptionDto dto);
        Task<MetaDescriptionResponseDto?> UpdateAsync(int id, UpdateMetaDescriptionDto dto);
        Task<bool> DeleteAsync(int id);
        Task<List<MetaDescriptionResponseDto>> GetByPageAsync(string pageKey);
        Task<bool> BulkUpdateAsync(List<MetaDescriptionResponseDto> metaDescriptions);
    }
}
