using Contribution.Core.Entities;
using System.Data.Entity;


namespace Contribution.Data
{
    public class DataEntities : DbContext
    {
        public DataEntities() : base("ContributionDB")
        {

        }
        public DbSet<User> Users { get; set; }
        public DbSet<Contribute> Contributes { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Profile> Profiles { get; set; }
        public DbSet<Collector> Collectors { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Year> Years { get; set; }
        public DbSet<Month> Months { get; set; }
        public DbSet<UserGroup> UserGroups { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            //base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>() // one to one entity
                .HasRequired(u => u.Profile)
                .WithRequiredPrincipal(p => p.User); 
        }
    }

}
