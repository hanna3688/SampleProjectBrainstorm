using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MyBlogSite.Models;

namespace MyBlogSite.Models
{
    public class BlogEntry
    {
        public int Id { get; set; }
        public string AuthorId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime DateCreated { get; set; }
        public bool IsShared { get; set; }
        public virtual User User { get; set; }
    }
}
