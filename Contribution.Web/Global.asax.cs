using Contribution.Web.App_Start;
using Ninject.Http;
using Ninject.Mvc;
using System;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace Contribution.Web
{
    public class Global : HttpApplication
    {
        void Application_Start(object sender, EventArgs e)
        {
            // Code that runs on application startup

            DatabaseConfig.MigrateToLatest();
            AreaRegistration.RegisterAllAreas();

            NinjectHttpContainer.RegisterAssembly();
            NinjectContainer.RegisterAssembly();

            GlobalConfiguration.Configure(WebApiConfig.Register);
            RouteConfig.RegisterRoutes(RouteTable.Routes);            
        }
    }
}