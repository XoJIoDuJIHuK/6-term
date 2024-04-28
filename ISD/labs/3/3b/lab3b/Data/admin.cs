using lab3b.Models;

namespace lab3b.Data
{
    public static class Admin
    {
        public static List<User> users = new()
    {
        new User() { Name = "tochilo.oleg@gmail.com", Password = "1234_xD", Roles = new[] { Roles.Administrator } },
    };
    }
}
