using System;

namespace Contribution.Data.Entities
{
    public class Contribute
    {
        public int ContributeId { get; set; }
        public int MonthId { get; set; }
        public int YearId { get; set; }
        public int UserId { get; set; }
        public int GroupId { get; set; }
        public DateTime TransactionDate { get; set; }
        public virtual User User { get; set; }
        public virtual Month Month { get; set; }
        public virtual Year Year { get; set; }

        public virtual Group Group { get; set; }
        public decimal Amount { get; set; }

    }
}
