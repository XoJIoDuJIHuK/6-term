using Microsoft.AspNetCore.Http;
using System.Text;
using UWSR.Models;

namespace UWSR.Utils
{
    public static class Security
    {
        public static bool CheckIsAdmin(HttpContext context)
        {
            byte[] isAdminBytes = context.Session.Get("isAdmin");
            bool isAdmin = false;
            if (isAdminBytes != null)
            {
                string isAdminString = Encoding.UTF8.GetString(isAdminBytes);
                isAdmin = bool.Parse(isAdminString);
            }
            if (isAdmin )
                return true;
            else
                return false;
        }
        public static bool CheckIsCommentUser(HttpContext context, Comment comment)
        {
            List<int> retrievedArray = context.Session.Get<int[]>("MyArray").ToList();
            return comment.SessionId == context.Session.Id && retrievedArray.Contains(comment.Id);
        }
    }
}
