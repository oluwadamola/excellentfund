using Contribution.Core.Business;
using Contribution.Core.Interface;
using Contribution.Data.Entities;
using Contribution.Data.Interface;
using System;
using System.Linq;

namespace Contribution.Core.Manager
{
    public class CollectorManager : ICollectorManager
    {
        private readonly IDataRepository _repo;

        public CollectorManager(IDataRepository repo)
        {
            _repo = repo;
        }

        public Operation<long> AddCollectorToGroup(int userId, int monthId, int groupId)
        {
            return Operation.Create(() =>
            {
                var collectorexist = _repo.Query<Collector>().Where(c => c.UserId == userId && c.MonthId == monthId && c.GroupId == groupId).SingleOrDefault();
                if (collectorexist != null) throw new Exception("This user is already added as a collector");

                //check if month exist before
                var month = _repo.Query<Collector>().Where(c => c.MonthId == monthId && c.GroupId == groupId).FirstOrDefault();
                if (month != null) throw new Exception("This month is assigned to a User");

                var yearId = _repo.Query<Year>().Where(y => y.YearName == DateTime.Now.Year.ToString()).Select(y => y.YearId).FirstOrDefault();

                var entity = new Collector
                {
                    UserId = userId,
                    MonthId = monthId,
                    GroupId = groupId,
                    YearId = yearId
                };

                 _repo.Add<Collector>(entity);
                _repo.SaveChanges().Unwrap();

                return (long)entity.CollectorId; 
            });
        }
        public Operation<CollectorModel[]> GetCollectorsInGroup(int groupId)
        {
            return Operation.Create(() =>
            {
                var contributions = _repo.Query<Collector>(c => c.User, c => c.Month, c => c.Year).Where(c => c.GroupId == groupId).ToList();
                if (contributions == null) throw new Exception("No Collectors in this group yet");

                var model = contributions.Select(c => new CollectorModel()
                {
                    GroupId = c.GroupId,
                    UserId = c.UserId,
                    FirstName = c.User.Profile.FirstName,
                    LastName = c.User.Profile.LastName,
                    YearId = c.YearId,
                    MonthId = c.MonthId,
                    YearName = c.Year.YearName,
                    MonthName = c.Month.MonthName,
                    Email = c.User.Email
                }
                ).ToArray();

                return model;
            });
        }
    }
}
