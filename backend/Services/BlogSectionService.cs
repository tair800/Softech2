using Microsoft.EntityFrameworkCore;
using WebOnlyAPI.Data;
using WebOnlyAPI.DTOs;
using WebOnlyAPI.Models;

namespace WebOnlyAPI.Services
{
    public class BlogSectionService : IBlogSectionService
    {
        private readonly ApplicationDbContext _context;

        public BlogSectionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BlogSectionResponseDto>> GetAllByBlogIdAsync(int blogId)
        {
            var sections = await _context.BlogSections
                .Where(bs => bs.BlogId == blogId)
                .OrderBy(bs => bs.OrderIndex)
                .ToListAsync();

            return sections.Select(MapToResponseDto);
        }

        public async Task<BlogSectionResponseDto?> GetByIdAsync(int id)
        {
            var section = await _context.BlogSections.FindAsync(id);
            return section != null ? MapToResponseDto(section) : null;
        }

        public async Task<BlogSectionResponseDto> CreateAsync(CreateBlogSectionDto createDto)
        {
            var section = new BlogSection
            {
                BlogId = createDto.BlogId,
                Title = createDto.Title,
                TitleEn = createDto.TitleEn,
                TitleRu = createDto.TitleRu,
                Description = createDto.Description,
                DescriptionEn = createDto.DescriptionEn,
                DescriptionRu = createDto.DescriptionRu,
                OrderIndex = createDto.OrderIndex,
                CreatedAt = DateTime.UtcNow
            };

            _context.BlogSections.Add(section);
            await _context.SaveChangesAsync();
            return MapToResponseDto(section);
        }

        public async Task<BlogSectionResponseDto?> UpdateAsync(int id, UpdateBlogSectionDto updateDto)
        {
            var section = await _context.BlogSections.FindAsync(id);
            if (section == null) return null;

            section.Title = updateDto.Title;
            section.TitleEn = updateDto.TitleEn;
            section.TitleRu = updateDto.TitleRu;
            section.Description = updateDto.Description;
            section.DescriptionEn = updateDto.DescriptionEn;
            section.DescriptionRu = updateDto.DescriptionRu;
            section.OrderIndex = updateDto.OrderIndex;
            section.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return MapToResponseDto(section);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var section = await _context.BlogSections.FindAsync(id);
            if (section == null) return false;

            _context.BlogSections.Remove(section);
            await _context.SaveChangesAsync();
            return true;
        }

        private static BlogSectionResponseDto MapToResponseDto(BlogSection section)
        {
            return new BlogSectionResponseDto
            {
                Id = section.Id,
                BlogId = section.BlogId,
                Title = section.Title,
                TitleEn = section.TitleEn,
                TitleRu = section.TitleRu,
                Description = section.Description,
                DescriptionEn = section.DescriptionEn,
                DescriptionRu = section.DescriptionRu,
                OrderIndex = section.OrderIndex,
                CreatedAt = section.CreatedAt,
                UpdatedAt = section.UpdatedAt
            };
        }
    }
}
