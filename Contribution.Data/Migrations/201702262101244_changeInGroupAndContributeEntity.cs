namespace Contribution.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class changeInGroupAndContributeEntity : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Contributes", "GroupId", c => c.Int(nullable: false));
            CreateIndex("dbo.Contributes", "GroupId");
            AddForeignKey("dbo.Contributes", "GroupId", "dbo.Groups", "GroupId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Contributes", "GroupId", "dbo.Groups");
            DropIndex("dbo.Contributes", new[] { "GroupId" });
            DropColumn("dbo.Contributes", "GroupId");
        }
    }
}
