using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace MyBlogSite.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        { }

        public DbSet<User> Users { get; set; }
        public DbSet<Login> Logins { get; set; }
       
        public DbSet<BrainstormBoard> BrainstormBoards { get; set; }
        public DbSet<StickyNote> StickyNotes { get; set; }
        
    }
}
