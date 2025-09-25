using Microsoft.AspNetCore.Mvc;
using WebOnlyAPI.DTOs;
using WebOnlyAPI.Services;
using Microsoft.AspNetCore.Http;
using WebOnlyAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace WebOnlyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReferencesController : ControllerBase
    {
        private readonly IReferenceService _referenceService;
        private readonly ApplicationDbContext _context;

        public ReferencesController(IReferenceService referenceService, ApplicationDbContext context)
        {
            _referenceService = referenceService;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReferenceResponseDto>>> GetAll()
        {
            var items = await _referenceService.GetAllAsync();
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReferenceResponseDto>> GetById(int id)
        {
            var item = await _referenceService.GetByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<ReferenceResponseDto>> Create([FromForm] CreateReferenceDto dto, IFormFile? imageFile)
        {
            if (imageFile != null && imageFile.Length > 0)
            {
                // Generate unique filename
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                var filePath = Path.Combine("wwwroot", "uploads", "references", fileName);
                
                // Ensure directory exists
                var directory = Path.GetDirectoryName(filePath);
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory!);
                }
                
                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(stream);
                }
                
                // Update DTO with file path
                dto.ImageUrl = "/uploads/references/" + fileName;
            }
            
            var created = await _referenceService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ReferenceResponseDto>> Update(int id, [FromForm] UpdateReferenceDto dto, IFormFile? imageFile)
        {
            if (imageFile != null && imageFile.Length > 0)
            {
                // Generate unique filename
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                var filePath = Path.Combine("wwwroot", "uploads", "references", fileName);
                
                // Ensure directory exists
                var directory = Path.GetDirectoryName(filePath);
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory!);
                }
                
                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(stream);
                }
                
                // Update DTO with file path
                dto.ImageUrl = "/uploads/references/" + fileName;
            }
            
            var updated = await _referenceService.UpdateAsync(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _referenceService.DeleteAsync(id);
            if (!ok) return NotFound();
            return NoContent();
        }

        // Auto-recreate References table with logo data
        [HttpPost("recreate")]
        public async Task<IActionResult> RecreateTable()
        {
            try
            {
                // Drop existing table if it exists
                var dropTableSql = "IF OBJECT_ID('References', 'U') IS NOT NULL DROP TABLE References;";
                await _context.Database.ExecuteSqlRawAsync(dropTableSql);

                // Create new table
                var createTableSql = @"
                    CREATE TABLE References (
                        Id INT IDENTITY(1,1) PRIMARY KEY,
                        Name NVARCHAR(100) NOT NULL,
                        ImageUrl NVARCHAR(500),
                        Alt NVARCHAR(100),
                        CreatedAt DATETIME2 DEFAULT GETDATE(),
                        UpdatedAt DATETIME2
                    );";
                await _context.Database.ExecuteSqlRawAsync(createTableSql);

                // Insert logo data
                var insertSql = @"
                    INSERT INTO References (Name, ImageUrl, Alt, CreatedAt) VALUES
                    ('Logo 1', '/assets/logo1.png', 'Company Logo 1', GETDATE()),
                    ('Logo 2', '/assets/logo2.png', 'Company Logo 2', GETDATE()),
                    ('Logo 3', '/assets/logo3.png', 'Company Logo 3', GETDATE()),
                    ('Logo 4', '/assets/logo4.png', 'Company Logo 4', GETDATE()),
                    ('Logo 5', '/assets/logo5.png', 'Company Logo 5', GETDATE()),
                    ('Logo 6', '/assets/logo6.png', 'Company Logo 6', GETDATE()),
                    ('Logo 7', '/assets/logo7.png', 'Company Logo 7', GETDATE()),
                    ('Logo 8', '/assets/logo8.png', 'Company Logo 8', GETDATE()),
                    ('Logo 9', '/assets/logo9.png', 'Company Logo 9', GETDATE()),
                    ('Logo 10', '/assets/logo10.png', 'Company Logo 10', GETDATE()),
                    ('Logo 11', '/assets/logo11.png', 'Company Logo 11', GETDATE()),
                    ('Logo 12', '/assets/logo12.png', 'Company Logo 12', GETDATE()),
                    ('Logo 13', '/assets/logo13.png', 'Company Logo 13', GETDATE()),
                    ('Logo 14', '/assets/logo14.png', 'Company Logo 14', GETDATE()),
                    ('Logo 15', '/assets/logo15.png', 'Company Logo 15', GETDATE()),
                    ('Logo 16', '/assets/logo16.png', 'Company Logo 16', GETDATE()),
                    ('Logo 17', '/assets/logo17.png', 'Company Logo 17', GETDATE()),
                    ('Logo 18', '/assets/logo18.png', 'Company Logo 18', GETDATE()),
                    ('Logo 19', '/assets/logo19.png', 'Company Logo 19', GETDATE()),
                    ('Logo 20', '/assets/logo20.png', 'Company Logo 20', GETDATE()),
                    ('Logo 21', '/assets/logo21.png', 'Company Logo 21', GETDATE()),
                    ('Logo 22', '/assets/logo22.png', 'Company Logo 22', GETDATE()),
                    ('Logo 23', '/assets/logo23.png', 'Company Logo 23', GETDATE()),
                    ('Logo 24', '/assets/logo24.png', 'Company Logo 24', GETDATE()),
                    ('Logo 25', '/assets/logo25.png', 'Company Logo 25', GETDATE());";
                await _context.Database.ExecuteSqlRawAsync(insertSql);

                return Ok(new { message = "References table recreated successfully with 25 logos!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
