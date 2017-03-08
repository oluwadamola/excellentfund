using Contribution.Core.Interface.Data;
using System;
using System.Web.Mvc;

namespace Contribution.Web.Controllers
{
    public class UserController : WebController
    {
        private readonly IUserManager _usermanager;
        public UserController(IUserManager usermanager)
        {
            _usermanager = usermanager;
        }
        // GET: User
        public ActionResult Index()
        {
            try
            {
                var users = _usermanager.GetUsers();
                return View(users);
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", ex.Message);
                return View();
            }

        }
    }
}