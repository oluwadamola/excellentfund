using Contribution.Data.Entities;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Contribution.Core.Business
{
    public class ContributeModel : Model
    {
        public int ContributionId { get; set; }
        public int MonthId { get; set; }
        public int YearId { get; set; }
        public int UserId { get; set; } 
        public int GroupId { get; set; }
        
        [Required(ErrorMessage ="Amount is required")]
        public decimal Amount { get; set; }

        [DisplayName("Transaction Date")]
        public DateTime TransactionDate { get; set; }
        public UserModel User { get; set; }
        public MonthModel Month { get; set; }
        public GroupModel Group { get; set; }
        public YearModel Year { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string MonthName { get; set; }
        public string YearName { get; set; }


        public ContributeModel()
        {

        }

        public ContributeModel(Contribute contribute)
        {
            this.Assign(contribute);
            this.User = new UserModel(contribute.User);
            this.Month = new MonthModel(contribute.Month);
            this.Year = new YearModel(contribute.Year);
            this.Group = new GroupModel(contribute.Group);
        }
    }
}
