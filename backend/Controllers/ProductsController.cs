using AutoMapper;
using backend.Data;
using backend.DTOs;
using backend.Entities;
using backend.Extensions;
using backend.RequestHelpers;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ImageService _imageService;
        public ProductsController(ApplicationDbContext context, IMapper mapper, ImageService imageService)
        {          
            _mapper = mapper;
            _context = context;
            _imageService = imageService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery]ProductParams productParams)
        {
            var query = _context.Products
                .Sort(productParams.OrderBy)
                .Search(productParams.SearchTerm)
                .Filter(productParams.Brands, productParams.Types)
                .AsQueryable();

            var products = await PagedList<Product>.ToPageList(query, 
                productParams.PageNumber, productParams.PageSize);

            Response.AddPaginationHeader(products.MetaData);

            return products;
        }

        [HttpGet("{id}", Name = "GetProduct")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null) return NotFound();

            return product;
        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
            var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();

            return Ok(new {brands, types});
        }

        // New endpoint to get products by brand
        [HttpGet("brand/{brandName}")]
        public async Task<ActionResult<List<Product>>> GetProductsByBrand(string brandName)
        {
            // Query to filter products by brand
            var products = await _context.Products
                .Where(p => p.Brand.ToLower() == brandName.ToLower())
                .ToListAsync();

            if (!products.Any())
            {
                return NotFound(new { message = $"No products found for the brand '{brandName}'." });
            }

            return Ok(products);
        }

        //Admin Roles
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct([FromForm] CreateProductDto productDto)
        {

            if (!ModelState.IsValid)
            {
                var errors = string.Join(", ", ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage));

                Console.WriteLine($"Validation failed: {errors}");
                return BadRequest(new ProblemDetails { Title = $"Validation failed: {errors}" });
            }
            
            var product = _mapper.Map<Product>(productDto);

            if (productDto.File != null)
            {
                try
                {
                    // Upload to S3 and get the public URL
                    var imageUrl = await _imageService.AddImageAsync(productDto.File);

                    product.PictureUrl = imageUrl; // Set the S3 URL
                    product.PublicId = Path.GetFileName(new Uri(imageUrl).LocalPath); // Store the file name (key)
                }
                catch (Exception ex)
                {
                    // Log the detailed error and return a user-friendly message
                    Console.WriteLine($"Image upload failed: {ex.Message}");
                    return BadRequest(new ProblemDetails { Title = "Image upload failed. Please try again later." });
                }
            }

            _context.Products.Add(product);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return CreatedAtRoute("GetProduct", new { Id = product.Id }, product);

            return BadRequest(new ProblemDetails { Title = "Unable to create the new product" });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult<Product>> UpdateProduct([FromForm]UpdateProductDto productDto)
        {
            var product = await _context.Products.FindAsync(productDto.Id);

            if (product == null) return NotFound();

            _mapper.Map(productDto, product);

            if (productDto.File != null)
            {
                // Delete the old image from S3
                if (!string.IsNullOrEmpty(product.PublicId))
                    await _imageService.DeleteImageAsync(product.PublicId);

                // Upload the new image to S3
                var imageUrl = await _imageService.AddImageAsync(productDto.File);

                product.PictureUrl = imageUrl; // Set the new S3 URL
                product.PublicId = Path.GetFileName(new Uri(imageUrl).LocalPath); // Store the new file name (key)
            }

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(product);

            return BadRequest(new ProblemDetails { Title = "Unable to update product" });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null) return NotFound();

            // Delete the image from S3
            if (!string.IsNullOrEmpty(product.PublicId))
                await _imageService.DeleteImageAsync(product.PublicId);

            _context.Products.Remove(product);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Unable to delete product" });
        }
    }
}