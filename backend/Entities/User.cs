using Microsoft.AspNetCore.Identity;

namespace backend.Entities
{
    public class User : IdentityUser<int>
    {
        public UserAddress Address { get; set; } 
        public string FirstName { get; set; } //Add this
        public string LastName { get; set; } // Add this
    }
}