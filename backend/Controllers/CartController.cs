using backend.Data;
using backend.DTOs;
using backend.Entities;
using backend.Extensions;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    public class CartController : BaseApiController
    {
        private readonly ApplicationDbContext _context;
        public CartController(ApplicationDbContext context)
        {
            _context = context;            
        }

        [HttpGet(Name = "GetCart")]
        public async Task<ActionResult<CartDto>> GetCart()
        {
            var cart = await RetrieveCart(GetBuyerId());

            if (cart == null) return NotFound();

            return cart.MapCartToDto();
        }

        [HttpPost]
        public async Task<ActionResult<CartDto>> AddItemToCart(int productId, int quantity)
        {
            var cart = await RetrieveCart(GetBuyerId());

            if (cart == null) cart = CreateCart();

            var product = await _context.Products.FindAsync(productId);

            if (product == null) return BadRequest(new ProblemDetails{Title = "Product Not Found"});
            
            cart.AddItem(product, quantity);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return CreatedAtRoute("GetCart", cart.MapCartToDto());

            return BadRequest(new ProblemDetails{Title = "Problem saving item to cart"});
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveCartItem(int productId, int quantity)
        {
            var cart = await RetrieveCart(GetBuyerId());

            if (cart == null) return NotFound();

            cart.RemoveItem(productId, quantity);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest(new ProblemDetails{Title = "Problem removing item from the cart"});
        }

        private async Task<Cart> RetrieveCart(string buyerId)
        {
            if (string.IsNullOrEmpty(buyerId))
            {
                Response.Cookies.Delete("buyerId");
                return null;
            }

            return await _context.Carts
                .Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
        }

        private string GetBuyerId()
        {
            return User.Identity?.Name ?? Request.Cookies["buyerId"];
        }

        private Cart CreateCart()
        {
            var buyerId = User.Identity?.Name;
            if (string.IsNullOrEmpty(buyerId))
            {
                buyerId = Guid.NewGuid().ToString();
                var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
                Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            }
            
            var cart = new Cart{BuyerId = buyerId};
            _context.Carts.Add(cart);
            return cart;
        }
    }
}