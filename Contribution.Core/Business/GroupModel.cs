using Contribution.Core.Entities;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Contribution.Core.Business
{
    public class GroupModel : Model
    {
        public int GroupId { get; set; }

        [Required(ErrorMessage="Group Name is required")]
        public string GroupName { get; set; }
        public ICollection<UserModel> Users { get; set; }
        public ICollection<ContributeModel> Contributes { get; set; }

        public GroupModel()
        {
            
        }

        public GroupModel(Group group)
        {
            this.Assign(group);
        }
    }
}
