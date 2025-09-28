using Microsoft.EntityFrameworkCore;
using WebOnlyAPI.Data;
using WebOnlyAPI.DTOs;
using WebOnlyAPI.Models;

namespace WebOnlyAPI.Services
{
    public class BlogService : IBlogService
    {
        private readonly ApplicationDbContext _context;

        public BlogService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BlogResponseDto>> GetAllAsync()
        {
            // SQLite cannot order by DateTimeOffset in SQL translation. Use Id for stable ordering.
            var blogs = await _context.Blogs
                .OrderBy(b => b.Id)
                .ToListAsync();
            return blogs.Select(MapToResponseDto);
        }

        public async Task<BlogResponseDto?> GetByIdAsync(int id)
        {
            var blog = await _context.Blogs.FindAsync(id);
            return blog != null ? MapToResponseDto(blog) : null;
        }

        public async Task<BlogResponseDto> CreateAsync(CreateBlogDto createDto)
        {
            var blog = new Blog
            {
                Title1 = createDto.Title1,
                Desc1 = createDto.Desc1,
                Title1En = createDto.Title1En,
                Title1Ru = createDto.Title1Ru,
                Desc1En = createDto.Desc1En,
                Desc1Ru = createDto.Desc1Ru,
                Title2 = createDto.Title2,
                Desc2 = createDto.Desc2,
                Title2En = createDto.Title2En,
                Title2Ru = createDto.Title2Ru,
                Desc2En = createDto.Desc2En,
                Desc2Ru = createDto.Desc2Ru,
                Features = createDto.Features,
                MainImageUrl = createDto.MainImageUrl,
                DetailImg1Url = createDto.DetailImg1Url,
                DetailImg2Url = createDto.DetailImg2Url,
                DetailImg3Url = createDto.DetailImg3Url,
                DetailImg4Url = createDto.DetailImg4Url,
                PublishedAt = createDto.PublishedAt,
                CreatedAt = DateTimeOffset.UtcNow,
                UpdatedAt = DateTimeOffset.UtcNow
            };

            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();
            return MapToResponseDto(blog);
        }

        public async Task<BlogResponseDto?> UpdateAsync(int id, UpdateBlogDto updateDto)
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null) return null;

            blog.Title1 = updateDto.Title1;
            blog.Desc1 = updateDto.Desc1;
            blog.Title1En = updateDto.Title1En;
            blog.Title1Ru = updateDto.Title1Ru;
            blog.Desc1En = updateDto.Desc1En;
            blog.Desc1Ru = updateDto.Desc1Ru;
            blog.Title2 = updateDto.Title2;
            blog.Desc2 = updateDto.Desc2;
            blog.Title2En = updateDto.Title2En;
            blog.Title2Ru = updateDto.Title2Ru;
            blog.Desc2En = updateDto.Desc2En;
            blog.Desc2Ru = updateDto.Desc2Ru;
            blog.Features = updateDto.Features;
            blog.MainImageUrl = updateDto.MainImageUrl;
            blog.DetailImg1Url = updateDto.DetailImg1Url;
            blog.DetailImg2Url = updateDto.DetailImg2Url;
            blog.DetailImg3Url = updateDto.DetailImg3Url;
            blog.DetailImg4Url = updateDto.DetailImg4Url;
            blog.PublishedAt = updateDto.PublishedAt;
            blog.UpdatedAt = DateTimeOffset.UtcNow;

            await _context.SaveChangesAsync();

            return MapToResponseDto(blog);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null) return false;
            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();
            return true;
        }

        private static BlogResponseDto MapToResponseDto(Blog blog)
        {
            return new BlogResponseDto
            {
                Id = blog.Id,
                Title1 = blog.Title1,
                Desc1 = blog.Desc1,
                Title1En = blog.Title1En,
                Title1Ru = blog.Title1Ru,
                Desc1En = blog.Desc1En,
                Desc1Ru = blog.Desc1Ru,
                Title2 = blog.Title2,
                Desc2 = blog.Desc2,
                Title2En = blog.Title2En,
                Title2Ru = blog.Title2Ru,
                Desc2En = blog.Desc2En,
                Desc2Ru = blog.Desc2Ru,
                Features = blog.Features,
                MainImageUrl = blog.MainImageUrl,
                DetailImg1Url = blog.DetailImg1Url,
                DetailImg2Url = blog.DetailImg2Url,
                DetailImg3Url = blog.DetailImg3Url,
                DetailImg4Url = blog.DetailImg4Url,
                PublishedAt = blog.PublishedAt,
                CreatedAt = blog.CreatedAt,
                UpdatedAt = blog.UpdatedAt
            };
        }
    }
}


