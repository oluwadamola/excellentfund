using Contribution.Core.Manager;
using Contribution.Data;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using Ninject;
using Ninject.Web.Common.OwinHost;
using Ninject.Web.WebApi.OwinHost;
using Owin;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;

[assembly: OwinStartup(typeof(Contribution.Web.Startup))]

namespace Contribution.Web
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=316888
            var config = new HttpConfiguration();
            config.MapHttpAttributeRoutes();
            config.Formatters.Remove(config.Formatters.XmlFormatter);


            OAuthAuthorizationServerOptions OAuthServerOptions = new OAuthAuthorizationServerOptions()
            {
                AllowInsecureHttp = true,
                TokenEndpointPath = new PathString("/token"),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(1),
                //Provider = new SimpleAuthorizationServerProvider()
                //Provider = new OAuthProvider(NinjectContainer.Resolve<IUserManager>())
                Provider = new OAuthProvider()
            };


            //app.UseWebApi(config);

            //configure ninject middleware
            app.UseNinjectMiddleware(createKernel);
            //var kernel = NinjectContainer.CreateKernel();
            //app.UseNinjectMiddleware(() => kernel);


            // Token Generation
            app.UseOAuthAuthorizationServer(OAuthServerOptions);
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());


            // ninject for webApi
            app.UseNinjectWebApi(config);
            //.UseWelcomePage();
        }

        public static IKernel createKernel()
        {
            
            var kernel = new StandardKernel();
            kernel.Load(Assembly.GetExecutingAssembly());
            return kernel;
        }



        public class OAuthProvider : OAuthAuthorizationServerProvider
        {
            public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
            {
                context.Validated();
            }
            public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
            {

                using (var db = new DataEntities())
                {
                    UserManager _userManager = new UserManager(new EntityRepository(db));
                    var validateUser = _userManager.ValidateUser(context.UserName, context.Password);
                    context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });

                    if (validateUser.Succeeded)
                    {
                        //if validating the user succeeded...

                        //aggregate the claims that makeup the token
                        var identity = new ClaimsIdentity(context.Options.AuthenticationType);

                        //add any other relevant claim here...
                        identity.AddClaim(new Claim(ClaimTypes.Name, context.UserName));
                        identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, validateUser.Result.UserId.ToString()));


                        //Create Extra properties
                        var props = new Dictionary<string, string>
                    {
                        { "UserId", validateUser.Result.UserId.ToString() },
                        { "Email", validateUser.Result.Email },
                        { "FirstName", validateUser.Result.FirstName },
                        { "LastName", validateUser.Result.LastName }//,
                       // { "ImageUrl", validateUser.Result.ImageUrl ?? "" }
                    };

                        context.Validated(new AuthenticationTicket(identity, new AuthenticationProperties(props)));
                    }
                    else
                    {
                        //if validating the user didnt succeed...

                        context.SetError("invalid_grant", validateUser.Message);
                        return;
                    }


                }
            }

            public override Task TokenEndpoint(OAuthTokenEndpointContext context)
            {
                foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
                {
                    context.AdditionalResponseParameters.Add(property.Key, property.Value);
                }
                return Task.FromResult<object>(null);
            }

        }


    }
}
