using PWClient.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace PWClient.Server.Controllers
{
    [AllowAnonymous]
    public class IdentityController : ApiController
    {
        public bool check()
        {
            return User.Identity.IsAuthenticated;
        }
    }
}
