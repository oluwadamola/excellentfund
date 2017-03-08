using Contribution.Core.Business;
using Contribution.Core.Interface.Data;
using Contribution.Web.Infastructure.Utils;
using System.Web.Http;

namespace Contribution.Web.Api
{
    [RoutePrefix("api/collectors")]
    public class CollectorsController : ApiController
    {
        private readonly ICollectorManager _collectorManager;
        public CollectorsController(ICollectorManager collectorManager)
        {
            _collectorManager = collectorManager;
        }

        [Authorize]
        [HttpGet, Route("{groupId:int}")]
        public IHttpActionResult GetCollectorsInGroup(int groupId)
        {
            var op = _collectorManager.GetCollectorsInGroup(groupId);
            return this.OperationResult(op);
        }


        [Authorize]
        [HttpPost, Route("")]
        public IHttpActionResult AddCollectorToGroup([FromBody]CollectorModel model)
        {
            var op = _collectorManager.AddCollectorToGroup(model.UserId, model.MonthId, model.GroupId);
            return this.OperationResult(op);
        }
    }
}
