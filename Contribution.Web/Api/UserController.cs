using Contribution.Core.Business;
using Contribution.Core.Interface.Data;
using Contribution.Web.Api.UserManagerModels;
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
    [RoutePrefix("api/users")]
    public class UserController : ApiController
    {
        private readonly IUserManager _userManager;

        public UserController(IUserManager usermanager)
        {
            _userManager = usermanager;
        }


        [HttpPost, Route("")]
        public IHttpActionResult CreateUser([FromBody]UserModel model)
        {
            var op = _userManager.CreateUser(model);
            return this.OperationResult(op);
            //return Ok(op);
        }

        [Authorize]
        [HttpPost, Route("user")]
        public IHttpActionResult AddUser([FromBody]UserModel model)
        {
            var op = _userManager.AddUser(model);
            return this.OperationResult(op);
            //return Ok(op);
        }


        [Authorize]
        [HttpGet, Route("{userId:int}")]
        public IHttpActionResult FindUserById(long userId)
        {
            var op = _userManager.FindUserById(userId);
            return this.OperationResult(op);
            //return Ok(op);
        }

        //[NoCache]
        [HttpGet, Route("{userId}/roles")]
        public IHttpActionResult GetRoles(int userId)
        {
            var op = _userManager.GetRoles(userId);
            return this.OperationResult(op);
            //return Ok(op);
        }

        [Authorize]
        [HttpPut, Route("{userId}/roles")]
        public IHttpActionResult AssignRole(long userId, [FromBody]AssignRoleArgs args)
        {
            var op = _userManager.AssignRole(userId, args?.Role);
            return this.OperationResult(op);
        }

        [Authorize]
        [HttpDelete, Route("{userId}/roles")]
        public IHttpActionResult RemoveRole(int userId, string role)
        {
            var op = _userManager.RemoveRole(userId, role);
            return this.OperationResult(op);
        }


        [Authorize]
        [HttpGet, Route("GetUsers")]
        public IHttpActionResult FindUsers()
        {
            var op = _userManager.GetUsers();
            return this.OperationResult(op);
            //return Ok(op);
        }

        [Authorize]
        [HttpPut, Route("{userId}")]
        public IHttpActionResult UpdateUser([FromBody]UserModel model)
        {
            var op = _userManager.UpdateUser(model);
            return this.OperationResult(op);
            //return Ok(op);
        }

        [HttpPost, Route("validate")]
        public IHttpActionResult ValidateUser([FromBody]ValidateUserArgs args)
        {
            var op = _userManager.ValidateUser(args?.Email, args?.Password);
            return this.OperationResult(op);
            //return Ok(op);
        }

        [Authorize]
        [HttpGet, Route("{userId}/image")]
        public IHttpActionResult GetProfileImage(long userId)
        {
            var op = _userManager.GetProfileImageUri(userId);
            return this.OperationResult(op);
        }

        [Authorize]
        [HttpPost, Route("{userId}/image")]
        public async Task<IHttpActionResult> ChangeProfileImageAsync(long userId)
        {

            var changeProfileAsync = Operation.Run(async () =>
            {
                //Validate Content
                if (!Request.Content.IsMimeMultipartContent()) throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);

                // Read the MIME multipart content 
                var memoryProvider = await Request.Content.ReadAsMultipartAsync();
                var file = memoryProvider.Contents.FirstOrDefault();
                var mstream = new MemoryStream();
                (await file.ReadAsStreamAsync()).CopyTo(mstream);

                //Set Profile Image
                var setProfileImage = _userManager.SetProfileImage(userId, file.Headers.ContentType.MediaType, mstream);
                return setProfileImage.Unwrap();
            });


            return this.OperationResult(await changeProfileAsync);
        }


    }
    namespace UserManagerModels
    {
        public class ValidateUserArgs
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }
        public class ChangePasswordArgs
        {
            public string Email { get; set; }
            public string Password { get; set; }
            public string NewPassword { get; set; }
        }

        public class RegisterUserArgs
        {
            public UserModel User { get; set; }
            public string Role { get; set; }
        }
        public class AssignRoleArgs
        {
            public string Role { get; set; }

        }
    }
}
