using System.Collections.Generic;

namespace Contribution.Data.Entities
{
    public class User
    {
        public int UserId { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public virtual Profile Profile { get; set; }
        public bool ActiveStatus { get; set; }

        public ICollection<Contribute> Contributes { get; set; }
        public ICollection<UserRole> UserRoles{ get; set; }
        public ICollection<Group> Groups { get; set; }
        public ICollection<Collector> Collectors { get; set; }
        public ICollection<UserGroup> UserGroups { get; set; }

        public User()
        {
          Contributes = new HashSet<Contribute>();
          UserRoles = new HashSet<UserRole>();
          UserGroups = new HashSet<UserGroup>();
        }

    }
}
