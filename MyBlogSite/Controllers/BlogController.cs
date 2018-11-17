using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyBlogSite.Models.ViewModels;
using MyBlogSite.Models;
using Microsoft.Extensions.Options;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Principal;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace MyBlogSite.Controllers
{
    public class BlogController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IOptions<JwtAuthentication> _jwtAuthentication;
        public BlogController(AppDbContext context, IOptions<JwtAuthentication> jwtAuthentication)
        {
            _context = context;
            _jwtAuthentication = jwtAuthentication ?? throw new ArgumentNullException(nameof(jwtAuthentication));

        }
        public IActionResult Index(int? id = null)
        {
            ViewBag.BlogId = id;
            return View();
        }
        public IActionResult AddBlogEntry(int? id = null)
        {
            ViewBag.BlogId = id;
            return View();
        }
        public IActionResult ManageBlogs()
        {
            return View();
        }
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult testing()
        {
            var currentUserId = User.Identity.Name;
            return Json(new { currentUserId });
        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult GetBlogEntry(int? id)
        {
            if (id == null)
            {
                return Json(new { Success = false });
            }
            else
            {
                try
                {
                    var jsonBlog = _context.BlogEntries.Where(x => x.Id == id)
                        .Select(y => new
                        {
                            Id = y.Id,
                            Title = y.Title,
                            Content = y.Content,
                            DateCreated = y.DateCreated,
                            IsShared = y.IsShared,
                            FirstName = y.User.FirstName,
                            LastName = y.User.LastName,
                            EmailAddress = y.User.EmailAddress
                        }).FirstOrDefault();
                    return Json(new { Success = true, Blog = jsonBlog });



                }
                catch
                {
                    return Json(new { Success = false });
                }
            }
        }
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult GetUserBlogs()
        {
            if (User.Identity.Name == null)
            {
                return Json(new { Success = false });
            }
            else
            {
                try
                {
                    var blogs = _context.BlogEntries.Where(x => x.AuthorId == User.Identity.Name)
                        .Select(y => new {Id = y.Id, Title = y.Title, DateCreated = y.DateCreated,
                            AuthorName = y.User.FirstName + " " + y.User.LastName, IsShared = y.IsShared})
                        .ToList();
                    return Json(new { Success = true, Blogs = blogs });
                }
                catch
                {
                    return Json(new { Success = false });
                }
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetSharedBlogs()
        {
            try
            {
                var blogs = _context.BlogEntries.Where(x => x.IsShared == true)
                    .Select(y => new {
                        Id = y.Id,
                        Title = y.Title,
                        DateCreated = y.DateCreated,
                        AuthorName = y.User.FirstName + " " + y.User.LastName,
                        IsShared = y.IsShared
                    })
                    .ToList();
                return Json(new { Success = true, Blogs = blogs });
            }
            catch
            {
                return Json(new { Success = false });
            }
        }
        [HttpGet]
        public async Task<IActionResult> GetSharedBlog(int id)
        {
            try
            {
                var blog = _context.BlogEntries.Where(x => x.Id == id).FirstOrDefault();

                if(blog == null)
                {
                    return Json(new { Success = false, Message = "Blog not found" });
                }

                if(blog.IsShared == false)
                {
                    return Json(new { Success = false, Message = "This blog entry is private" });
                }

                return Json(new { Success = true, Blogs = blog });
            }
            catch
            {
                return Json(new { Success = false, Message = "Error while retrieving data" });
            }
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> AddOrUpdateBlog(BlogEntryAddModel blog)
        {
            if(blog.Id == null || blog.Id == 0)
            {
                try
                {
                    string currentUserId = User.Identity.Name;
                    User currentUser = _context.Users.Where(x => x.Id == currentUserId).FirstOrDefault();

                    if (currentUser == null)
                    {
                        return Json(new { Success = false });
                    }

                    BlogEntry newBlog = new BlogEntry
                    {
                        AuthorId = User.Identity.Name,
                        Title = blog.Title,
                        Content = blog.Content,
                        DateCreated = DateTime.Now,
                        IsShared = false,
                        User = currentUser
                    };
                    await _context.BlogEntries.AddAsync(newBlog);
                    await _context.SaveChangesAsync();
                    return Json(new { Success = true });
                }
                catch
                {
                    return Json(new { Success = false });
                }
            }
            else
            {
                try
                {
                    BlogEntry existingBlog = _context.BlogEntries.Where(x => x.Id == blog.Id).FirstOrDefault();
                    if (existingBlog == null)
                    {
                        return Json(new { Success = false });
                    }
                    existingBlog.Title = blog.Title;
                    existingBlog.Content = blog.Content;
                    existingBlog.DateCreated = DateTime.Now;
                    _context.BlogEntries.Update(existingBlog);
                    await _context.SaveChangesAsync();
                    return Json(new { Success = true });

                }
                catch
                {
                    return Json(new { Sucess = false });
                }
            }
        }

        [Authorize(AuthenticationSchemes =JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost]
        public async Task<IActionResult> UpdateIsShared(int id, bool isShared)
        {
            if(id == 0)
            {
                return Json(new { Success = false , Message = "Blog Not Found"});
            }
            try
            {
                var blogToUpdate = _context.BlogEntries.Where(x => x.Id == id).FirstOrDefault();
                if(blogToUpdate == null)
                {
                    return Json(new { Success = false, Message = "Blog Not Found" });
                }
                blogToUpdate.IsShared = isShared;
                _context.BlogEntries.Update(blogToUpdate);
                await _context.SaveChangesAsync();
                return Json(new { Success = true });
            }
            catch
            {
                return Json(new { Success = false, Message = "There was an error" });
            }
        } 
    }
}