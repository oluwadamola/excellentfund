using System;
using System.Net;
using System.Web.Http;

namespace Contribution.Web.Infastructure.Utils
{
    public static class ApiControllerErrorHelpers
    {
        public static IHttpActionResult OperationResult(this ApiController controller, Operation operation, HttpStatusCode? code = null)
            => new ApiOperationResult(operation, controller.Request, code);
        public static IHttpActionResult OperationResult<V>(this ApiController controller, Operation<V> operation, HttpStatusCode? code = null)
            => new ApiOperationResult<V>(operation, controller.Request, code);
    }
}