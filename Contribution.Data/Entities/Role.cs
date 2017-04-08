using System.Collections.Generic;

namespace Contribution.Data.Entities
{
    public class Role
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public ICollection<UserRole> UserRoles{ get; set; }

        public Role()
        {
            UserRoles = new HashSet<UserRole>();
        }

        public enum AppRole
        {
            SystemAdministrator,
            User
        }
    }
}
