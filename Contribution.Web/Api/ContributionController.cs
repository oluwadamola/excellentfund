using Contribution.Core.Business;
using Contribution.Core.Interface.Data;
using Contribution.Core.Interface.Manager;
using Contribution.Web.Infastructure.Utils;
using System.Web.Http;

namespace Contribution.Web.Api
{
    [RoutePrefix("api/contributors")]
    public class ContributionController : ApiController
    {
        private readonly IContributionManager _contributionManager;

        public ContributionController(IGroupManager groupManager, IContributionManager contributionManager)
        {
            _contributionManager = contributionManager;
        }

        [Authorize]
        [HttpPost, Route("")]
        public IHttpActionResult CreateUserContribution([FromBody]ContributeModel model)
        {
            var op = _contributionManager.AddUserContributionToGroup(model);
            return this.OperationResult(op);
        }

        [Authorize]
        [HttpGet, Route("")]
        public IHttpActionResult GetContributors()
        {
            var op = _contributionManager.GetContributors();
            return this.OperationResult(op);
        }
 
        [Authorize]
        [HttpGet, Route("{groupId:int}")]
        public IHttpActionResult GetContributionsInGroup(int groupId)
        {
            var op = _contributionManager.GetContributionsInGroup(groupId);
            return this.OperationResult(op);
        }

    }
}
