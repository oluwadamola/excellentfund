using Contribution.Core.Business;
using System;

namespace Contribution.Core.Interface.Data
{
    public interface ICollectorManager
    {
        Operation<CollectorModel[]> GetCollectorsInGroup(int groupId);
        Operation<long> AddCollectorToGroup(int userId, int monthId, int groupId);
    }
}
