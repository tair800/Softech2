using WebOnlyAPI.DTOs;
using WebOnlyAPI.Models;

namespace WebOnlyAPI.Services
{
    public interface IEmployeeService
    {
        Task<IEnumerable<EmployeeResponseDto>> GetAllEmployeesAsync(string? language = null);
        Task<EmployeeResponseDto?> GetEmployeeByIdAsync(int id, string? language = null);
        Task<EmployeeResponseDto> CreateEmployeeAsync(CreateEmployeeDto createDto);
        Task<EmployeeResponseDto?> UpdateEmployeeAsync(int id, UpdateEmployeeDto updateDto);
        Task<bool> DeleteEmployeeAsync(int id);
    }
}
