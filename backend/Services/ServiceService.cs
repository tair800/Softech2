using Microsoft.EntityFrameworkCore;
using WebOnlyAPI.Data;
using WebOnlyAPI.DTOs;
using WebOnlyAPI.Models;

namespace WebOnlyAPI.Services
{
    public class ServiceService : IServiceService
    {
        private readonly ApplicationDbContext _context;

        public ServiceService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ServiceResponseDto>> GetAllServicesAsync(string? language = null)
        {
            var services = await _context.Services
                .OrderBy(s => s.Id)
                .ToListAsync();

            var list = services.Select(MapToResponseDto).ToList();
            if (!string.IsNullOrWhiteSpace(language))
            {
                var lang = language.ToLowerInvariant();
                foreach (var dto in list)
                {
                    var src = services.First(s => s.Id == dto.Id);
                    if (lang == "en")
                    {
                        dto.Name = string.IsNullOrWhiteSpace(src.NameEn) ? dto.Name : src.NameEn!;
                        dto.Subtitle = string.IsNullOrWhiteSpace(src.SubtitleEn) ? dto.Subtitle : src.SubtitleEn!;
                        dto.Description = string.IsNullOrWhiteSpace(src.DescriptionEn) ? dto.Description : src.DescriptionEn!;
                        dto.Subtext = string.IsNullOrWhiteSpace(src.SubtextEn) ? dto.Subtext : src.SubtextEn!;
                    }
                    else if (lang == "ru")
                    {
                        dto.Name = string.IsNullOrWhiteSpace(src.NameRu) ? dto.Name : src.NameRu!;
                        dto.Subtitle = string.IsNullOrWhiteSpace(src.SubtitleRu) ? dto.Subtitle : src.SubtitleRu!;
                        dto.Description = string.IsNullOrWhiteSpace(src.DescriptionRu) ? dto.Description : src.DescriptionRu!;
                        dto.Subtext = string.IsNullOrWhiteSpace(src.SubtextRu) ? dto.Subtext : src.SubtextRu!;
                    }
                }
            }
            return list;
        }

        public async Task<ServiceResponseDto?> GetServiceByIdAsync(int id, string? language = null)
        {
            var service = await _context.Services
                .FirstOrDefaultAsync(s => s.Id == id);
            if (service == null) return null;
            var dto = MapToResponseDto(service);
            if (!string.IsNullOrWhiteSpace(language))
            {
                var lang = language.ToLowerInvariant();
                if (lang == "en")
                {
                    dto.Name = string.IsNullOrWhiteSpace(service.NameEn) ? dto.Name : service.NameEn!;
                    dto.Subtitle = string.IsNullOrWhiteSpace(service.SubtitleEn) ? dto.Subtitle : service.SubtitleEn!;
                    dto.Description = string.IsNullOrWhiteSpace(service.DescriptionEn) ? dto.Description : service.DescriptionEn!;
                    dto.Subtext = string.IsNullOrWhiteSpace(service.SubtextEn) ? dto.Subtext : service.SubtextEn!;
                }
                else if (lang == "ru")
                {
                    dto.Name = string.IsNullOrWhiteSpace(service.NameRu) ? dto.Name : service.NameRu!;
                    dto.Subtitle = string.IsNullOrWhiteSpace(service.SubtitleRu) ? dto.Subtitle : service.SubtitleRu!;
                    dto.Description = string.IsNullOrWhiteSpace(service.DescriptionRu) ? dto.Description : service.DescriptionRu!;
                    dto.Subtext = string.IsNullOrWhiteSpace(service.SubtextRu) ? dto.Subtext : service.SubtextRu!;
                }
            }
            return dto;
        }

        public async Task<ServiceResponseDto> CreateServiceAsync(CreateServiceDto createServiceDto)
        {
            var service = new Service
            {
                Name = createServiceDto.Name,
                NameEn = createServiceDto.NameEn,
                NameRu = createServiceDto.NameRu,
                Subtitle = createServiceDto.Subtitle,
                SubtitleEn = createServiceDto.SubtitleEn,
                SubtitleRu = createServiceDto.SubtitleRu,
                Icon = createServiceDto.Icon,
                DetailImage = createServiceDto.DetailImage,
                Description = createServiceDto.Description,
                DescriptionEn = createServiceDto.DescriptionEn,
                DescriptionRu = createServiceDto.DescriptionRu,
                Subtext = createServiceDto.Subtext,
                SubtextEn = createServiceDto.SubtextEn,
                SubtextRu = createServiceDto.SubtextRu,
                ImageUrl = createServiceDto.ImageUrl,
                CreatedAt = DateTime.UtcNow
            };

            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            return MapToResponseDto(service);
        }

        public async Task<ServiceResponseDto?> UpdateServiceAsync(int id, UpdateServiceDto updateServiceDto)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null)
                return null;

            service.Name = updateServiceDto.Name;
            service.NameEn = updateServiceDto.NameEn;
            service.NameRu = updateServiceDto.NameRu;
            service.Subtitle = updateServiceDto.Subtitle;
            service.SubtitleEn = updateServiceDto.SubtitleEn;
            service.SubtitleRu = updateServiceDto.SubtitleRu;
            service.Icon = updateServiceDto.Icon;
            service.DetailImage = updateServiceDto.DetailImage;
            service.Description = updateServiceDto.Description;
            service.DescriptionEn = updateServiceDto.DescriptionEn;
            service.DescriptionRu = updateServiceDto.DescriptionRu;
            service.Subtext = updateServiceDto.Subtext;
            service.SubtextEn = updateServiceDto.SubtextEn;
            service.SubtextRu = updateServiceDto.SubtextRu;
            service.ImageUrl = updateServiceDto.ImageUrl;
            service.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapToResponseDto(service);
        }

        public async Task<bool> DeleteServiceAsync(int id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null)
                return false;

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();

            return true;
        }

        private static ServiceResponseDto MapToResponseDto(Service service)
        {
            return new ServiceResponseDto
            {
                Id = service.Id,
                Name = service.Name,
                NameEn = service.NameEn,
                NameRu = service.NameRu,
                Subtitle = service.Subtitle,
                SubtitleEn = service.SubtitleEn,
                SubtitleRu = service.SubtitleRu,
                Icon = service.Icon,
                DetailImage = service.DetailImage,
                Description = service.Description,
                DescriptionEn = service.DescriptionEn,
                DescriptionRu = service.DescriptionRu,
                Subtext = service.Subtext,
                SubtextEn = service.SubtextEn,
                SubtextRu = service.SubtextRu,
                ImageUrl = service.ImageUrl,
                CreatedAt = service.CreatedAt,
                UpdatedAt = service.UpdatedAt
            };
        }
    }
}
