using System.ComponentModel.DataAnnotations.Schema;

namespace Contribution.Core.Entities
{
    public class Profile
    {
        //public int UserId { get; set; }
        [ForeignKey("User")]
        public int ProfileId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public string Title { get; set; }
        public string ImageUrl { get; set; }
        public string PhoneNumber { get; set; }
        public virtual User User { get; set; }

    }
}
