using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace WebOnlyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        [HttpPost("product/{productId}")]
        [RequestSizeLimit(20_000_000)]
        public async Task<ActionResult<object>> UploadProductImage(int productId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("File is empty");

            var uploadsRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "products", productId.ToString());
            Directory.CreateDirectory(uploadsRoot);
            var safeFileName = Path.GetFileName(file.FileName);
            var stamped = $"{DateTime.UtcNow:yyyyMMddHHmmssfff}_{safeFileName}";
            var fullPath = Path.Combine(uploadsRoot, stamped);
            using (var stream = System.IO.File.Create(fullPath))
            {
                await file.CopyToAsync(stream);
            }
            var urlPath = $"/uploads/products/{productId}/{stamped}";
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            return Ok(new { url = baseUrl + urlPath });
        }

        [HttpPost("equipment/{equipmentId}")]
        [RequestSizeLimit(20_000_000)]
        public async Task<ActionResult<object>> UploadEquipmentImage(int equipmentId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("File is empty");

            var uploadsRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "equipment");
            Directory.CreateDirectory(uploadsRoot);
            var safeFileName = Path.GetFileName(file.FileName);
            var stamped = $"{DateTime.UtcNow:yyyyMMddHHmmssfff}_{safeFileName}";
            var fullPath = Path.Combine(uploadsRoot, stamped);
            using (var stream = System.IO.File.Create(fullPath))
            {
                await file.CopyToAsync(stream);
            }
            var urlPath = $"/uploads/equipment/{stamped}";
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            return Ok(new { url = baseUrl + urlPath });
        }

        [HttpPost("image")]
        [RequestSizeLimit(20_000_000)]
        public async Task<ActionResult<object>> UploadImage(IFormFile image)
        {
            if (image == null || image.Length == 0)
                return BadRequest("File is empty");

            var uploadsRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "employees");
            Directory.CreateDirectory(uploadsRoot);
            var safeFileName = Path.GetFileName(image.FileName);
            var stamped = $"{DateTime.UtcNow:yyyyMMddHHmmssfff}_{safeFileName}";
            var fullPath = Path.Combine(uploadsRoot, stamped);
            using (var stream = System.IO.File.Create(fullPath))
            {
                await image.CopyToAsync(stream);
            }
            var urlPath = $"/uploads/employees/{stamped}";
            return Ok(new { imageUrl = urlPath, filename = stamped });
        }

        [HttpPost("blog/{blogId}")]
        [RequestSizeLimit(20_000_000)]
        public async Task<ActionResult<object>> UploadBlogImage(int blogId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("File is empty");

            var uploadsRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "blogs", blogId.ToString());
            Directory.CreateDirectory(uploadsRoot);
            var safeFileName = Path.GetFileName(file.FileName);
            var stamped = $"{DateTime.UtcNow:yyyyMMddHHmmssfff}_{safeFileName}";
            var fullPath = Path.Combine(uploadsRoot, stamped);
            using (var stream = System.IO.File.Create(fullPath))
            {
                await file.CopyToAsync(stream);
            }
            var urlPath = $"/uploads/blogs/{blogId}/{stamped}";
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            return Ok(new { url = baseUrl + urlPath });
        }

        [HttpPost("service/icon")]
        [RequestSizeLimit(20_000_000)]
        public async Task<ActionResult<object>> UploadServiceIcon(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("File is empty");

            var uploadsRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "services", "icons");
            Directory.CreateDirectory(uploadsRoot);
            var safeFileName = Path.GetFileName(file.FileName);
            var stamped = $"{DateTime.UtcNow:yyyyMMddHHmmssfff}_{safeFileName}";
            var fullPath = Path.Combine(uploadsRoot, stamped);
            using (var stream = System.IO.File.Create(fullPath))
            {
                await file.CopyToAsync(stream);
            }
            var urlPath = $"/uploads/services/icons/{stamped}";
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            return Ok(new { url = baseUrl + urlPath });
        }
    }
}


