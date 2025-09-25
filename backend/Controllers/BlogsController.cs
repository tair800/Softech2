using Microsoft.AspNetCore.Mvc;
using WebOnlyAPI.DTOs;
using WebOnlyAPI.Services;

namespace WebOnlyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogsController : ControllerBase
    {
        private readonly IBlogService _blogService;

        public BlogsController(IBlogService blogService)
        {
            _blogService = blogService;
        }

        // GET: api/blogs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BlogResponseDto>>> GetBlogs()
        {
            var blogs = await _blogService.GetAllAsync();
            return Ok(blogs);
        }

        // GET: api/blogs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BlogResponseDto>> GetBlog(int id)
        {
            var blog = await _blogService.GetByIdAsync(id);
            if (blog == null) return NotFound();
            return Ok(blog);
        }

        // POST: api/blogs
        [HttpPost]
        public async Task<ActionResult<BlogResponseDto>> CreateBlog([FromBody] CreateBlogDto createDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var blog = await _blogService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetBlog), new { id = blog.Id }, blog);
        }

        // PUT: api/blogs/5
        [HttpPut("{id}")]
        public async Task<ActionResult<BlogResponseDto>> UpdateBlog(int id, [FromBody] UpdateBlogDto updateDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var blog = await _blogService.UpdateAsync(id, updateDto);
            if (blog == null) return NotFound();
            return Ok(blog);
        }

        // DELETE: api/blogs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBlog(int id)
        {
            var deleted = await _blogService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}


