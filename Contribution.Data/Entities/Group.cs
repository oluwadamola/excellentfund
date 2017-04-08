using System.Collections.Generic;

namespace Contribution.Data.Entities
{
    public class Group
    {
        public int GroupId { get; set; }
        public string GroupName { get; set; }
        public ICollection<User> Users { get; set; }
        public ICollection<UserGroup> UserGroups { get; set; }
        public ICollection<Collector> Collectors { get; set; }
        public ICollection<Contribute> Contributes { get; set; }
        public Group()
        {
            Users = new HashSet<User>();
            UserGroups = new HashSet<UserGroup>();
            Collectors = new HashSet<Collector>();
            Contributes = new HashSet<Contribute>();
        }
    }

  
}
