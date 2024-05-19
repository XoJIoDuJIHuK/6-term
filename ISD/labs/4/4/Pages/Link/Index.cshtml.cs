using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using UWSR.Data;
using UWSR.Models;
using UWSR.Utils;

namespace UWSR.Pages.Lnk
{
    public class IndexModel : PageModel
    {
        private readonly UWSR.Data.AppDbContext _context;
        [BindProperty]
        public string LinksFindText { get; set; }
        [BindProperty]
        public Link CreateLink { get; set; } = default!;
        [BindProperty]
        public Link EditLink { get; set; } = default!;

        public IndexModel(AppDbContext context)
        {
            _context = context;
        }

        public IList<Link> Link { get;set; } = default!;
        public IList<Link> FindLinks { get; set; } = default!;

        public IList<Link> FindMatchingLinks(IList<Link> links, string[] searchTags)
        {
            List<Link> matchingLinks = new List<Link>();

            foreach (var link in links)
            {
                string[] tagsLink = link.Description.Split(',').Select(tag => tag.Trim()).ToArray();
                // Проверить, есть ли хотя бы один тег из поисковых тегов в массиве тегов текущей ссылки
                if (tagsLink.Any(tag => searchTags.Contains(tag)))
                {
                    matchingLinks.Add(link);
                }
            }

            return matchingLinks;
        }

        public async Task<IActionResult> CheckSecretWord(string secretWord)
        {
            if (_context.Links != null)
            {
                Link = await _context.Links.ToListAsync();
                FindLinks = Link;
            }

            if (secretWord == "Lenovo Legion 5 15ARH05H")
            {
                HttpContext.Session.Set("isAdmin", Encoding.UTF8.GetBytes("true"));
                ViewData["Message"] = "Введено секретное слово";
            }

            return Page();
        }
        public async Task<IActionResult> GetFilterLinks()
        {
            Link = await _context.Links.ToListAsync();
            string[] tagsArray;
            if (LinksFindText != "" && LinksFindText != null)
            {
                tagsArray = LinksFindText.Split(',').Select(tag => tag.Trim()).ToArray();
                FindLinks = FindMatchingLinks(Link, tagsArray);
            }
            else
            {
                FindLinks = Link;
            }
            

            return Page();
        }
        public async Task<IActionResult> OnPostLogout()
        {



            if (_context.Links != null)
            {
                Link = await _context.Links.ToListAsync();
                FindLinks = Link;
            }
            ViewData["Message"] = "Вы вошли в режим клиента";
            int[] myArray = {-1};
            HttpContext.Session.Set("MyArray", myArray);
            HttpContext.Session.Set("NewMessage", Encoding.UTF8.GetBytes("true"));
            HttpContext.Session.Set("isAdmin", Encoding.UTF8.GetBytes("false"));
            return Page();
        }
        public async Task<IActionResult> CreateLinkForm()
        {
            CreateLink.Plus = 0;
            CreateLink.Minus = 0;
            if (_context.Links == null || CreateLink == null)
            {
                Link = await _context.Links.ToListAsync();
                FindLinks = Link;
                return Page();
            }

            _context.Links.Add(CreateLink);
            await _context.SaveChangesAsync();
            Link = await _context.Links.ToListAsync();
            FindLinks = Link;
            return Page();
        }
        public async Task<IActionResult> DeleteLink(int linkId)
        {
            var link = await _context.Links.FindAsync(linkId);
            if (link != null)
            {
                _context.Links.Remove(link);
                await _context.SaveChangesAsync();
            }
            Link = await _context.Links.ToListAsync();
            FindLinks = Link;
            return Page();
        }
        public async Task<IActionResult> EditLinkForm(int linkId)
        {
            var link = await _context.Links.FindAsync(linkId);

            if (link != null)
            {
                link.Url = EditLink.Url;
                link.Description = EditLink.Description;
                _context.Attach(link).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            Link = await _context.Links.ToListAsync();
            FindLinks = Link;
            return Page();
        }
        public async Task<IActionResult> OnPostAsync(string handler, string secretWord, int linkId)
        {
            switch (handler)
            {
                case "CheckSecretWord":
                    return await CheckSecretWord(secretWord);
                case "GetFilterLinks":
                    return await GetFilterLinks();
                case "CreateLink":
                    return await CreateLinkForm();
                case "DeleteLink":
                    return await DeleteLink(linkId);
                case "EditLink":
                    return await EditLinkForm(linkId);
                default:
                    return RedirectToPage("./Index");
            }
        }


        public async Task<IActionResult> OnGetAsync()
        {
            int[] retrievedArray = HttpContext.Session.Get<int[]>("MyArray");
            if(retrievedArray == null)
            {
                int[] myArray = { };
                HttpContext.Session.Set("MyArray", myArray);
            }
            if (_context.Links != null)
            {
                Link = await _context.Links.ToListAsync();
                FindLinks = Link;
            }

            return Page();
        }
    }
}
