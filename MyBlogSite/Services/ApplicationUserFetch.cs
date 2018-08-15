using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace MyBlogSite.Services
{
    public interface IUserResolverService
    {
        string GetUser();
    }

    public class UserResolverService : IUserResolverService
    {
        private readonly IHttpContextAccessor accessor;
        public UserResolverService(IHttpContextAccessor accessor)
        {
            this.accessor = accessor;
        }

        public string GetUser()
        {
            var username = accessor?.HttpContext?.User?.Identity?.Name;
            return username ?? "unknown";
        }
    }
}
