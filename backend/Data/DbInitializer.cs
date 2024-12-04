using backend.Entities;
using Microsoft.AspNetCore.Identity;

namespace backend.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(ApplicationDbContext context, UserManager<User> userManager)
        {
            if (!userManager.Users.Any())
            {
                var user = new User
                {
                    UserName = "bob",
                    Email = "bob@test.com"
                };

                await userManager.CreateAsync(user, "Pa$$w0rd");
                await userManager.AddToRoleAsync(user, "Member");

                var admin = new User
                {
                    UserName = "admin",
                    Email = "admin@test.com"
                };

                await userManager.CreateAsync(admin, "Pa$$w0rd");
                await userManager.AddToRolesAsync(admin, new[] { "Member", "Admin" });
            }

            if (context.Products.Any()) return;

            var products = new List<Product>
            {
                // Apple Products
                new Product
                {
                    Name = "iPhone 15 Pro Max",
                    Description = "iPhone 15 Pro Max. 128 GB Storage. 6.7-inch OLED display.",
                    Price = 120000,
                    PictureUrl = "/images/products/iphone15.png",
                    Brand = "Apple",
                    Type = "Mobile",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "iPhone 14 Pro Max",
                    Description = "iPhone 14 Pro Max. 128 GB Storage. 6+ Inch OLED display.",
                    Price = 100000,
                    PictureUrl = "/images/products/iphone14.png",
                    Brand = "Apple",
                    Type = "Mobile",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Apple Watch Series 9",
                    Description = "Apple Watch with advanced health tracking features.",
                    Price = 45000,
                    PictureUrl = "/images/products/applewatch9.png",
                    Brand = "Apple",
                    Type = "Smartwatch",
                    QuantityInStock = 50
                },
                new Product
                {
                    Name = "MacBook Air M2",
                    Description = "MacBook Air with M2 chip and 13-inch Retina display.",
                    Price = 95000,
                    PictureUrl = "/images/products/macbookairm2.png",
                    Brand = "Apple",
                    Type = "Laptop",
                    QuantityInStock = 30
                },
                new Product
                {
                    Name = "iPad Pro 12.9",
                    Description = "iPad Pro with 12.9-inch Liquid Retina XDR display.",
                    Price = 110000,
                    PictureUrl = "/images/products/ipadpro129.png",
                    Brand = "Apple",
                    Type = "Tablet",
                    QuantityInStock = 70
                },
                new Product
                {
                    Name = "AirPods Pro (2nd Gen)",
                    Description = "Wireless noise-canceling earbuds with MagSafe charging case.",
                    Price = 25000,
                    PictureUrl = "/images/products/airpodspro2.png",
                    Brand = "Apple",
                    Type = "Earbuds",
                    QuantityInStock = 200
                },

                // Sony Products
                new Product
                {
                    Name = "Sony WH-1000XM5",
                    Description = "Sony Noise Cancelling Overhead Headphones.",
                    Price = 30000,
                    PictureUrl = "/images/products/sony-wh1000xm5.png",
                    Brand = "Sony",
                    Type = "Headphones",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Sony Alpha A7 IV",
                    Description = "Full-frame mirrorless camera for professionals.",
                    Price = 240000,
                    PictureUrl = "/images/products/sonya7iv.png",
                    Brand = "Sony",
                    Type = "Camera",
                    QuantityInStock = 25
                },
                new Product
                {
                    Name = "Sony Bravia XR OLED TV",
                    Description = "55-inch OLED TV with Dolby Vision and Google TV.",
                    Price = 170000,
                    PictureUrl = "/images/products/sonybravia.png",
                    Brand = "Sony",
                    Type = "Television",
                    QuantityInStock = 40
                },
                new Product
                {
                    Name = "Sony PlayStation 5",
                    Description = "Next-gen gaming console with ultra-fast SSD.",
                    Price = 50000,
                    PictureUrl = "/images/products/ps5.png",
                    Brand = "Sony",
                    Type = "Gaming Console",
                    QuantityInStock = 75
                },
                new Product
                {
                    Name = "Sony SRS-XG500",
                    Description = "Portable wireless speaker with water-resistant design.",
                    Price = 30000,
                    PictureUrl = "/images/products/sony-xg500.png",
                    Brand = "Sony",
                    Type = "Speaker",
                    QuantityInStock = 120
                },

                // Nike Products
                new Product
                {
                    Name = "Nike Air Max 270",
                    Description = "Stylish and comfortable sneakers for daily use.",
                    Price = 15000,
                    PictureUrl = "/images/products/nikeairmax270.png",
                    Brand = "Nike",
                    Type = "Shoes",
                    QuantityInStock = 150
                },
                new Product
                {
                    Name = "Nike Dri-FIT T-Shirt",
                    Description = "Lightweight and breathable sportswear.",
                    Price = 3000,
                    PictureUrl = "/images/products/nike-drifit.png",
                    Brand = "Nike",
                    Type = "Clothing",
                    QuantityInStock = 300
                },
                new Product
                {
                    Name = "Nike Training Gloves",
                    Description = "Durable gloves designed for weight training.",
                    Price = 1500,
                    PictureUrl = "/images/products/nike-gloves.png",
                    Brand = "Nike",
                    Type = "Accessories",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Nike Sports Bottle",
                    Description = "Reusable water bottle with ergonomic grip.",
                    Price = 1000,
                    PictureUrl = "/images/products/nikebottle.png",
                    Brand = "Nike",
                    Type = "Accessories",
                    QuantityInStock = 400
                },
                new Product
                {
                    Name = "Nike Yoga Mat",
                    Description = "Non-slip mat for yoga and fitness workouts.",
                    Price = 2500,
                    PictureUrl = "/images/products/nikeyogamat.png",
                    Brand = "Nike",
                    Type = "Fitness Gear",
                    QuantityInStock = 200
                },

                // Adidas Products
                new Product
                {
                    Name = "Adidas Ultraboost 22",
                    Description = "High-performance running shoes with responsive cushioning.",
                    Price = 14000,
                    PictureUrl = "/images/products/adidas-ultraboost.png",
                    Brand = "Adidas",
                    Type = "Shoes",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Adidas Climacool Polo",
                    Description = "Moisture-wicking polo for hot weather.",
                    Price = 3000,
                    PictureUrl = "/images/products/adidas-polo.png",
                    Brand = "Adidas",
                    Type = "Clothing",
                    QuantityInStock = 150
                },
                new Product
                {
                    Name = "Adidas Duffel Bag",
                    Description = "Durable and spacious sports bag for travel.",
                    Price = 3500,
                    PictureUrl = "/images/products/adidas-duffel.png",
                    Brand = "Adidas",
                    Type = "Accessories",
                    QuantityInStock = 80
                },
                new Product
                {
                    Name = "Adidas Sweatpants",
                    Description = "Comfortable training sweatpants for sports and fitness.",
                    Price = 3500,
                    PictureUrl = "/images/products/adidas-sweatpants.png",
                    Brand = "Adidas",
                    Type = "Accessories",
                    QuantityInStock = 500
                },
                new Product
                {
                    Name = "Adidas Training Shorts",
                    Description = "Flexible shorts for sports and fitness.",
                    Price = 3000,
                    PictureUrl = "/images/products/adidas-shorts.png",
                    Brand = "Adidas",
                    Type = "Clothing",
                    QuantityInStock = 200
                },

                // Microsoft Products
                new Product
                {
                    Name = "Microsoft Surface Pro 9",
                    Description = "2-in-1 laptop with Intel Evo platform.",
                    Price = 110000,
                    PictureUrl = "/images/products/surfacepro9.png",
                    Brand = "Microsoft",
                    Type = "Laptop",
                    QuantityInStock = 50
                },
                new Product
                {
                    Name = "Xbox Series X",
                    Description = "The fastest and most powerful Xbox ever.",
                    Price = 52000,
                    PictureUrl = "/images/products/xboxseriesx.png",
                    Brand = "Microsoft",
                    Type = "Gaming Console",
                    QuantityInStock = 75
                },
                new Product
                {
                    Name = "Microsoft Ergo Keyboard",
                    Description = "Designed for long hours of comfortable typing.",
                    Price = 5000,
                    PictureUrl = "/images/products/microsoft-keyboard.png",
                    Brand = "Microsoft",
                    Type = "Accessories",
                    QuantityInStock = 150
                },
            };

            foreach (var product in products)
            {
                context.Products.Add(product);
            }

            context.SaveChanges();
        }
    }
}