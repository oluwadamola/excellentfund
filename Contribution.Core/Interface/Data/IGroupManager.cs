using Contribution.Core.Business;
using System;

namespace Contribution.Core.Interface.Manager
{
    public interface IGroupManager
    {
        Operation<long> CreateGroup(GroupModel model);
        Operation<GroupModel[]> GetGroups();
        Operation<GroupModel> UpdateGroup(GroupModel model);
        Operation<GroupModel> GetGroup(int id);
        Operation<UserModel[]> GetUsersInGroup(int groupId);
        Operation<UserModel> GetUserInGroup(int groupId, int userId);
        Operation<UserModel[]> AddUserToGroup(int groupId, int userId);
    }
}
