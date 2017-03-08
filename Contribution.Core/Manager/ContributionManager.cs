using Contribution.Core.Business;
using Contribution.Core.Entities;
using Contribution.Core.Interface.Data;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Contribution.Core.Manager
{
    public class ContributionManager : IContributionManager
    {
        private readonly IDataRepository _repo;
        public ContributionManager(IDataRepository repo)
        {
            _repo = repo;
        }
        public Operation<long> CreateCollector(CollectorModel model)
        {
            return Operation.Create(() =>
            {
                var collector = _repo.Query<Collector>()
                .Where(c => c.UserId == model.UserId && c.YearId == model.YearId && c.GroupId == model.GroupId)
                .FirstOrDefault();
                if (collector != null) throw new Exception("Collector already added for this group and year");

                var entity = new Collector()
                {
                    GroupId = model.GroupId,
                    MonthId = model.MonthId,
                    YearId = model.YearId,
                    UserId = model.UserId
                };

                _repo.Add<Collector>(entity);
                _repo.SaveChanges().Unwrap();
                return (long)entity.CollectorId;
            });
        }

        public Operation<long> AddUserContributionToGroup(ContributeModel model)
        {
            return Operation.Create(() =>
            {
                var existInGroup = _repo.Query<UserGroup>().Where(ug => ug.UserId == model.UserId && ug.GroupId == model.GroupId).FirstOrDefault();
                if (existInGroup == null) throw new Exception("This User does not belong to this group");

                var contribution = _repo.Query<Contribute>().Where(c => c.UserId == model.UserId && c.MonthId == model.MonthId && 
                c.GroupId == model.GroupId).FirstOrDefault();
                if (contribution != null) throw new Exception("This User has contributed in this group");

                var yearId = _repo.Query<Year>().Where(y => y.YearName == DateTime.Now.Year.ToString()).Select(y => y.YearId).FirstOrDefault();
                var entity = new Contribute()
                {
                   
                    Amount = 10000,
                    GroupId = model.GroupId,
                    MonthId = model.MonthId,
                    UserId = model.UserId,
                    TransactionDate = DateTime.Now,
                    YearId = yearId
                };
                _repo.Add<Contribute>(entity);
                _repo.SaveChanges().Unwrap();
                return (long)entity.ContributeId;

           });
        }

    public Operation<CollectorModel> GetCollector(int userId)
    {
        throw new NotImplementedException();
    }

    public Operation<CollectorModel> GetCollectors()
    {
        throw new NotImplementedException();
    }

    public Operation<ContributeModel[]> GetContributors()
    {
        return Operation.Create(() =>
        {
            var contributor = _repo.Query<Contribute>().ToList();

            return contributor.Select(c => new ContributeModel(c)).ToArray();


        });
    }

    public Operation<CollectorModel> UpdateCollector(int userId)
    {
        throw new NotImplementedException();
    }

    public Operation<ContributeModel> UpdateContributor(int userId)
    {
        throw new NotImplementedException();
    }
    public Operation<ContributeModel> GetContributionInGroup(int groupId, int userId)
    {
        return Operation.Create(() =>
        {
            var contribute = _repo.Query<Contribute>().Where(c => c.GroupId == groupId && c.UserId == userId).FirstOrDefault();
            if (contribute == null) throw new Exception("This User is not in this group yet");

            var user = _repo.GetByID<User>(userId);

            var model = new ContributeModel(contribute);

            return model;
        });
    }

    public Operation<ContributeModel[]> GetContributionsInGroup(int groupId)
    {
        return Operation.Create(() =>
        {
            var contributions = _repo.Query<Contribute>().Where(c => c.GroupId == groupId).ToList();
            if (contributions == null) throw new Exception("No Contributions in this group yet");

                var model = contributions.Select(c => new ContributeModel(c)).ToArray();

                return model;
        });
    }

}
}
