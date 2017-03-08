using Contribution.Core.Business;
using Contribution.Core.Entities;
using System.Data.Entity.Migrations;
using static Contribution.Core.Entities.Role;

namespace Contribution.Data.Migrations
{
    public class SeedData
    {
        public static void SeedRoles(DataEntities context)
        {
            context.Roles.AddOrUpdate(r => r.RoleName,

                new Role()
                {
                    RoleName = AppRole.SystemAdministrator.ToString()
                },
                new Role()
                {
                    RoleName = AppRole.User.ToString()
                });
        }

        public static void SeedMonths(DataEntities context)
        {
            context.Months.AddOrUpdate(m => m.MonthId,

                new Month() { MonthName = AppMonths.January.ToString() },
                new Month() { MonthName = AppMonths.February.ToString() },
                new Month() { MonthName = AppMonths.March.ToString() },
                new Month() { MonthName = AppMonths.April.ToString() },
                new Month() { MonthName = AppMonths.May.ToString() },
                new Month() { MonthName = AppMonths.June.ToString() },
                new Month() { MonthName = AppMonths.July.ToString() },
                new Month() { MonthName = AppMonths.August.ToString() },
                new Month() { MonthName = AppMonths.September.ToString() },
                new Month() { MonthName = AppMonths.October.ToString() },
                new Month() { MonthName = AppMonths.November.ToString() },
                new Month() { MonthName = AppMonths.December.ToString() }
                );
        }
    
        public static void SeedYears(DataEntities context)
        {
            context.Years.AddOrUpdate(y => y.YearId,

                new Year() { YearName = "2017" },
                new Year() { YearName = "2018" },
                new Year() { YearName = "2019" },
                new Year() { YearName = "2020" },
                new Year() { YearName = "2021" }
                );
        }
    }
}
