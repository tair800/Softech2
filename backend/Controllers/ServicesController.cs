using Microsoft.AspNetCore.Mvc;
using WebOnlyAPI.Services;
using WebOnlyAPI.DTOs;
using Microsoft.AspNetCore.Http;

namespace WebOnlyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly IServiceService _serviceService;

        public ServicesController(IServiceService serviceService)
        {
            _serviceService = serviceService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceResponseDto>>> GetAllServices([FromQuery] string? language)
        {
            var services = await _serviceService.GetAllServicesAsync(language);
            return Ok(services);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResponseDto>> GetServiceById(int id, [FromQuery] string? language)
        {
            var service = await _serviceService.GetServiceByIdAsync(id, language);
            if (service == null)
                return NotFound();

            return Ok(service);
        }

        [HttpPost]
        public async Task<ActionResult<ServiceResponseDto>> CreateService([FromForm] CreateServiceDto createServiceDto, IFormFile? imageFile)
        {
            // Handle image upload if provided
            if (imageFile != null)
            {
                var fileName = $"{DateTime.Now:yyyyMMddHHmmssfff}_{imageFile.FileName}";
                var uploadPath = Path.Combine("wwwroot", "uploads", "services");
                
                // Ensure directory exists
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }
                
                var filePath = Path.Combine(uploadPath, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(stream);
                }
                
                createServiceDto.DetailImage = $"/uploads/services/{fileName}";
            }

            var service = await _serviceService.CreateServiceAsync(createServiceDto);
            return CreatedAtAction(nameof(GetServiceById), new { id = service.Id }, service);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ServiceResponseDto>> UpdateService(int id, [FromForm] UpdateServiceDto updateServiceDto, IFormFile? imageFile)
        {
            // Handle image upload if provided
            if (imageFile != null)
            {
                var fileName = $"{DateTime.Now:yyyyMMddHHmmssfff}_{imageFile.FileName}";
                var uploadPath = Path.Combine("wwwroot", "uploads", "services");
                
                // Ensure directory exists
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }
                
                var filePath = Path.Combine(uploadPath, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(stream);
                }
                
                updateServiceDto.DetailImage = $"/uploads/services/{fileName}";
            }

            var service = await _serviceService.UpdateServiceAsync(id, updateServiceDto);
            if (service == null)
                return NotFound();

            return Ok(service);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteService(int id)
        {
            var result = await _serviceService.DeleteServiceAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}
