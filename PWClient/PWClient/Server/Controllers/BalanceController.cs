using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.AspNet.Identity.Owin;
using System.Threading.Tasks;
using PWClient.Server.Models;
using PWClient.Server.ViewModels;
using PWClient.Models;

namespace PWClient.Server.Controllers
{
    [Authorize]
    public class BalanceController : ApiController
    {
        public async Task<string> mybalance()
        {
            var user = await Request.GetOwinContext().GetUserManager<ApplicationUserManager>().FindByNameAsync(User.Identity.Name);
            if (user == null)
                return "?";
            return "PW: " + user.PW;
        }

        public async Task<IHttpActionResult> transaction(TransactionViewModel Model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var owner = await Request.GetOwinContext().GetUserManager<ApplicationUserManager>().FindByNameAsync(User.Identity.Name);
            if (owner.PW < Model.PW)
            {
                ModelState.AddModelError("", "You do not have enough PW on this operation");
                return BadRequest(ModelState);
            }

            var target = await Request.GetOwinContext().GetUserManager<ApplicationUserManager>().FindByNameAsync(Model.Username);
            if (target == null)
            {
                ModelState.AddModelError("", "This recipient does not exist");
                return BadRequest(ModelState);
            }


            using (var db = new ApplicationDbContext())
            {
                var owner_context = db.Users.Where(x => x.Id == owner.Id).First();
                owner_context.PW -= Model.PW;

                var target_context = db.Users.Where(x => x.Id == target.Id).First();
                target_context.PW += Model.PW;

                db.Transactions.Add(new Transaction()
                    {
                        amount = Model.PW,
                        owner = owner.Id,
                        target = target.Id,
                        when = DateTime.Now,
                        owner_pw_total = owner_context.PW,
                        target_pw_total = target_context.PW
                    });

                db.SaveChanges();

                return Ok(true);
            }
        }

        public async Task<IHttpActionResult> mytransactions()
        {
            var user = await Request.GetOwinContext().GetUserManager<ApplicationUserManager>().FindByNameAsync(User.Identity.Name);

            using (var db = new ApplicationDbContext())
            {
                var transactions = db.Transactions.Where(x => x.owner == user.Id
                    || x.target == user.Id)
                    .Select(x => new
                    {
                        x.amount,
                        x.when,
                        operation = x.owner == user.Id ? 0 : 1,
                        total = x.owner == user.Id ? x.owner_pw_total : x.target_pw_total,
                        userid = x.owner == user.Id ? x.target : x.owner
                    }).Join(db.Users, t => t.userid, u => u.Id,
                    (t, u) => new
                    {
                        t.amount,
                        t.when,
                        u.UserName,
                        t.operation,
                        t.total
                    }).ToArray();

                return Json(transactions);
            }
        }
    }
}