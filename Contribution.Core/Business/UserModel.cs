using Contribution.Core.Entities;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Contribution.Core.Business
{
    public class UserModel: Model
    {
        public int UserId { get; set; }

        [Required(ErrorMessage ="Email is required")]
        public string Email { get; set; }
        public string Password { get; set; }
        
        [Required(ErrorMessage ="First Name is required")]
        [DisplayName("First Name")]
        public string FirstName { get; set; }

        [Required(ErrorMessage ="Last Name is required")]

        [DisplayName("Last Name")]
        public string LastName { get; set; }

        public string ImageUrl { get; set; }
        public string Gender { get; set; }
        public string Title { get; set; }

        [DisplayName("Phone Number")]
        public string PhoneNumber { get; set; }

        public UserModel()
        {
            
        }

        public UserModel(User user)
        {
            this.Assign(user);
            this.FirstName = user.Profile.FirstName;
            this.LastName = user.Profile.LastName;
            this.ImageUrl = user.Profile.ImageUrl;
            this.Title = user.Profile.Title;
            this.PhoneNumber = user.Profile.PhoneNumber;
        }

        public User Create()
        {
            return new User()
            {
                Password = Password,
                Email = Email,
                Profile = new Profile()
                {
                    FirstName = FirstName,
                    LastName = LastName,
                    Gender = Gender,
                    Title = Title,
                    PhoneNumber = PhoneNumber
                }

            };
        }

        public UserModel Update(User user)
        {
            Assign(user);
            return this;
        }

        public UserModel Update(Profile profile)
        {
            Assign(profile);
            return this;
        }
    }
}
