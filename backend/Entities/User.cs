using Microsoft.AspNetCore.Identity;

namespace backend.Entities
{
    public class User : IdentityUser<int>
    {
        public UserAddress Address { get; set; }        
    }
}