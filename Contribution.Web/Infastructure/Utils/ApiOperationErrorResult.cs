using System;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;

namespace Contribution.Web.Infastructure.Utils
{
    public class ApiOperationResult<V> : IHttpActionResult
    {
        public Operation<V> Operation { get; private set; }
        public HttpStatusCode Code { get; private set; } = HttpStatusCode.InternalServerError;
        private HttpRequestMessage Request { get; set; }

        public ApiOperationResult(Operation<V> operation, HttpRequestMessage request, HttpStatusCode? code = HttpStatusCode.OK)
        {
            Operation = operation;
            Request = request;

            Code = code ?? (operation.Succeeded ? HttpStatusCode.OK : HttpStatusCode.InternalServerError);
        }

        public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
        {
            var response = Request.CreateResponse(Code, Operation, Request.GetConfiguration().Formatters.JsonFormatter);
            response.ReasonPhrase = Operation.Message?.Replace("\n", " ");     //Reason Phrase cannot contain newline characters
            return Task.FromResult(response);
        }
    }

    public class ApiOperationResult : ApiOperationResult<object>
    {
        public ApiOperationResult(Operation operation, HttpRequestMessage request, HttpStatusCode? code = default(HttpStatusCode?))
        : base(operation.Next(() => (object)null), request, code) //<-- simply convert the "Operation" to  "Operation<object>"
        { }
    }
}