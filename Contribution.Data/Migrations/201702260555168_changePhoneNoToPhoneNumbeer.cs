namespace Contribution.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class changePhoneNoToPhoneNumbeer : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Profiles", "PhoneNumber", c => c.String());
            DropColumn("dbo.Profiles", "PhoneNo");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Profiles", "PhoneNo", c => c.String());
            DropColumn("dbo.Profiles", "PhoneNumber");
        }
    }
}
