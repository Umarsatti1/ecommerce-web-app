namespace backend.DTOs
{
    public class UserProfileUpdateDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; }
        public string NewPassword { get; set; }
    }
}