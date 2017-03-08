using Contribution.Core.Interface.Data;
using Contribution.Core.Interface.Manager;
using Contribution.Core.Manager;
using Contribution.Data;
using Ninject.Modules;
using Ninject.Web.Common;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace Contribution.Web.Infastructure.DIModules
{
    public class DataAccess : NinjectModule
    {
        public override void Load()
        {
            Bind<IDataRepository>().To<EntityRepository>().InRequestScope();
            Bind<DbContext>().To<DataEntities>().InRequestScope();
        }
    }
}