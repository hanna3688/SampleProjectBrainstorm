using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyBlogSite.Models
{
    public class Login
    {
        public Login()
        {
            this.Users = new HashSet<User>();
        }
        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public Nullable<bool> IsAdmin { get; set; }
        public virtual ICollection<User> Users { get; set; }
    }

}
