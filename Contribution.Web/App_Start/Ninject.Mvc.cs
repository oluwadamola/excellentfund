using Contribution.Core.Interface.Manager;
using Ninject.Modules;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Web.Mvc;


namespace Ninject.Mvc
{
    //  A small Library to configure Ninject (A Dependency Injection Library) with a WebAPI Application. 
    //  To configure, take the following steps.
    // 
    //  1. Install Packages Ninject and Ninject.Web.Common 
    //  2. Remove NinjectWebCommon.cs in your App_Start Directory
    //  3. Add this file to your project  (preferrably in the App_Start Directory)  
    //  4. Add Your Bindings to the Load method of MainModule. 
    //     You can add as many additional modules to keep things organized
    //     simply add them to the Modules property of the NinjectModules class
    //  5. Add the following Line to your Global.asax
    //          NinjectContainer.RegisterModules(NinjectModules.Modules);
    //  5b.To Automatically Register all NinjectModules in the Current Project, You should instead add
    //          NinjectContainer.RegisterAssembly()
    //  You are done. 


    /// <summary>
    /// Resolves Dependencies Using Ninject
    /// </summary>
    public class NinjectResolver : IDependencyResolver
    {
        public IKernel Kernel { get; private set; }
        public NinjectResolver(params NinjectModule[] modules)
        {
            Kernel = new StandardKernel(modules);
        }

        public NinjectResolver(Assembly assembly)
        {
            Kernel = new StandardKernel();
            Kernel.Load(assembly);
        }

        public object GetService(Type serviceType)
        {
            return Kernel.TryGet(serviceType);
        }

        public IEnumerable<object> GetServices(Type serviceType)
        {
            return Kernel.GetAll(serviceType);
        }
    }


    // List and Describe Necessary Modules
    /*
    public class NinjectModules
    {
        //Return Lists of Modules in the Application
        public static NinjectModule[] Modules
        {
            get
            {
                //Return Modules you want to use for DI
                return new[] { new MainModule() };
            }
        }

        private class MainModule : NinjectModule
        {

            public override void Load()
            {
                
            }
        }
    }

    */
    /// <summary>
    /// Its job is to Register Ninject Modules and Resolve Dependencies Manually (If need be)
    /// </summary>
    public class NinjectContainer
    {
        private static NinjectResolver _resolver;

        //Register Ninject Modules
        public static void RegisterModules(NinjectModule[] modules)
        {
            _resolver = new NinjectResolver(modules);
            DependencyResolver.SetResolver(_resolver);
        }

        public static void RegisterAssembly()
        {
            _resolver = new NinjectResolver(Assembly.GetExecutingAssembly());

            //This is where the actual hookup to the MVC Pipeline is done.
            DependencyResolver.SetResolver(_resolver);
        }

        //Manually Resolve Dependencies
        public static T Resolve<T>()
        {
            return _resolver.Kernel.Get<T>();
        }
    }
}