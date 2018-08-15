using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Security.Principal;


namespace MyBlogSite.Models
{
    public interface IUserAppContext
    {
        IEnumerable<Claim> Claims { get; }
        bool IsAuthenticated { get; }
        string CurrentUserId { get; }
    }

    public class UserAppContext : IUserAppContext
    {
        #region Data members
        private readonly Func<IPrincipal> _principalFactory;
        private readonly AppDbContext _context;
        private string _userId;

        #endregion
        public UserAppContext(Func<IPrincipal> principalFactory,
            AppDbContext context)
        {
            _principalFactory = principalFactory;
            _context = context;
        }

        public bool IsAuthenticated
        {
            get { return _principalFactory().Identity.IsAuthenticated; }
        }

        public IEnumerable<Claim> Claims
        {
            get
            {
                var principal = _principalFactory();
                if (principal == null)
                {
                    throw new ApplicationException("Expected to get a Principle, as we are using IdSrv as our Authentication Provider.");
                }
                var claimsPrincipal = principal as ClaimsPrincipal;
                if (claimsPrincipal == null)
                {
                    throw new ApplicationException("Expected to get a ClaimsPrinciple, as we are using IdSrv as our Authentication Provider.");
                }
                return claimsPrincipal.Claims;
            }
        }

        public string CurrentUserId
        {
            get
            {
                var userIdClaim = Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    throw new Exception("The _httpContext.Session is null.");
                }

                if (Convert.ToString(userIdClaim.Value) != null)
                {
                    _userId = userIdClaim.Value;
                    return _userId;
                }
                throw new Exception("User Id can not find");
            }
        }

        public void ChangeCulture(string culture)
        {
            throw new NotImplementedException();
        }

        public void ChangeLanguage(string language)
        {
            throw new NotImplementedException();
        }

        public void SessionAbandon()
        {
            throw new NotImplementedException();
        }

    }
}
