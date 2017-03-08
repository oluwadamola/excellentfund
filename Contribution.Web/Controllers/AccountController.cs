using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Contribution.Web.Controllers
{
    public class AccountController : WebController
    {
        // GET: Account
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Invite(string token)
        {
            return View();
        }
    }
}