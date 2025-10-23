using Microsoft.AspNetCore.Mvc;
using WebOnlyAPI.DTOs;
using WebOnlyAPI.Services;

namespace WebOnlyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MetaDescriptionsController : ControllerBase
    {
        private readonly IMetaDescriptionService _metaDescriptionService;

        public MetaDescriptionsController(IMetaDescriptionService metaDescriptionService)
        {
            _metaDescriptionService = metaDescriptionService;
        }

        [HttpGet]
        public async Task<ActionResult<List<MetaDescriptionListDto>>> GetAll()
        {
            try
            {
                var metaDescriptions = await _metaDescriptionService.GetAllAsync();
                return Ok(metaDescriptions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving meta descriptions", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MetaDescriptionResponseDto>> GetById(int id)
        {
            try
            {
                var metaDescription = await _metaDescriptionService.GetByIdAsync(id);
                if (metaDescription == null)
                    return NotFound(new { message = "Meta description not found" });

                return Ok(metaDescription);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving meta description", error = ex.Message });
            }
        }

        [HttpGet("page/{pageKey}")]
        public async Task<ActionResult<List<MetaDescriptionResponseDto>>> GetByPage(string pageKey)
        {
            try
            {
                var metaDescriptions = await _metaDescriptionService.GetByPageAsync(pageKey);
                return Ok(metaDescriptions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving meta descriptions for page", error = ex.Message });
            }
        }

        [HttpGet("page/{pageKey}/language/{language}")]
        public async Task<ActionResult<MetaDescriptionResponseDto>> GetByPageAndLanguage(string pageKey, string language)
        {
            try
            {
                var metaDescription = await _metaDescriptionService.GetByPageAndLanguageAsync(pageKey, language);
                if (metaDescription == null)
                    return NotFound(new { message = "Meta description not found" });

                return Ok(metaDescription);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving meta description", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<MetaDescriptionResponseDto>> Create([FromBody] CreateMetaDescriptionDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var metaDescription = await _metaDescriptionService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = metaDescription.Id }, metaDescription);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating meta description", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<MetaDescriptionResponseDto>> Update(int id, [FromBody] UpdateMetaDescriptionDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var metaDescription = await _metaDescriptionService.UpdateAsync(id, dto);
                if (metaDescription == null)
                    return NotFound(new { message = "Meta description not found" });

                return Ok(metaDescription);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating meta description", error = ex.Message });
            }
        }

        [HttpPut("bulk")]
        public async Task<ActionResult> BulkUpdate([FromBody] List<MetaDescriptionResponseDto> metaDescriptions)
        {
            try
            {
                var result = await _metaDescriptionService.BulkUpdateAsync(metaDescriptions);
                if (!result)
                    return BadRequest(new { message = "Error updating meta descriptions" });

                return Ok(new { message = "Meta descriptions updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating meta descriptions", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var result = await _metaDescriptionService.DeleteAsync(id);
                if (!result)
                    return NotFound(new { message = "Meta description not found" });

                return Ok(new { message = "Meta description deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting meta description", error = ex.Message });
            }
        }
    }
}
