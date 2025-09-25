using Microsoft.EntityFrameworkCore;
using WebOnlyAPI.Data;
using WebOnlyAPI.DTOs;
using WebOnlyAPI.Models;

namespace WebOnlyAPI.Services
{
    public class ReferenceService : IReferenceService
    {
        private readonly ApplicationDbContext _context;

        public ReferenceService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ReferenceResponseDto>> GetAllAsync()
        {
            var references = await _context.References
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return references.Select(r => new ReferenceResponseDto
            {
                Id = r.Id,
                Name = r.Name,
                ImageUrl = r.ImageUrl,
                Alt = r.Alt
            });
        }

        public async Task<ReferenceResponseDto?> GetByIdAsync(int id)
        {
            var reference = await _context.References.FindAsync(id);
            
            if (reference == null)
                return null;

            return new ReferenceResponseDto
            {
                Id = reference.Id,
                Name = reference.Name,
                ImageUrl = reference.ImageUrl,
                Alt = reference.Alt
            };
        }

        public async Task<ReferenceResponseDto> CreateAsync(CreateReferenceDto dto)
        {
            var reference = new Reference
            {
                Name = dto.Name,
                ImageUrl = dto.ImageUrl,
                Alt = dto.Alt,
                CreatedAt = DateTime.UtcNow
            };

            _context.References.Add(reference);
            await _context.SaveChangesAsync();

            return new ReferenceResponseDto
            {
                Id = reference.Id,
                Name = reference.Name,
                ImageUrl = reference.ImageUrl,
                Alt = reference.Alt
            };
        }

        public async Task<ReferenceResponseDto?> UpdateAsync(int id, UpdateReferenceDto dto)
        {
            var reference = await _context.References.FindAsync(id);
            
            if (reference == null)
                return null;

            reference.Name = dto.Name;
            reference.ImageUrl = dto.ImageUrl;
            reference.Alt = dto.Alt;
            reference.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new ReferenceResponseDto
            {
                Id = reference.Id,
                Name = reference.Name,
                ImageUrl = reference.ImageUrl,
                Alt = reference.Alt
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var reference = await _context.References.FindAsync(id);
            
            if (reference == null)
                return false;

            _context.References.Remove(reference);
            await _context.SaveChangesAsync();
            
            return true;
        }
    }
}
