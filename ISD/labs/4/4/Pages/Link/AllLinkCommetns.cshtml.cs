using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using UWSR.Data;
using UWSR.Models;
using UWSR.Utils;

namespace UWSR.Pages.Lnk
{
    public class AllLinkCommentsModel : PageModel
    {
        private readonly UWSR.Data.AppDbContext _context;
        [BindProperty]
        public string NewCommentText { get; set; }
        [BindProperty]
        public Comment Comment { get; set; }
        public async Task<IActionResult> CreateComment(int id)
        {
            HttpContext.Session.Set("CreateComment", Encoding.UTF8.GetBytes("true"));


            var link = _context.Links.Where(x => x.Id == id).FirstOrDefault();
            if (_context.Comments == null || Comment == null || link == null)
            {
                return RedirectToPage("../Link/Index");
            }
            Comment.SessionId = this.HttpContext.Session.Id;
            Comment.Link = link;
            _context.Comments.Add(Comment);
            await _context.SaveChangesAsync();

            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Text == Comment.Text);
            List<int> retrievedArray = HttpContext.Session.Get<int[]>("MyArray").ToList();
            retrievedArray.Add(comment.Id);
            HttpContext.Session.Set("MyArray", retrievedArray.ToArray());

            return RedirectToPage("../Link/AllLinkCommetns", new { id = link.Id });
        }
        public async Task<IActionResult> DeleteComment(int id, int commentId)
        {
            var comment = await _context.Comments.FindAsync(commentId);
            var link = _context.Links.Where(x => x.Id == id).FirstOrDefault();
            if (comment != null && link != null)
            {
                Comment = comment;
                _context.Comments.Remove(Comment);
                await _context.SaveChangesAsync();

                return RedirectToPage("../Link/AllLinkCommetns", new { id = link.Id });
            }

            return RedirectToPage("./Index");
        }
        public async Task<IActionResult> EditComment(int id, int commentId)
        {
            var comment = await _context.Comments.FindAsync(commentId);

            var link = _context.Links.Where(x => x.Id == id).FirstOrDefault();

            if (comment != null && link != null)
            {
                comment.Text = NewCommentText;
                _context.Attach(comment).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return RedirectToPage("../Link/AllLinkCommetns", new { id = link.Id });
            }            
            return RedirectToPage("./Index");
        }

        public AllLinkCommentsModel(UWSR.Data.AppDbContext context)
        {
            _context = context;
        }

      public Link Link { get; set; } = default!; 

        public async Task<IActionResult> OnGetAsync(int? id)
        {
            if (id == null || _context.Links == null)
            {
                return NotFound();
            }

            var link = await _context.Links.Include(x => x.Comments).FirstOrDefaultAsync(m => m.Id == id);
            if (link == null)
            {
                return NotFound();
            }
            else 
            {
                Link = link;
            }
            return Page();
        }
        public async Task<IActionResult> OnPostAsync(string handler, int id, int commentId)
        {
            switch (handler)
            {
                case "OnPlus":
                    return await OnPlus(id);
                case "OnMinus":
                    return await OnMinus(id);
                case "CreateComment":
                    return await CreateComment(id);
                case "DeleteComment":
                    return await DeleteComment(id, commentId);
                case "EditComment":
                    return await EditComment(id, commentId);
                default:
                    return RedirectToPage("./Index");
            }
        }

        public async Task<IActionResult> OnPlus(int id)
        {
            var linkDb = await _context.Links.Where(x => x.Id == id).FirstOrDefaultAsync();
            if (linkDb == null)
            {
                return Page();
            }
            linkDb.Plus++;
            await _context.SaveChangesAsync();
            return RedirectToPage("../Link/AllLinkCommetns", new { id = linkDb.Id });
        }

        public async Task<IActionResult> OnMinus(int id)
        {
            var linkDb = await _context.Links.Where(x => x.Id == id).FirstOrDefaultAsync();
            if (linkDb == null)
            {
                return Page();
            }
            linkDb.Minus++;
            await _context.SaveChangesAsync();
            return RedirectToPage("../Link/AllLinkCommetns", new { id = linkDb.Id });
        }
    }
}
