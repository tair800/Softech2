using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebOnlyAPI.Data;
using WebOnlyAPI.Models;

namespace WebOnlyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SlidersController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public SlidersController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Slider>>> GetAll()
        {
            var items = await _db.Sliders.AsNoTracking()
                .OrderBy(s => s.OrderIndex)
                .ToListAsync();
            return Ok(items);
        }

        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<Slider>>> GetActive()
        {
            var items = await _db.Sliders.AsNoTracking()
                .Where(s => s.IsActive)
                .OrderBy(s => s.OrderIndex)
                .ToListAsync();
            return Ok(items);
        }

        [HttpPost]
        public async Task<ActionResult<Slider>> Create([FromBody] Slider slider)
        {
            if (slider == null) return BadRequest();
            slider.CreatedAt = slider.CreatedAt == default ? DateTime.UtcNow : slider.CreatedAt;
            await _db.Sliders.AddAsync(slider);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAll), new { id = slider.Id }, slider);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] Slider slider)
        {
            var existing = await _db.Sliders.FindAsync(id);
            if (existing == null) return NotFound();
            existing.Name = slider.Name;
            existing.NameEn = slider.NameEn;
            existing.NameRu = slider.NameRu;
            existing.ImageUrl = slider.ImageUrl;
            existing.ProductId = slider.ProductId;
            existing.OrderIndex = slider.OrderIndex;
            existing.IsActive = slider.IsActive;
            existing.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id, CancellationToken ct)
        {
            var existing = await _db.Sliders.FindAsync(id);
            if (existing == null) return NotFound();
            _db.Sliders.Remove(existing);

            var attempts = 0;
            while (true)
            {
                try
                {
                    await _db.SaveChangesAsync(ct);
                    return NoContent();
                }
                catch (DbUpdateException ex) when (ex.InnerException is Microsoft.Data.Sqlite.SqliteException se && (se.SqliteErrorCode == 5 || se.SqliteErrorCode == 6))
                {
                    attempts++;
                    if (attempts >= 5) throw;
                    await Task.Delay(150, ct);
                }
            }
        }
    }
}


