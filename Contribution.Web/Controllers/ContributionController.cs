using System.Web.Mvc;

namespace Contribution.Web.Controllers
{
    public class ContributionController : WebController
    {
        // GET: Contribution
        public ActionResult Index()
        {
            return View();
        }
    }
}