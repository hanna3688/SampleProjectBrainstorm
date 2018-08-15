using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyBlogSite.Models.ViewModels
{
    public class Position
    {
        public int Top { get; set; }
        public int Left { get; set; }

    }
    public class AddStickyNote {
        public int? Id { get; set; }
        public string Content { get; set; }
        public string Color { get; set; }
        public Position Positions { get; set; }
    }
    public class AddBrainstorm
    {
        public string Title { get; set; }
        public Nullable<bool> IsShared { get; set; }
        public List<AddStickyNote> StickyNotes { get; set; }
    }

    public class UpdateBrainstorm
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public Nullable<bool> IsShared { get; set; }
        public List<AddStickyNote> StickyNotes { get; set; }
    }
}
