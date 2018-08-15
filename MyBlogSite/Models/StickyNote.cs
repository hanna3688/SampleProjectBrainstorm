using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyBlogSite.Models
{
    public class StickyNote
    {
        public int Id { get; set; }
        public int BoardId { get; set; }
        public string Content { get; set; }
        public string Color { get; set; }
        public int PositionTop { get; set; }
        public int PositionLeft { get; set; }
        public virtual BrainstormBoard BrainstormBoard { get; set; }
    }
}
