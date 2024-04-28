using lab3b.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Linq;
using System.Diagnostics;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace lab3b.Controllers
{
    public class AdminController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        public AdminController(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager, SignInManager<IdentityUser> signInManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _signInManager = signInManager;
        }
        [Authorize(Roles = "Administrator")]
        [HttpGet]
        [HttpPost]
        public async Task<IActionResult> CreateUser(string? name, string? password) 
        {
            var userModel = new UserViewModel();
            userModel.userList = _userManager.Users.ToList();
            if (HttpContext.Request.Method == HttpMethods.Get)
            {
                return View(userModel);
            }
            if (name == null || password == null)
            {
                return RedirectToAction(nameof(Error), new { message = "Одно из полей не заполнено" });
            }
            if (_userManager.FindByNameAsync(name).Result != null)
            {
                return RedirectToAction(nameof(Error), new { message = "Данный пользователь уже существует" });
            }
            var newUser = new IdentityUser() { Email = name, UserName = name };
            await _userManager.CreateAsync(newUser, password);
            userModel.isActionSuccess = true;
            userModel.userList = _userManager.Users.ToList();
            return View(userModel);
        }
        [Authorize(Roles = "Administrator")]
        [HttpGet]
        [HttpPost]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            var userModel = new UserViewModel
            {
                userList = _userManager.Users.ToList()
            };
            var user = await _userManager.FindByIdAsync(userId);
            if (HttpContext.Request.Method == HttpMethods.Get)
            {
                return View(userModel);
            }
            if (await _userManager.FindByIdAsync(userId) == null)
            {
                return RedirectToAction(nameof(Error), new { message = "Пользователь не найден" });
            }
            var userRoles = await _userManager.GetRolesAsync(user);
            if (userRoles.Contains("Administrator"))
            {
                return RedirectToAction(nameof(Error), new { message = "Нельзя удалить администратора" });
            }
            await _userManager.DeleteAsync(await _userManager.FindByIdAsync(userId));
            userModel.isActionSuccess = true;
            userModel.userList = _userManager.Users.ToList();
            return View(userModel);
        }
        [Authorize(Roles = "Administrator")]
        [HttpGet]
        [HttpPost]
        public async Task<IActionResult> Assign(string? roleName, string? name)
        {
            var userRolesModel = new UserRolesViewModel
            {
                userList = _userManager.Users.ToList(),
                rolesList = _roleManager.Roles.ToList(),
                userRoles = new List<UserRole>()
            };
            foreach (var user in userRolesModel.userList)
            {
                userRolesModel.userRoles.Add(new UserRole() { user = user, rolesList = _userManager.GetRolesAsync(user).Result.ToList() });
            }
            if (HttpContext.Request.Method == HttpMethods.Get)
            {
                return View(userRolesModel);
            }

            if (roleName == null || name == null)
            {
                return RedirectToAction(nameof(Error), new { message = "Один из параметров не выбран" });
            }
            if (! await _roleManager.RoleExistsAsync(roleName))
            {
                return RedirectToAction(nameof(Error), new { message = "Роль не существует" });
            }
            await _userManager.AddToRoleAsync(await _userManager.FindByNameAsync(name), roleName);
            userRolesModel.userRoles = new List<UserRole>();
            foreach (var user in userRolesModel.userList)
            {
                userRolesModel.userRoles.Add(new UserRole() { user = user, rolesList = _userManager.GetRolesAsync(user).Result.ToList() });
            }
            userRolesModel.userList = _userManager.Users.ToList();
            userRolesModel.rolesList = _roleManager.Roles.ToList();
            userRolesModel.isActionSuccess = true;
            return View(userRolesModel);
        }
        [Authorize(Roles = "Administrator")]
        [HttpGet]
        [HttpPost]
        public async Task<IActionResult> CreateRole(string? roleName)
        {
            var roleModel = new RoleViewModel
            {
                roleList = _roleManager.Roles.ToList()
            };
            if (HttpContext.Request.Method == HttpMethods.Get)
            {
                return View(roleModel);
            }
            if (roleName == null)
            {
                return RedirectToAction(nameof(Error), new { message = "Роль не выбрана" });
            }
            if (await _roleManager.RoleExistsAsync(roleName))
            {
                return RedirectToAction(nameof(Error), new { message = "Роль существует" });
            }
            await _roleManager.CreateAsync(new IdentityRole(roleName));
            roleModel.isActionSuccess = true;
            roleModel.roleList = _roleManager.Roles.ToList();
            return View(roleModel);
        }
        [Authorize(Roles = "Administrator")]
        [HttpGet]
        [HttpPost]
        public async Task<IActionResult> DeleteRole(string roleId)
        {
            var roleModel = new RoleViewModel
            {
                roleList = _roleManager.Roles.ToList()
            };
            if (HttpContext.Request.Method == HttpMethods.Get)
            {
                return View(roleModel);
            }
            var role = await _roleManager.FindByIdAsync(roleId);
            if (role == null)
            {
                return RedirectToAction(nameof(Error), new { message = "Роль не найдена" });
            }

            if (role.Name == "Administrator")
            {
                return RedirectToAction(nameof(Error), new { message = "Роль администратора нельзя удалить" });
            }
            var usersInRole = await _userManager.GetUsersInRoleAsync(role.Name);
            foreach (var user in usersInRole)
            {
                await _userManager.RemoveFromRoleAsync(user, role.Name);
            }
            await _roleManager.DeleteAsync(role);
            roleModel.isActionSuccess = true;
            roleModel.roleList = _roleManager.Roles.ToList();
            return View(roleModel);
        }
        [Authorize(Roles = "Administrator")]
        [HttpGet]
        [HttpPost]
        public async Task<IActionResult> RemoveRoleUser(string? roleName, string? name)
        {
            var userRolesModel = new UserRolesViewModel
            {
                userList = _userManager.Users.ToList(),
                rolesList = _roleManager.Roles.ToList(),
                userRoles = new List<UserRole>()
            };
            foreach (var user in userRolesModel.userList)
            {
                userRolesModel.userRoles.Add(new UserRole() { user = user, rolesList = _userManager.GetRolesAsync(user).Result.ToList() });
            }
            if (HttpContext.Request.Method == HttpMethods.Get)
            {
                return View(userRolesModel);
            }
            if (roleName == null || name == null)
            {
                return RedirectToAction(nameof(Error), new { message = "Один из параметров не выбран" });
            }
            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                return RedirectToAction(nameof(Error), new { message = "Роль не существует" });
            }
            var result = await _userManager.RemoveFromRoleAsync(await _userManager.FindByNameAsync(name), roleName);
            if (!result.Succeeded)
            {
                return RedirectToAction(nameof(Error), new { message = "У него нет такой роли" });
            }
            userRolesModel.userRoles = new List<UserRole>();
            foreach (var user in userRolesModel.userList)
            {
                userRolesModel.userRoles.Add(new UserRole() { user = user, rolesList = _userManager.GetRolesAsync(user).Result.ToList() });
            }
            userRolesModel.userList = _userManager.Users.ToList();
            userRolesModel.rolesList = _roleManager.Roles.ToList();
            userRolesModel.isActionSuccess = true;
            return View(userRolesModel);
        }
        [HttpGet]
        [HttpPost]
        public async Task<IActionResult> Register(string username, string password)
        {
            if (HttpContext.Request.Method == HttpMethods.Get)
            {
                return View();
            }
            var user = new IdentityUser { UserName = username };
            var result = await _userManager.CreateAsync(user, password);
            if (result.Succeeded)
            {
                await _signInManager.SignInAsync(user, isPersistent: false);
                return RedirectToAction("Index", "Home");
            }
            else
            {
                return RedirectToAction(nameof(Error), new { 
                    message = string.Join(" ", result.Errors.Select(e => e.Description)) 
                });
            }
        }
        [HttpPost]
        [HttpGet]
        public async Task<IActionResult> SignIn(string username, string password, bool rememberMe)
        {
            if (HttpContext.Request.Method == HttpMethods.Get)
            {
                return View();
            }
            var result = await _signInManager.PasswordSignInAsync(username, password, rememberMe, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                return RedirectToAction("Index","Home");
            }
            else
            {
                return RedirectToAction(nameof(Error), new { message = "Неудачный вход" });
            }
        }
        [HttpGet]
        [HttpPost]
        public async new Task<IActionResult> SignOut()
        {
            if (HttpContext.Request.Method == HttpMethods.Get)
            {
                return View();
            }
            await _signInManager.SignOutAsync();
            return RedirectToAction("Index", "Home");
        }
        [Authorize(Roles = "Administrator")]
        [HttpGet]
        [HttpPost]
        public async Task<IActionResult> ChangePassword(string currentPassword, string newPassword)
        {
            if (HttpContext.Request.Method == HttpMethods.Get)
            {
                return View();
            }
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return RedirectToAction(nameof(Error), new { message = "Пользователь не найден" });
            }

            var changePasswordResult = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
            if (!changePasswordResult.Succeeded)
            {
                return RedirectToAction(nameof(Error), new { message = "Ошибка при смене пароля" });
            }

            await _signInManager.RefreshSignInAsync(user);
            return RedirectToAction("Index", "Home");
        }
        [Authorize(Roles = "Administrator")]
        [HttpGet]
        [HttpPost]
        public async Task<IActionResult> DeleteAccount()
        {
            if (HttpContext.Request.Method == HttpMethods.Get)
            {
                return View();
            }
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return RedirectToAction(nameof(Error), new { message = "Пользователь не найден" });
            }
            var userRoles = await _userManager.GetRolesAsync(user);
            if (userRoles.Contains("Administrator"))
            {
                return RedirectToAction(nameof(Error), new { message = "Нельзя удалить администратора" });
            }
            await _signInManager.SignOutAsync();
            await _userManager.DeleteAsync(user);
             
            return RedirectToAction("Index", "Home");
        }
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error(string message)
        {
            var model = new ErrorViewModel
            {
                Message = message
            };
            return View("Error", model);
        }

        [Authorize(Roles = "Administrator")]
        public IActionResult Index()
        {
            var userRolesModel = new UserRolesViewModel
            {
                userList = _userManager.Users.ToList(),
                rolesList = _roleManager.Roles.ToList(),
                userRoles = new List<UserRole>()
            };
            foreach (var user in userRolesModel.userList)
            {
                userRolesModel.userRoles.Add(new UserRole() { user = user, rolesList = _userManager.GetRolesAsync(user).Result.ToList() });
            }
            return View(userRolesModel);
        }
    }
}
