using Contribution.Core.Business;
using Contribution.Data.Entities;
using System;
using System.Collections.Generic;
using System.IO;

namespace Contribution.Core.Interface
{
    public interface IUserManager
    {
        //long CreateUser(User user);
        //UserModel GetUser(int userId);
        //List<UserModel> GetUsers();
        Operation<UserModel[]> GetUsers();
        Operation<UserModel> ValidateUser(string email, string password);
        Operation<long> CreateUser(UserModel model);
        Operation<UserModel> UpdateUser(UserModel model);
        Operation<UserModel> FindUserById(long userId);
        void AddRoleToUser(UserModel model, int roleId);
        Operation<RoleModel[]> GetRoles(int userId);
        Operation<long> AddUser(UserModel model);
        Operation<UserModel> AssignRole(long userId, string roleName);
        IEnumerable<UserRole> GetUserRoles(long userId);
        Role GetRoleByName(string roleName);
        Operation<RoleModel> RemoveRole(int userId, string role);
        Operation ChangePassword(int userId, string password, string newPassword);
        Operation<string> GetProfileImageUri(long userId);
        Operation<string> SetProfileImage(long userId, string mediaType, MemoryStream mstream);

    }
}
