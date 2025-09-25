using Microsoft.AspNetCore.Mvc;
using WebOnlyAPI.DTOs;
using WebOnlyAPI.Services;

namespace WebOnlyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EquipmentController : ControllerBase
    {
        private readonly IEquipmentService _equipmentService;
        public EquipmentController(IEquipmentService equipmentService)
        {
            _equipmentService = equipmentService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EquipmentListResponseDto>>> GetAll()
        {
            var items = await _equipmentService.GetAllAsync();
            return Ok(items);
        }

        [HttpGet("full")]
        public async Task<ActionResult<IEnumerable<EquipmentResponseDto>>> GetAllFull()
        {
            var items = await _equipmentService.GetAllFullAsync();
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EquipmentResponseDto>> GetById(int id)
        {
            var item = await _equipmentService.GetByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<EquipmentResponseDto>> Create([FromBody] CreateEquipmentDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var created = await _equipmentService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<EquipmentResponseDto>> Update(int id, [FromBody] UpdateEquipmentDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updated = await _equipmentService.UpdateAsync(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _equipmentService.DeleteAsync(id);
            if (!ok) return NotFound();
            return NoContent();
        }

        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<EquipmentCategoryDto>>> GetCategories()
        {
            var categories = await _equipmentService.GetCategoriesAsync();
            return Ok(categories);
        }

        [HttpGet("tags")]
        public async Task<ActionResult<IEnumerable<EquipmentTagDto>>> GetTags()
        {
            var tags = await _equipmentService.GetTagsAsync();
            return Ok(tags);
        }

        // Category CRUD operations
        [HttpPost("categories")]
        public async Task<ActionResult<EquipmentCategoryDto>> CreateCategory([FromBody] CreateEquipmentCategoryDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var category = await _equipmentService.CreateCategoryAsync(dto);
            return CreatedAtAction(nameof(GetCategories), new { id = category.Id }, category);
        }

        [HttpPut("categories/{id}")]
        public async Task<ActionResult<EquipmentCategoryDto>> UpdateCategory(int id, [FromBody] UpdateEquipmentCategoryDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var category = await _equipmentService.UpdateCategoryAsync(id, dto);
            if (category == null) return NotFound();
            return Ok(category);
        }

        [HttpDelete("categories/{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var success = await _equipmentService.DeleteCategoryAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }

        // Tag CRUD operations
        [HttpPost("tags")]
        public async Task<ActionResult<EquipmentTagDto>> CreateTag([FromBody] CreateEquipmentTagDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var tag = await _equipmentService.CreateTagAsync(dto);
            return CreatedAtAction(nameof(GetTags), new { id = tag.Id }, tag);
        }

        [HttpPut("tags/{id}")]
        public async Task<ActionResult<EquipmentTagDto>> UpdateTag(int id, [FromBody] UpdateEquipmentTagDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var tag = await _equipmentService.UpdateTagAsync(id, dto);
            if (tag == null) return NotFound();
            return Ok(tag);
        }

        [HttpDelete("tags/{id}")]
        public async Task<IActionResult> DeleteTag(int id)
        {
            var success = await _equipmentService.DeleteTagAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<EquipmentResponseDto>>> Search([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
                return Ok(new List<EquipmentResponseDto>());

            var results = await _equipmentService.SearchByNameAsync(q);
            return Ok(results);
        }

        [HttpPost("fix-blob-urls")]
        public async Task<IActionResult> FixBlobUrls()
        {
            try
            {
                var result = await _equipmentService.FixBlobUrlsAsync();
                return Ok(new { message = "Blob URLs fixed successfully", fixedCount = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
