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
    public class LoginsController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IOptions<JwtAuthentication> _jwtAuthentication;
        private readonly IUserAppContext _userAppContext;
        private readonly Func<IPrincipal> _principalFactory;
        private readonly HttpContextAccessor _httpContext;
        UserManager<ApplicationUser> _userManager;

        public LoginsController(AppDbContext context, IOptions<JwtAuthentication> jwtAuthentication)
        {
            _context = context;
            _jwtAuthentication = jwtAuthentication ?? throw new ArgumentNullException(nameof(jwtAuthentication));
            
        }

        // GET: Logins
        public async Task<IActionResult> Index()
        {
            return View(await _context.Logins.ToListAsync());
        }
        
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public ActionResult testing()
        {
            //var user1 = await _userManager.GetUserAsync(User);
            var currentUserId = User.Identity.Name;
            User currentUser =_context.Users.Where(x => x.Id == currentUserId).FirstOrDefault();
            return Json(new { Some = "something", UserName = currentUser.FirstName, Email = currentUser.EmailAddress });
        }

        public ActionResult IsUserAuthenticated()
        {
            //var p = _principalFactory;
            //var claims = _userAppContext.Claims;
            //var p = _principalFactory;
            //var c = HttpContext.User;
            //var identity = (ClaimsIdentity)User.Identity;
            //IEnumerable<Claim> claims = identity.Claims;
            bool isAuth = _userAppContext.IsAuthenticated;
            if (!isAuth)
            {
                return Json(new { IsAuth = isAuth });
            }
            string userId = _userAppContext.CurrentUserId;
            return Json(new { IsAuth = isAuth, CurrentUser = userId });
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
        public ActionResult Signup(SignupModel signup)
        {
            //have to check if the username/email is already signed up
            var existingLogin = _context.Logins.Where(x => x.Username == signup.EmailAddress).ToList();
            if (existingLogin.Count > 0)
            {
                return Json(new { Success = false, Error = "Already signed up with that email" });
            }
            //encrypt password
            Login newlogin = new Login
            {
                Username = signup.EmailAddress,
                PasswordHash = signup.Password
            };
            _context.Logins.Add(newlogin);

            User newuser = new User
            {
                Id = Guid.NewGuid().ToString(),
                FirstName = signup.FirstName,
                LastName = signup.LastName,
                EmailAddress = signup.EmailAddress,
                LoginId = newlogin.Id
            };
            _context.Users.Add(newuser);

            _context.SaveChanges();
            return Json(new { Success = true, NewUser = newuser.EmailAddress });
        }


        public async Task<IActionResult> Login(LoginModel login)
        {
            try
            {
                Login existingLogin = _context.Logins.Where(x => x.Username == login.Username).Select(x => x).ToList().FirstOrDefault();
                
                if (existingLogin.PasswordHash == login.Password)
                {
                    User user = _context.Users.Where(x => x.EmailAddress == login.Username).Select(x => x).ToList().FirstOrDefault();
                    var claims = new List<Claim>
                    {
                        new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                        new Claim(JwtRegisteredClaimNames.UniqueName, login.Username),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),

                    };
                    if (existingLogin.IsAdmin == true)
                    {
                        claims.Add(new Claim(ClaimTypes.Role, "Admin"));
                    }
                    //var userclaims = new ClaimsIdentity(claims);
                    //var userclaim = new Claim(ClaimTypes.NameIdentifier, user.Id);

                    //userclaims.AddClaim(userclaim);
                    //var hc = HttpContext.User.Identity;


                    var token = new JwtSecurityToken(
                        issuer: _jwtAuthentication.Value.ValidIssuer,
                        audience: _jwtAuthentication.Value.ValidAudience,
                        claims: claims,
                        expires: DateTime.UtcNow.AddDays(30),
                        notBefore: DateTime.UtcNow,
                        signingCredentials: _jwtAuthentication.Value.SigningCredentials);

                    return Json(new { Success = true, Token = new JwtSecurityTokenHandler().WriteToken(token) });
                }
                else
                {
                    return Json(new { Success = false, Error = "Wrong Password" });
                }
            }
            catch
            {
                return Json(new { Success = false, Error = "User has not Signed up." });
            }
        }

        // GET: Logins/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var login = await _context.Logins
                .SingleOrDefaultAsync(m => m.Id == id);
            if (login == null)
            {
                return NotFound();
            }

            return View(login);
        }

        // GET: Logins/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Logins/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Username,PasswordHash,IsAdmin")] Login login)
        {
            if (ModelState.IsValid)
            {
                _context.Add(login);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(login);
        }

        // GET: Logins/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var login = await _context.Logins.SingleOrDefaultAsync(m => m.Id == id);
            if (login == null)
            {
                return NotFound();
            }
            return View(login);
        }

        // POST: Logins/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Username,PasswordHash,IsAdmin")] Login login)
        {
            if (id != login.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(login);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!LoginExists(login.Id))
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
            return View(login);
        }

        // GET: Logins/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var login = await _context.Logins
                .SingleOrDefaultAsync(m => m.Id == id);
            if (login == null)
            {
                return NotFound();
            }

            return View(login);
        }

        // POST: Logins/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var login = await _context.Logins.SingleOrDefaultAsync(m => m.Id == id);
            _context.Logins.Remove(login);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool LoginExists(int id)
        {
            return _context.Logins.Any(e => e.Id == id);
        }

        public class JwtOptions
        {
            public string SecretKey { get; set; }
            public int ExpiryMinutes { get; set; }
            public string Issuer { get; set; }
        }
    }
}
