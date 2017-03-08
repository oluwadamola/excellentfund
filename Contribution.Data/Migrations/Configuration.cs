namespace Contribution.Data.Migrations
{
    using System.Data.Entity.Migrations;

    public sealed class Configuration : DbMigrationsConfiguration<Contribution.Data.DataEntities>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            ContextKey = "Contribution.Data.DataEntities";
        }

        protected override void Seed(Contribution.Data.DataEntities context)
        {
            //  This method will be called after migrating to the latest version.


            SeedData.SeedRoles(context);
            SeedData.SeedMonths(context);
            SeedData.SeedYears(context);
        }
    }
}
