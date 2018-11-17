using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyBlogSite.Models
{
    public class UserCategory
    {
        public int Id { get; set; }
        public int? ParentId { get; set; }
        public string Title { get; set; }
        public string UserId { get; set; }

        public virtual User User { get; set; }
        public virtual UserCategory Parent { get; set; }
    }
}
