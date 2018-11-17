using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyBlogSite.Models;
using MyBlogSite.Services;
using MyBlogSite.Models.ViewModels;
using Microsoft.Extensions.Options;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Principal;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MyBlogSite.Controllers
{

    public class BrainstormController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IOptions<JwtAuthentication> _jwtAuthentication;
        public BrainstormController(AppDbContext context, IOptions<JwtAuthentication> jwtAuthentication)
        {
            _context = context;
            _jwtAuthentication = jwtAuthentication ?? throw new ArgumentNullException(nameof(jwtAuthentication));

        }
        
        public IActionResult Index(int? id=null)
        {
            ViewBag.BoardId = id;
            return View();
        }
        
        public IActionResult BoardsTable()
        {
            return View();
        }


        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetBoards()
        {
            try
            {
                string currentUserId = User.Identity.Name;
                var boards = _context.BrainstormBoards.Where(x => x.AuthorId == currentUserId);
                var jsonBoards = boards.Select(x => new {
                    Id = x.Id,
                    Title = x.Title,
                    DateCreated = x.CreatedOn

                }).ToList();
                return Json(new { Boards = jsonBoards });
            }

            catch
            {
                return Json(new { Success = false });
            }


        }
        public async Task<IActionResult> GetBoard(int? id)
        {
            if (id == null)
            {
                return Json(new { Success = false });
            }
            else
            {
                try
                {
                    var jsonboard = _context.BrainstormBoards.Where(x => x.Id == id)
                        .Select(y => new
                        {
                            Id = y.Id,
                            Title = y.Title,
                            DateCreated = y.CreatedOn,
                            StickyNotes = _context.StickyNotes.Where(z => z.BoardId == y.Id).ToList()
                        }).FirstOrDefault();
                    return Json(new { Success = true, Board = jsonboard });

                    

                }
                catch
                {
                    return Json(new { Success = false });
                }
            }
        }


        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> CreateBoard(AddBrainstorm brainstorm)
        {
            try
            {
                BrainstormBoard newboard = new BrainstormBoard
                {
                    AuthorId = User.Identity.Name,
                    Title = brainstorm.Title,
                    CreatedOn = DateTime.Now
                };
                await _context.BrainstormBoards.AddAsync(newboard);
                await _context.SaveChangesAsync();

                if (brainstorm.StickyNotes != null)
                {
                    //create new notes
                    foreach (AddStickyNote stickyNote in brainstorm.StickyNotes)
                    {
                        StickyNote newnote = new StickyNote
                        {
                            BoardId = newboard.Id,
                            Content = stickyNote.Content,
                            Color = stickyNote.Color,
                            PositionLeft = stickyNote.Positions.Left,
                            PositionTop = stickyNote.Positions.Top
                        };
                        _context.StickyNotes.Add(newnote);
                    }
                }
                
                _context.SaveChanges();
                return Json(new { Success = true });
            }
            catch
            {
                return Json(new { Success = false });
            }
        }
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> DeleteBoard(int id)
        {
            try
            {
                BrainstormBoard existingBoard = _context.BrainstormBoards.Find(id);
                if( existingBoard == null)
                {
                    return Json(new { Success = false });
                }

                //Delete sticky notes for the board
                var notes = _context.StickyNotes.Where(x => x.BoardId == id);
                foreach (StickyNote note in notes)
                {
                    _context.StickyNotes.Remove(note);
                }
                //await _context.SaveChangesAsync();
                _context.SaveChanges();

                //Delete the board
                _context.BrainstormBoards.Remove(existingBoard);
                _context.SaveChanges();

            }
            catch
            {
                return Json(new { Success = false });
            }
            return Json(new { Success = true });
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> UpdateBoard(UpdateBrainstorm brainstorm)
        {
            try
            {
                BrainstormBoard existingBoard = _context.BrainstormBoards.Find(brainstorm.Id);
                existingBoard.Title = brainstorm.Title;
                var notes = _context.StickyNotes.Where(x => x.BoardId == brainstorm.Id);
                
                foreach(StickyNote note in notes)
                {
                    _context.StickyNotes.Remove(note);
                }

               
                if(brainstorm.StickyNotes != null)
                {
                    //create new notes
                    foreach (AddStickyNote stickyNote in brainstorm.StickyNotes)
                    {
                        StickyNote newnote = new StickyNote
                        {
                            BoardId = brainstorm.Id,
                            Content = stickyNote.Content,
                            Color = stickyNote.Color,
                            PositionLeft = stickyNote.Positions.Left,
                            PositionTop = stickyNote.Positions.Top
                        };
                        _context.StickyNotes.Add(newnote);
                        await _context.SaveChangesAsync();
                    }
                }
                
                _context.SaveChanges();

            }
            catch
            {
                return Json(new { Success = false });
            }
            return Json(new { });
        }
    }
}