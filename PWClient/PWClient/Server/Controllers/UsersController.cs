using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNet.Identity.Owin;
using PWClient.Models;

namespace PWClient.Server.Controllers
{
    public class UsersController : ApiController
    {
        public string[] availablecustomers()
        {
            using (var db = new ApplicationDbContext())
            {
                return db.Users.Select(x => x.UserName)
                    .ToList()
                    .ToArray();
            }
        }
    }
}
