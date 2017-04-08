using Contribution.Data.Entities;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Contribution.Core.Business
{
    public class ProfileModel : Model
    {
        public int UserId { get; set; }

        [Required(ErrorMessage ="First Name is required")]
        [DisplayName("First Name")]
        public string FirstName { get; set; }

        [Required(ErrorMessage ="Last Name is required")]
        [DisplayName("Last Name")]
        public string LastName { get; set; }
        public string Gender { get; set; }
        public string Title { get; set; }
        public string ImageUrl { get; set; }

        [DisplayName("Phone Number")]
        public string PhoneNo { get; set; }
        public virtual User User { get; set; }
    }
}
