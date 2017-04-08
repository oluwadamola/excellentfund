using Contribution.Core.Interface;
using Contribution.Core.Interface.Data;
using Contribution.Core.Interface.Manager;
using Contribution.Core.Manager;
using Ninject.Modules;
using Ninject.Web.Common;

namespace Contribution.Web.Infastructure.DIModules
{
    public class Manager : NinjectModule
    {
        public override void Load()
        {
            Bind<IUserManager>().To<UserManager>().InRequestScope();
            Bind<IGroupManager>().To<GroupManager>().InRequestScope();
            Bind<IContributionManager>().To<ContributionManager>().InRequestScope();
            Bind<ICollectorManager>().To<CollectorManager>().InRequestScope();
        }
    }
}