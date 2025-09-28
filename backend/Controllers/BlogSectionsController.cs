using Microsoft.AspNetCore.Mvc;
using WebOnlyAPI.DTOs;
using WebOnlyAPI.Services;

namespace WebOnlyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogSectionsController : ControllerBase
    {
        private readonly IBlogSectionService _blogSectionService;

        public BlogSectionsController(IBlogSectionService blogSectionService)
        {
            _blogSectionService = blogSectionService;
        }

        [HttpGet("blog/{blogId}")]
        public async Task<ActionResult<IEnumerable<BlogSectionResponseDto>>> GetSectionsByBlogId(int blogId)
        {
            var sections = await _blogSectionService.GetAllByBlogIdAsync(blogId);
            return Ok(sections);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BlogSectionResponseDto>> GetSection(int id)
        {
            var section = await _blogSectionService.GetByIdAsync(id);
            if (section == null)
                return NotFound();

            return Ok(section);
        }

        [HttpPost]
        public async Task<ActionResult<BlogSectionResponseDto>> CreateSection([FromBody] CreateBlogSectionDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var section = await _blogSectionService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetSection), new { id = section.Id }, section);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<BlogSectionResponseDto>> UpdateSection(int id, [FromBody] UpdateBlogSectionDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var section = await _blogSectionService.UpdateAsync(id, updateDto);
            if (section == null)
                return NotFound();

            return Ok(section);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteSection(int id)
        {
            var result = await _blogSectionService.DeleteAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}
