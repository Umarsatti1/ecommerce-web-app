namespace backend.DTOs
{
    public class RegisterDto : LoginDto
    {
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        
    }
}