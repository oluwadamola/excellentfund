using Contribution.Data.Entities;
using System.ComponentModel.DataAnnotations;

namespace Contribution.Core.Business
{
    public class RoleModel : Model
    {
        public int RoleId { get; set; }

        [Required(ErrorMessage = "Role Name is required")]
        public string RoleName { get; set; }
        //public List<UserRoleModel> UserRoles { get; set; } 

        public RoleModel(Role role)
        {
            this.Assign(role);
            //UserRoles = new List<UserRoleModel>();
        }
    }
}
