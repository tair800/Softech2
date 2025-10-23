using Microsoft.EntityFrameworkCore;
using WebOnlyAPI.Data;
using WebOnlyAPI.DTOs;
using WebOnlyAPI.Models;

namespace WebOnlyAPI.Services
{
    public class MetaDescriptionService : IMetaDescriptionService
    {
        private readonly ApplicationDbContext _context;

        public MetaDescriptionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<MetaDescriptionListDto>> GetAllAsync()
        {
            var metaDescriptions = await _context.MetaDescriptions
                .Where(m => m.IsActive)
                .OrderBy(m => m.PageKey)
                .ThenBy(m => m.Language)
                .ToListAsync();

            var result = new List<MetaDescriptionListDto>();
            
            // Define all available pages
            var availablePages = new List<string> { "home", "about", "services", "equipment", "products", "blog", "contact", "factory" };
            var availableLanguages = new List<string> { "az", "en", "ru" };

            foreach (var pageKey in availablePages)
            {
                var pageName = GetPageDisplayName(pageKey);
                var pageMetaDescriptions = metaDescriptions.Where(m => m.PageKey == pageKey).ToList();
                
                var languages = new List<MetaDescriptionLanguageDto>();
                
                foreach (var language in availableLanguages)
                {
                    var existingMeta = pageMetaDescriptions.FirstOrDefault(m => m.Language == language);
                    
                    languages.Add(new MetaDescriptionLanguageDto
                    {
                        Id = existingMeta?.Id ?? 0,
                        Language = language,
                        LanguageName = GetLanguageDisplayName(language),
                        Title = existingMeta?.Title ?? "",
                        Description = existingMeta?.Description ?? "",
                        IsActive = existingMeta?.IsActive ?? false
                    });
                }

                result.Add(new MetaDescriptionListDto
                {
                    PageKey = pageKey,
                    PageName = pageName,
                    Languages = languages
                });
            }

            return result;
        }

        public async Task<MetaDescriptionResponseDto?> GetByPageAndLanguageAsync(string pageKey, string language)
        {
            var metaDescription = await _context.MetaDescriptions
                .FirstOrDefaultAsync(m => m.PageKey == pageKey && m.Language == language && m.IsActive);

            if (metaDescription == null)
                return null;

            return MapToResponseDto(metaDescription);
        }

        public async Task<MetaDescriptionResponseDto?> GetByIdAsync(int id)
        {
            var metaDescription = await _context.MetaDescriptions
                .FirstOrDefaultAsync(m => m.Id == id);

            if (metaDescription == null)
                return null;

            return MapToResponseDto(metaDescription);
        }

        public async Task<MetaDescriptionResponseDto> CreateAsync(CreateMetaDescriptionDto dto)
        {
            var metaDescription = new MetaDescription
            {
                PageKey = dto.PageKey,
                Language = dto.Language,
                Title = dto.Title,
                Description = dto.Description,
                OpenGraphTitle = dto.OpenGraphTitle,
                OpenGraphDescription = dto.OpenGraphDescription,
                TwitterTitle = dto.TwitterTitle,
                TwitterDescription = dto.TwitterDescription,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _context.MetaDescriptions.Add(metaDescription);
            await _context.SaveChangesAsync();

            return MapToResponseDto(metaDescription);
        }

        public async Task<MetaDescriptionResponseDto?> UpdateAsync(int id, UpdateMetaDescriptionDto dto)
        {
            var metaDescription = await _context.MetaDescriptions
                .FirstOrDefaultAsync(m => m.Id == id);

            if (metaDescription == null)
                return null;

            if (dto.Title != null)
                metaDescription.Title = dto.Title;
            
            if (dto.Description != null)
                metaDescription.Description = dto.Description;
            
            if (dto.OpenGraphTitle != null)
                metaDescription.OpenGraphTitle = dto.OpenGraphTitle;
            
            if (dto.OpenGraphDescription != null)
                metaDescription.OpenGraphDescription = dto.OpenGraphDescription;
            
            if (dto.TwitterTitle != null)
                metaDescription.TwitterTitle = dto.TwitterTitle;
            
            if (dto.TwitterDescription != null)
                metaDescription.TwitterDescription = dto.TwitterDescription;
            
            if (dto.IsActive.HasValue)
                metaDescription.IsActive = dto.IsActive.Value;

            metaDescription.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapToResponseDto(metaDescription);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var metaDescription = await _context.MetaDescriptions
                .FirstOrDefaultAsync(m => m.Id == id);

            if (metaDescription == null)
                return false;

            _context.MetaDescriptions.Remove(metaDescription);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<MetaDescriptionResponseDto>> GetByPageAsync(string pageKey)
        {
            var metaDescriptions = await _context.MetaDescriptions
                .Where(m => m.PageKey == pageKey && m.IsActive)
                .OrderBy(m => m.Language)
                .ToListAsync();

            return metaDescriptions.Select(MapToResponseDto).ToList();
        }

        public async Task<bool> BulkUpdateAsync(List<MetaDescriptionResponseDto> metaDescriptions)
        {
            try
            {
                foreach (var metaDto in metaDescriptions)
                {
                    var metaDescription = await _context.MetaDescriptions
                        .FirstOrDefaultAsync(m => m.Id == metaDto.Id);

                    if (metaDescription != null)
                    {
                        metaDescription.Title = metaDto.Title;
                        metaDescription.Description = metaDto.Description;
                        metaDescription.OpenGraphTitle = metaDto.OpenGraphTitle;
                        metaDescription.OpenGraphDescription = metaDto.OpenGraphDescription;
                        metaDescription.TwitterTitle = metaDto.TwitterTitle;
                        metaDescription.TwitterDescription = metaDto.TwitterDescription;
                        metaDescription.IsActive = metaDto.IsActive;
                        metaDescription.UpdatedAt = DateTime.UtcNow;
                    }
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        private MetaDescriptionResponseDto MapToResponseDto(MetaDescription metaDescription)
        {
            return new MetaDescriptionResponseDto
            {
                Id = metaDescription.Id,
                PageKey = metaDescription.PageKey,
                Language = metaDescription.Language,
                Title = metaDescription.Title,
                Description = metaDescription.Description,
                OpenGraphTitle = metaDescription.OpenGraphTitle,
                OpenGraphDescription = metaDescription.OpenGraphDescription,
                TwitterTitle = metaDescription.TwitterTitle,
                TwitterDescription = metaDescription.TwitterDescription,
                IsActive = metaDescription.IsActive,
                CreatedAt = metaDescription.CreatedAt,
                UpdatedAt = metaDescription.UpdatedAt
            };
        }

        private string GetPageDisplayName(string pageKey)
        {
            return pageKey switch
            {
                "home" => "Home Page",
                "about" => "About Page",
                "services" => "Services Page",
                "equipment" => "Equipment Page",
                "products" => "Products Page",
                "blog" => "Blog Page",
                "contact" => "Contact Page",
                "factory" => "Factory Page",
                _ => pageKey
            };
        }

        private string GetLanguageDisplayName(string language)
        {
            return language switch
            {
                "az" => "Azerbaijani",
                "en" => "English",
                "ru" => "Russian",
                _ => language
            };
        }
    }
}
