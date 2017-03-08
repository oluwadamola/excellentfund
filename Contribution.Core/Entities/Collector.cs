namespace Contribution.Core.Entities
{
    public class Collector
    {
        public int CollectorId { get; set; }
        public int UserId { get; set; }
        public int GroupId { get; set; }
        public int MonthId { get; set; }
        public int YearId { get; set; }
        public virtual Month Month { get; set; }
        public virtual Year Year { get; set; }
        public virtual User User { get; set; }
        public virtual Group Group{ get; set; }

    }
}
