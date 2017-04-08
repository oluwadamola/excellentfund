using System.Collections.Generic;

namespace Contribution.Data.Entities
{
    public class Year
    {
        public int YearId { get; set; }
        public string YearName { get; set; }
        public virtual ICollection<Contribute> Contributions { get; set; }
        public virtual ICollection<Collector> Collectors { get; set; }
    }
}
