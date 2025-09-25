using Microsoft.AspNetCore.Mvc;
using WebOnlyAPI.DTOs;
using WebOnlyAPI.Services;

namespace WebOnlyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        // GET: api/products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductResponseDto>>> GetProducts([FromQuery] string? language)
        {
            var products = await _productService.GetAllProductsAsync(language);
            return Ok(products);
        }

        // GET: api/products/search?q={searchTerm}
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<ProductResponseDto>>> Search([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
                return Ok(new List<ProductResponseDto>());

            var results = await _productService.SearchByNameAsync(q);
            return Ok(results);
        }

        // GET: api/products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductResponseDto>> GetProduct(int id, [FromQuery] string? language)
        {
            var product = await _productService.GetProductByIdAsync(id, language);
            
            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        // POST: api/products
        [HttpPost]
        public async Task<ActionResult<ProductResponseDto>> CreateProduct(CreateProductDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = await _productService.CreateProductAsync(createDto);
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        // PUT: api/products/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, UpdateProductDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = await _productService.UpdateProductAsync(id, updateDto);
            
            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        // DELETE: api/products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var result = await _productService.DeleteProductAsync(id);
            
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        // Nested images endpoints
        // GET: api/products/{productId}/images
        [HttpGet("{productId}/images")]
        public async Task<ActionResult<IEnumerable<ProductImageDto>>> GetImages(int productId)
        {
            var images = await _productService.GetImagesAsync(productId);
            return Ok(images);
        }

        // POST: api/products/{productId}/images
        [HttpPost("{productId}/images")]
        public async Task<ActionResult<ProductImageDto>> AddImage(int productId, ProductImageDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _productService.AddImageAsync(productId, dto);
            return CreatedAtAction(nameof(GetImages), new { productId }, created);
        }

        // DELETE: api/products/{productId}/images/{imageId}
        [HttpDelete("{productId}/images/{imageId}")]
        public async Task<IActionResult> DeleteImage(int productId, int imageId)
        {
            var ok = await _productService.DeleteImageAsync(productId, imageId);
            if (!ok) return NotFound();
            return NoContent();
        }

        // PUT: api/products/{productId}/images/{imageId}
        [HttpPut("{productId}/images/{imageId}")]
        public async Task<ActionResult<ProductImageDto>> UpdateImage(int productId, int imageId, ProductImageDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updated = await _productService.UpdateImageAsync(productId, imageId, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        // PUT: api/products/{productId}/images/{imageId}/set-main
        [HttpPut("{productId}/images/{imageId}/set-main")]
        public async Task<IActionResult> SetMainImage(int productId, int imageId)
        {
            var ok = await _productService.SetMainImageAsync(productId, imageId);
            if (!ok) return NotFound();
            return NoContent();
        }
    }
}
