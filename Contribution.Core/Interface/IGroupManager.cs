using Contribution.Core.Business;
using System;
using System.IO;

namespace Contribution.Core.Interface.Manager
{
    public interface IGroupManager
    {
        Operation<long> CreateGroup(GroupModel model);
        Operation<GroupModel[]> GetGroups();
        Operation<GroupModel> UpdateGroup(GroupModel model);
        Operation<GroupModel> GetGroup(int id);
        Operation<UserModel[]> GetUsersInGroup(int groupId);
        Operation<UserModel[]> GetUsersInGroup(int groupId, int offset, int limit);
        Operation<long> GetUserInGroupCount(int groupId);
        Operation<UserModel[]> AddUserToGroup(int groupId, int userId);
        Operation<GroupModel[]> GetUserGroup(int userId);
        Operation UploadUsers(int groupId, Stream userStream);
    }
}
