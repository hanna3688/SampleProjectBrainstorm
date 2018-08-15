using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using MyBlogSite.Models;

namespace MyBlogSite.Controllers
{
    public class StickyNotesController : Controller
    {
        private readonly AppDbContext _context;

        public StickyNotesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: StickyNotes
        public async Task<IActionResult> Index()
        {
            return View(await _context.StickyNotes.ToListAsync());
        }

        // GET: StickyNotes/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var stickyNote = await _context.StickyNotes
                .SingleOrDefaultAsync(m => m.Id == id);
            if (stickyNote == null)
            {
                return NotFound();
            }

            return View(stickyNote);
        }

        // GET: StickyNotes/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: StickyNotes/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,BoardId,Content,Color,PositionTop,PositionLeft")] StickyNote stickyNote)
        {
            if (ModelState.IsValid)
            {
                _context.Add(stickyNote);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(stickyNote);
        }

        // GET: StickyNotes/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var stickyNote = await _context.StickyNotes.SingleOrDefaultAsync(m => m.Id == id);
            if (stickyNote == null)
            {
                return NotFound();
            }
            return View(stickyNote);
        }

        // POST: StickyNotes/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,BoardId,Content,Color,PositionTop,PositionLeft")] StickyNote stickyNote)
        {
            if (id != stickyNote.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(stickyNote);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!StickyNoteExists(stickyNote.Id))
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
            return View(stickyNote);
        }

        // GET: StickyNotes/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var stickyNote = await _context.StickyNotes
                .SingleOrDefaultAsync(m => m.Id == id);
            if (stickyNote == null)
            {
                return NotFound();
            }

            return View(stickyNote);
        }

        // POST: StickyNotes/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var stickyNote = await _context.StickyNotes.SingleOrDefaultAsync(m => m.Id == id);
            _context.StickyNotes.Remove(stickyNote);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool StickyNoteExists(int id)
        {
            return _context.StickyNotes.Any(e => e.Id == id);
        }
    }
}
