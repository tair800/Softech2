using WebOnlyAPI.DTOs;

namespace WebOnlyAPI.Services
{
    public interface IServiceService
    {
        Task<IEnumerable<ServiceResponseDto>> GetAllServicesAsync(string? language = null);
        Task<ServiceResponseDto?> GetServiceByIdAsync(int id, string? language = null);
        Task<ServiceResponseDto> CreateServiceAsync(CreateServiceDto createServiceDto);
        Task<ServiceResponseDto?> UpdateServiceAsync(int id, UpdateServiceDto updateServiceDto);
        Task<bool> DeleteServiceAsync(int id);
    }
}
