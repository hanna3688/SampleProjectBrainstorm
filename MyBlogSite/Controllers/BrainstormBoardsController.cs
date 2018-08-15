using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
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

namespace MyBlogSite.Controllers
{
    public class BrainstormBoardsController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IOptions<JwtAuthentication> _jwtAuthentication;

        public BrainstormBoardsController(AppDbContext context, IOptions<JwtAuthentication> jwtAuthentication)
        {
            _context = context;
            _jwtAuthentication = jwtAuthentication ?? throw new ArgumentNullException(nameof(jwtAuthentication)); ;
        }

        // GET: BrainstormBoards
        public async Task<IActionResult> Index()
        {
            return View(await _context.BrainstormBoards.ToListAsync());
        }

        // GET: BrainstormBoards/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var brainstormBoard = await _context.BrainstormBoards
                .SingleOrDefaultAsync(m => m.Id == id);
            if (brainstormBoard == null)
            {
                return NotFound();
            }

            return View(brainstormBoard);
        }

        // GET: BrainstormBoards/Create
        public IActionResult Create()
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
                var boards = _context.BrainstormBoards.Where(x => x.AuthorId == currentUserId).ToList();
                return Json(new { Boards = boards });
            }

            catch
            {
                return Json(new { Success = false });
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
                await _context.SaveChangesAsync();
                return Json(new { Success = true });
            }
            catch
            {
                return Json(new { Success = false });
            }
        }

        // POST: BrainstormBoards/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,AuthorId,Title,CreatedOn,IsShared")] BrainstormBoard brainstormBoard)
        {
            if (ModelState.IsValid)
            {
                _context.Add(brainstormBoard);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(brainstormBoard);
        }

        // GET: BrainstormBoards/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var brainstormBoard = await _context.BrainstormBoards.SingleOrDefaultAsync(m => m.Id == id);
            if (brainstormBoard == null)
            {
                return NotFound();
            }
            return View(brainstormBoard);
        }

        // POST: BrainstormBoards/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,AuthorId,Title,CreatedOn,IsShared")] BrainstormBoard brainstormBoard)
        {
            if (id != brainstormBoard.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(brainstormBoard);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!BrainstormBoardExists(brainstormBoard.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(brainstormBoard);
        }

        // GET: BrainstormBoards/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var brainstormBoard = await _context.BrainstormBoards
                .SingleOrDefaultAsync(m => m.Id == id);
            if (brainstormBoard == null)
            {
                return NotFound();
            }

            return View(brainstormBoard);
        }

        // POST: BrainstormBoards/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var brainstormBoard = await _context.BrainstormBoards.SingleOrDefaultAsync(m => m.Id == id);
            _context.BrainstormBoards.Remove(brainstormBoard);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool BrainstormBoardExists(int id)
        {
            return _context.BrainstormBoards.Any(e => e.Id == id);
        }
    }
}
