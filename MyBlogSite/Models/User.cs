using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyBlogSite.Models
{
    public class User
    {
        public User()
        {
            this.BrainstormBoards = new HashSet<BrainstormBoard>();
        }
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public Nullable<System.DateTime> CreatedOn { get; set; }
        public int LoginId { get; set; }
        [Required, EmailAddress]
        public string EmailAddress { get; set; }

        public virtual Login Login { get; set; }
        public virtual ICollection<BrainstormBoard> BrainstormBoards { get; set; }
    }
}
