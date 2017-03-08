using Contribution.Core.Entities;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Contribution.Core.Business
{
    public class MonthModel : Model
    {
        public int MonthId { get; set; }

        [Required(ErrorMessage = "Month Name is Required")]
        [DisplayName("Month Name")]
        public string MonthName { get; set; }
        public ICollection<ContributeModel> Contributes { get; set; } = new HashSet<ContributeModel>();
        public ICollection<CollectorModel> Collectors { get; set; } = new HashSet<CollectorModel>();

        public MonthModel()
        {
            
        }

        public MonthModel(Month month)
        {
            this.Assign(month);
        }
    }

    public enum AppMonths{
        January, February, March, April, May, June, July, August, September, October, November, December
    }
}
