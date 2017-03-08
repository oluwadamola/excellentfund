using Contribution.Core.Business;
using System;

namespace Contribution.Core.Interface.Data
{
    public interface IContributionManager
    {
        //Operation<long> CreateContributor(ContributeModel model);
        Operation<long> AddUserContributionToGroup(ContributeModel model);
        Operation<ContributeModel[]> GetContributors();
        //Operation<ContributeModel> GetContributor(int userId);
        Operation<ContributeModel> UpdateContributor(int userId);
        Operation<long> CreateCollector(CollectorModel model);
        Operation<CollectorModel> GetCollectors();
        Operation<CollectorModel> GetCollector(int userId);
        Operation<CollectorModel> UpdateCollector(int userId);
        Operation<ContributeModel> GetContributionInGroup(int groupId, int userId);
        Operation<ContributeModel[]> GetContributionsInGroup(int groupId);

    }
}
