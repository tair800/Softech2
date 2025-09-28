using Microsoft.EntityFrameworkCore;
using WebOnlyAPI.Data;
using WebOnlyAPI.DTOs;
using WebOnlyAPI.Models;

namespace WebOnlyAPI.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly ApplicationDbContext _context;

        public EmployeeService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<EmployeeResponseDto>> GetAllEmployeesAsync(string? language = null)
        {
            var employees = await _context.Employees
                .OrderBy(e => e.CreatedAt)
                .ToListAsync();

            var list = employees.Select(MapToResponseDto).ToList();
            if (!string.IsNullOrWhiteSpace(language))
            {
                var lang = language.ToLowerInvariant();
                foreach (var e in list)
                {
                    if (lang == "en")
                    {
                        var src = employees.First(x => x.Id == e.Id);
                        e.Name = string.IsNullOrWhiteSpace(src.NameEn) ? e.Name : src.NameEn!;
                        e.Position = string.IsNullOrWhiteSpace(src.PositionEn) ? e.Position : src.PositionEn!;
                        e.Description = string.IsNullOrWhiteSpace(src.DescriptionEn) ? e.Description : src.DescriptionEn!;
                    }
                    else if (lang == "ru")
                    {
                        var src = employees.First(x => x.Id == e.Id);
                        e.Name = string.IsNullOrWhiteSpace(src.NameRu) ? e.Name : src.NameRu!;
                        e.Position = string.IsNullOrWhiteSpace(src.PositionRu) ? e.Position : src.PositionRu!;
                        e.Description = string.IsNullOrWhiteSpace(src.DescriptionRu) ? e.Description : src.DescriptionRu!;
                    }
                }
            }
            return list;
        }

        public async Task<EmployeeResponseDto?> GetEmployeeByIdAsync(int id, string? language = null)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return null;
            var dto = MapToResponseDto(employee);
            if (!string.IsNullOrWhiteSpace(language))
            {
                var lang = language.ToLowerInvariant();
                if (lang == "en")
                {
                    dto.Name = string.IsNullOrWhiteSpace(employee.NameEn) ? dto.Name : employee.NameEn!;
                    dto.Position = string.IsNullOrWhiteSpace(employee.PositionEn) ? dto.Position : employee.PositionEn!;
                    dto.Description = string.IsNullOrWhiteSpace(employee.DescriptionEn) ? dto.Description : employee.DescriptionEn!;
                }
                else if (lang == "ru")
                {
                    dto.Name = string.IsNullOrWhiteSpace(employee.NameRu) ? dto.Name : employee.NameRu!;
                    dto.Position = string.IsNullOrWhiteSpace(employee.PositionRu) ? dto.Position : employee.PositionRu!;
                    dto.Description = string.IsNullOrWhiteSpace(employee.DescriptionRu) ? dto.Description : employee.DescriptionRu!;
                }
            }
            return dto;
        }

        public async Task<EmployeeResponseDto> CreateEmployeeAsync(CreateEmployeeDto createDto)
        {
            var employee = new Employee
            {
                Name = createDto.Name,
                NameEn = createDto.NameEn,
                NameRu = createDto.NameRu,
                Position = createDto.Position,
                PositionEn = createDto.PositionEn,
                PositionRu = createDto.PositionRu,
                Description = createDto.Description,
                DescriptionEn = createDto.DescriptionEn,
                DescriptionRu = createDto.DescriptionRu,
                Phone = createDto.Phone,
                Email = createDto.Email,
                LinkedIn = createDto.LinkedIn,
                ImageUrl = createDto.ImageUrl,
                CreatedAt = DateTime.UtcNow
            };

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return MapToResponseDto(employee);
        }

        public async Task<EmployeeResponseDto?> UpdateEmployeeAsync(int id, UpdateEmployeeDto updateDto)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
                return null;

            employee.Name = updateDto.Name;
            employee.NameEn = updateDto.NameEn;
            employee.NameRu = updateDto.NameRu;
            employee.Position = updateDto.Position;
            employee.PositionEn = updateDto.PositionEn;
            employee.PositionRu = updateDto.PositionRu;
            employee.Description = updateDto.Description;
            employee.DescriptionEn = updateDto.DescriptionEn;
            employee.DescriptionRu = updateDto.DescriptionRu;
            employee.Phone = updateDto.Phone;
            employee.Email = updateDto.Email;
            employee.LinkedIn = updateDto.LinkedIn;
            employee.ImageUrl = updateDto.ImageUrl;
            employee.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapToResponseDto(employee);
        }

        public async Task<bool> DeleteEmployeeAsync(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
                return false;

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return true;
        }

        private static EmployeeResponseDto MapToResponseDto(Employee employee)
        {
            return new EmployeeResponseDto
            {
                Id = employee.Id,
                Name = employee.Name,
                NameEn = employee.NameEn,
                NameRu = employee.NameRu,
                Position = employee.Position,
                PositionEn = employee.PositionEn,
                PositionRu = employee.PositionRu,
                Description = employee.Description,
                DescriptionEn = employee.DescriptionEn,
                DescriptionRu = employee.DescriptionRu,
                Phone = employee.Phone,
                Email = employee.Email,
                LinkedIn = employee.LinkedIn,
                ImageUrl = employee.ImageUrl,
                CreatedAt = employee.CreatedAt,
                UpdatedAt = employee.UpdatedAt
            };
        }
    }
}
