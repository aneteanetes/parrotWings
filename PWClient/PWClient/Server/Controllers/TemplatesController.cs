using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PWClient.Server.Controllers
{
    public class TemplatesController : Controller
    {
        [HttpPost]
        public ActionResult Get(String name)
        {
            return View("~/Server/Views/Templates/" + name + ".cshtml");
        }
    }
}