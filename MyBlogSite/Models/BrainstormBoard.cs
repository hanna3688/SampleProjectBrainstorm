using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyBlogSite.Models
{
    public class BrainstormBoard
    {
        public BrainstormBoard()
        {
            this.StickyNotes = new HashSet<StickyNote>();
        }

        public int Id { get; set; }
        public string AuthorId { get; set; }
        public string Title { get; set; }
        public System.DateTime CreatedOn { get; set; }
        public Nullable<bool> IsShared { get; set; }
        public virtual User User { get; set; }
        public virtual ICollection<StickyNote> StickyNotes { get; set; }

    }
}
