using backend.Entities;
using backend.Entities.OrderCollection;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class ApplicationDbContext : IdentityDbContext<User, Role, int>
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {    
        }
        
        public DbSet<Product> Products { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<Order> Orders { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>()
                .HasOne(a => a.Address)
                .WithOne()
                .HasForeignKey<UserAddress>(a => a.Id)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Role>()
                .HasData(
                    new Role{Id = 1, Name = "Member", NormalizedName = "MEMBER"},
                    new Role{Id = 2, Name = "Admin", NormalizedName = "ADMIN"}
                );
        }
    }
}