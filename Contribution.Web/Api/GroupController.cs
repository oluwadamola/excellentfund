using Contribution.Core.Business;
using Contribution.Core.Interface.Manager;
using Contribution.Web.Infastructure.Utils;
using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
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
        [HttpPost, Route("{groupId}/users")]
        public async Task<IHttpActionResult> UploadUsers(int groupId)
        {
            try
            {
                //Validate Content
                if (!Request.Content.IsMimeMultipartContent()) throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);

                // Read the MIME multipart content 
                var memoryProvider = await Request.Content.ReadAsMultipartAsync();
                var file = memoryProvider.Contents.FirstOrDefault();
                var mstream = new MemoryStream();
                (await file.ReadAsStreamAsync()).CopyTo(mstream);

                return this.OperationResult(this._groupManager.UploadUsers(groupId, mstream));
            }
            catch(Exception ex)
            {
                return this.OperationResult(OperationHelpers.CreateFailedOperation(ex.Message));
            }
        }

        /*[Authorize]
        [HttpGet, Route("{groupId:int}/users")]
        public IHttpActionResult GetUsersInGroup(int groupId)
        {
            var op = _groupManager.GetUsersInGroup(groupId);
            return this.OperationResult(op);
        }*/

        [Authorize]
        [HttpGet, Route("{groupId:int}/users")]
        public IHttpActionResult GetUsersInGroup(int groupId)
        {
            var op = _groupManager.GetUsersInGroup(groupId);
            return this.OperationResult(op);
        }

        [Authorize]
        [HttpGet, Route("{groupId:int}/users")]
        public IHttpActionResult GetUsersInGroup(int groupId, int offset, int limit)
        {
            var op = _groupManager.GetUsersInGroup(groupId, offset, limit);
            return this.OperationResult(op);
        }

        [Authorize]
        [HttpGet, Route("{groupId:int}/users/count")]
        public IHttpActionResult GetUserInGroup(int groupId)
        {
            var op = _groupManager.GetUserInGroupCount(groupId);
            return this.OperationResult(op);
        }

        [Authorize]
        [HttpPost, Route("{groupId:int}/users/{userId:int}")]
        public IHttpActionResult AddUserToGroup(int groupId, int userId)
        {
            var op = _groupManager.AddUserToGroup(groupId, userId);
            return this.OperationResult(op);
        }

        [Authorize]
        [HttpGet, Route("users/{userId:int}")]
        public IHttpActionResult GetUserGroup(int userId)
        {
            var op = _groupManager.GetUserGroup(userId);
            return this.OperationResult(op);
        }

    }
}
