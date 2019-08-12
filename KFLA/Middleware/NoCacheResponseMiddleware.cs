using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KFLA.Middleware
{
    public class NoCacheResponseMiddleware
    {
        private readonly RequestDelegate _next;

        public NoCacheResponseMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            if (string.IsNullOrEmpty(context.Response.Headers["Expires"]))
            {
                context.Response.Headers[HeaderNames.CacheControl] = "no-cache, no-store, must-revalidate";
                context.Response.Headers[HeaderNames.Expires] = "0";
            }

            await _next(context);
        }
    }
}
