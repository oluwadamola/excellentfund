using System.Web.Mvc;

namespace Contribution.Web.Controllers
{
    public class ProfileController : WebController
    {
        // GET: Profile
        public ActionResult Index()
        {
            return View();
        }
    }
}