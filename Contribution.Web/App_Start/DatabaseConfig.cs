using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity.Migrations;

namespace Contribution.Web.App_Start
{
    public class DatabaseConfig
    {
        public static void MigrateToLatest()
        {
            var configuration = new Data.Migrations.Configuration()
            {

            };               
        }
    }
}