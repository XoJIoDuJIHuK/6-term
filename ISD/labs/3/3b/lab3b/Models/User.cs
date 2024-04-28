using Microsoft.AspNetCore.Identity;

namespace lab3b.Models;

public class User 
{
    public string Name { get; set; }
    public string Password { get; set; }
    public string[] Roles { get; set; }
}