using System.Web.Mvc;

namespace Contribution.Web.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            return RedirectToAction("Index", "Account");
        }
    }
}