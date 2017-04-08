using Contribution.Data.Entities;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Contribution.Core.Business
{
    public class YearModel: Model
    {
        public int YearId { get; set; }

        [Required(ErrorMessage ="Year Name is required")]
        [DisplayName("Year Name")]
        public string YearName { get; set; }
        public ICollection<ContributeModel> Contributes { get; set; } = new HashSet<ContributeModel>();
        public ICollection<CollectorModel> Collectors { get; set; } = new HashSet<CollectorModel>();

        public YearModel()
        {

        }

        public YearModel(Year year)
        {
            this.Assign(year);
        }

    }

}
