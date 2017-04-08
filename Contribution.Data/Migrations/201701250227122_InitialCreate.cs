namespace Contribution.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Collectors",
                c => new
                    {
                        CollectorId = c.Int(nullable: false, identity: true),
                        UserId = c.Int(nullable: false),
                        MonthId = c.Int(nullable: false),
                        YearId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.CollectorId)
                .ForeignKey("dbo.Months", t => t.MonthId, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.UserId, cascadeDelete: true)
                .ForeignKey("dbo.Years", t => t.YearId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.MonthId)
                .Index(t => t.YearId);
            
            CreateTable(
                "dbo.Months",
                c => new
                    {
                        MonthId = c.Int(nullable: false, identity: true),
                        MonthName = c.String(),
                    })
                .PrimaryKey(t => t.MonthId);
            
            CreateTable(
                "dbo.Contributes",
                c => new
                    {
                        ContributeId = c.Int(nullable: false, identity: true),
                        MonthId = c.Int(nullable: false),
                        YearId = c.Int(nullable: false),
                        UserId = c.Int(nullable: false),
                        TransactionDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ContributeId)
                .ForeignKey("dbo.Months", t => t.MonthId, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.UserId, cascadeDelete: true)
                .ForeignKey("dbo.Years", t => t.YearId, cascadeDelete: true)
                .Index(t => t.MonthId)
                .Index(t => t.YearId)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.Users",
                c => new
                    {
                        UserId = c.Int(nullable: false, identity: true),
                        Email = c.String(),
                        Password = c.String(),
                        ActiveStatus = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.UserId);
            
            CreateTable(
                "dbo.Groups",
                c => new
                    {
                        GroupId = c.Int(nullable: false, identity: true),
                        GroupName = c.String(),
                    })
                .PrimaryKey(t => t.GroupId);
            
            CreateTable(
                "dbo.Profiles",
                c => new
                    {
                        ProfileId = c.Int(nullable: false),
                        FirstName = c.String(),
                        LastName = c.String(),
                        Gender = c.String(),
                        Title = c.String(),
                        PhoneNo = c.String(),
                    })
                .PrimaryKey(t => t.ProfileId)
                .ForeignKey("dbo.Users", t => t.ProfileId)
                .Index(t => t.ProfileId);
            
            CreateTable(
                "dbo.UserRoles",
                c => new
                    {
                        UserRoleId = c.Int(nullable: false, identity: true),
                        RoleId = c.Int(nullable: false),
                        UserId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.UserRoleId)
                .ForeignKey("dbo.Roles", t => t.RoleId, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.UserId, cascadeDelete: true)
                .Index(t => t.RoleId)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.Roles",
                c => new
                    {
                        RoleId = c.Int(nullable: false, identity: true),
                        RoleName = c.String(),
                    })
                .PrimaryKey(t => t.RoleId);
            
            CreateTable(
                "dbo.Years",
                c => new
                    {
                        YearId = c.Int(nullable: false, identity: true),
                        YearName = c.String(),
                    })
                .PrimaryKey(t => t.YearId);
            
            CreateTable(
                "dbo.GroupUsers",
                c => new
                    {
                        Group_GroupId = c.Int(nullable: false),
                        User_UserId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.Group_GroupId, t.User_UserId })
                .ForeignKey("dbo.Groups", t => t.Group_GroupId, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.User_UserId, cascadeDelete: true)
                .Index(t => t.Group_GroupId)
                .Index(t => t.User_UserId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Contributes", "YearId", "dbo.Years");
            DropForeignKey("dbo.Collectors", "YearId", "dbo.Years");
            DropForeignKey("dbo.UserRoles", "UserId", "dbo.Users");
            DropForeignKey("dbo.UserRoles", "RoleId", "dbo.Roles");
            DropForeignKey("dbo.Profiles", "ProfileId", "dbo.Users");
            DropForeignKey("dbo.GroupUsers", "User_UserId", "dbo.Users");
            DropForeignKey("dbo.GroupUsers", "Group_GroupId", "dbo.Groups");
            DropForeignKey("dbo.Contributes", "UserId", "dbo.Users");
            DropForeignKey("dbo.Collectors", "UserId", "dbo.Users");
            DropForeignKey("dbo.Contributes", "MonthId", "dbo.Months");
            DropForeignKey("dbo.Collectors", "MonthId", "dbo.Months");
            DropIndex("dbo.GroupUsers", new[] { "User_UserId" });
            DropIndex("dbo.GroupUsers", new[] { "Group_GroupId" });
            DropIndex("dbo.UserRoles", new[] { "UserId" });
            DropIndex("dbo.UserRoles", new[] { "RoleId" });
            DropIndex("dbo.Profiles", new[] { "ProfileId" });
            DropIndex("dbo.Contributes", new[] { "UserId" });
            DropIndex("dbo.Contributes", new[] { "YearId" });
            DropIndex("dbo.Contributes", new[] { "MonthId" });
            DropIndex("dbo.Collectors", new[] { "YearId" });
            DropIndex("dbo.Collectors", new[] { "MonthId" });
            DropIndex("dbo.Collectors", new[] { "UserId" });
            DropTable("dbo.GroupUsers");
            DropTable("dbo.Years");
            DropTable("dbo.Roles");
            DropTable("dbo.UserRoles");
            DropTable("dbo.Profiles");
            DropTable("dbo.Groups");
            DropTable("dbo.Users");
            DropTable("dbo.Contributes");
            DropTable("dbo.Months");
            DropTable("dbo.Collectors");
        }
    }
}
