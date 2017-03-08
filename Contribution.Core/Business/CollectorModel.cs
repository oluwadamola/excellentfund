using Contribution.Core.Entities;

namespace Contribution.Core.Business
{
    public class CollectorModel : Model
    {
        public int CollectorId { get; set; }
        public int UserId { get; set; }
        public int GroupId { get; set; }
        public int MonthId { get; set; }
        public int YearId { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string MonthName { get; set; }
        public string YearName { get; set; }

        public CollectorModel()
        {

        }

        public CollectorModel(Collector collector)
        {
            this.Assign(collector);
        }
    }
}
