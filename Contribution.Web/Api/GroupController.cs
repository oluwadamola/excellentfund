using Contribution.Core.Business;
using Contribution.Core.Interface.Manager;
using Contribution.Web.Infastructure.Utils;
using System.Web.Http;

namespace Contribution.Web.Api
{
    [RoutePrefix("api/groups")]
    public class GroupController : ApiController
    {
        private readonly IGroupManager _groupManager;

        public GroupController(IGroupManager groupManager)
        {
            _groupManager = groupManager;
        }

        [Authorize]
        [HttpPost, Route("")]
        public IHttpActionResult CreateGroup([FromBody]GroupModel model)
        {
            var op = _groupManager.CreateGroup(model);
            return this.OperationResult(op);
        }


        [Authorize]
        [HttpGet, Route("")]
        public IHttpActionResult GetGroups()
        {
            var op = _groupManager.GetGroups();
            return this.OperationResult(op);
        }

        [Authorize]
        [HttpGet, Route("{groupId:int}")]
        public IHttpActionResult GetGroup(int groupId)
        {
            var op = _groupManager.GetGroup(groupId);
            return this.OperationResult(op);
        }

        [Authorize]
        [HttpPut, Route("{groupId}")]
        public IHttpActionResult UpdateGroup([FromBody]GroupModel model)
        {
            var op = _groupManager.UpdateGroup(model);
            return this.OperationResult(op);
        }

        [Authorize]
        [HttpGet, Route("{groupId:int}/users")]
        public IHttpActionResult GetUsersInGroup(int groupId)
        {
            var op = _groupManager.GetUsersInGroup(groupId);
            return this.OperationResult(op);
        }

        [Authorize]
        [HttpGet, Route("{groupId:int}/users/{userId:int}")]
        public IHttpActionResult GetUserInGroup(int groupId, int userId)
        {
            var op = _groupManager.GetUserInGroup(groupId, userId);
            return this.OperationResult(op);
        }

        [Authorize]
        [HttpPost, Route("{groupId:int}/users/{userId:int}")]
        public IHttpActionResult AddUserToGroup(int groupId, int userId)
        {
            var op = _groupManager.AddUserToGroup(groupId, userId);
            return this.OperationResult(op);
        }

    }
}
