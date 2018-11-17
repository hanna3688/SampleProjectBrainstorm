using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MyBlogSite.Models;

namespace MyBlogSite.Models.ViewModels
{
    public class BlogEntryViewModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime DateCreated { get; set; }
        public bool IsShared { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailAddress { get; set; }
    }
    public class BlogEntryAddModel
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
    }
}
