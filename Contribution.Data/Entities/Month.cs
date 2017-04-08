using System.Collections.Generic;

namespace Contribution.Data.Entities
{
    public class Month
    {
        public int MonthId { get; set; }
        public string MonthName { get; set; }
        public virtual ICollection<Contribute> Contributes { get; set; }
        public virtual ICollection<Collector> Collectors{ get; set; }
    }

    public enum AppMonths
    {
        January, February, March, April, May, June, July, August, September, October, November, December
    }
}
