using System.Web.Mvc;

namespace Contribution.Web.Controllers
{
    public class SystemAdminController : WebController
    {
        // GET: SystemAdmin
        public ActionResult Index()
        {
            return View();
        }
    }
}