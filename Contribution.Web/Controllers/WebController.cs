using System.Web.Mvc;

namespace Contribution.Web.Controllers
{
    public class WebController : Controller
    {
        // GET: Web
        public ActionResult Template(string id)
        {
            return PartialView(id);
        }
    }
}