using Contribution.Core.Business;
using Contribution.Core.Entities;
using Contribution.Core.Interface.Data;
using System;
using System.Linq;

namespace Contribution.Core.Interface.Manager
{

    public class GroupManager : IGroupManager
    {
        private readonly IDataRepository _repo;

        public GroupManager(IDataRepository repo)
        {
            _repo = repo;
        }

        public Operation<long> CreateGroup(GroupModel model)
        {
            return Operation.Create(() =>
            {
                //check if the group exist
                var group = _repo.Query<Group>().Where(g => g.GroupName == model.GroupName).FirstOrDefault();
                if (group != null) throw new Exception("Group Name already exist");

                var entity = new Group { GroupName = model.GroupName };

                _repo.Add<Group>(entity);
                _repo.SaveChanges();

                return (long)model.GroupId;
            });
              
        }

        public Operation<GroupModel> GetGroup(int id)
        {
            return Operation.Create(() =>
            {
                var entity = _repo.GetByID<Group>(id);
                if (entity == null) throw new Exception("User does not exist");
                return new GroupModel(entity);
            });
        }

        public Operation<UserModel[]> GetUsersInGroup(int groupId)
        {
            return Operation.Create(() =>
            {
                var usergroup = _repo.Query<UserGroup>().Where(ug => ug.GroupId == groupId).ToList();
                if (usergroup == null) throw new Exception("No User in this group yet");

                var model = usergroup.Select(ug => new UserModel()
                {
                    UserId = ug.UserId,
                    Email = ug.User.Email,
                    FirstName =  ug.User.Profile.FirstName,
                    LastName = ug.User.Profile.LastName
                })
                
                .ToArray();

                return model;
            });
        }

        public Operation<UserModel> GetUserInGroup(int groupId, int userId)
        {
            return Operation.Create(() =>
            {
                var usergroup = _repo.Query<UserGroup>().Where(ug => ug.GroupId == groupId && ug.UserId == userId).FirstOrDefault();
                if (usergroup == null) throw new Exception("This User is not in this group yet");

                var entity = _repo.GetByID<User>(usergroup.UserId);

                var model = new UserModel()
                {
                    UserId = entity.UserId,
                    Email = entity.Email,
                    FirstName = entity.Profile.FirstName,
                    LastName = entity.Profile.LastName,
                    ImageUrl = entity.Profile.ImageUrl,
                    Gender= entity.Profile.Gender,
                    Title= entity.Profile.Title,
                    PhoneNumber= entity.Profile.PhoneNumber
                };
                return model;
            });
        }

        public Operation<GroupModel[]> GetGroups()
        {
            return Operation.Create(() => {

              var groups =  _repo.Query<Group>().ToList();
              var model = groups.Select(g => new GroupModel(g)).ToArray();

                return model;
            });
        }

        public Operation<GroupModel> UpdateGroup(GroupModel model)
        {
            return Operation.Create(() =>
            {
                if (model == null) throw new Exception("No Data Received");
                
                var group = _repo.Query<Group>().Where(g => g.GroupId == model.GroupId).FirstOrDefault();
                if (group == null) throw new Exception("Group not found");

                group.GroupName = model.GroupName;

                var entity = _repo.Update<Group>(group);
                _repo.SaveChanges();

                return new GroupModel(entity);
            });
        }

        public Operation<UserModel[]> AddUserToGroup(int groupId, int userId)
        {
            return Operation.Create(() =>
            {
                //check if group exist
                var group = _repo.Query<Group>().Where(g => g.GroupId == groupId).FirstOrDefault();
                if (group == null) throw new Exception("This Group does not exist");


                //check if user exist
                var user = _repo.Query<User>().Where(u => u.UserId == userId).FirstOrDefault();
                if (user == null) throw new Exception("This User does not exit ");

                var usergrp = _repo.Query<UserGroup>().Where(ug => ug.GroupId == groupId && ug.UserId == userId).FirstOrDefault();
                if (usergrp != null) throw new Exception("This User is already in this group ");

                var entity = new UserGroup
                {
                    
                    GroupId = groupId,
                    UserId = userId
                };
                         
                _repo.Add<UserGroup>(entity);
                _repo.SaveChanges().Unwrap();

                var userids = _repo.Query<UserGroup>().Where(ug => ug.UserGroupId == groupId).Select(ug => ug.UserId).ToList();
                var users = _repo.Query<User>().Where(u => userids.Contains(u.UserId)).ToList();
                var usermodel = users.Select(u => new UserModel(u)).ToArray();

                return usermodel;

            });
        }

        public Operation<GroupModel[]> GetUserGroup(int userId)
        {
            return Operation.Create(() =>
            {
                var groupIds = _repo.Query<UserGroup>().Where(ug => ug.UserId == userId).ToList().Select(ug => ug.GroupId);
                var groups = _repo.Query<Group>().Where(g => groupIds.Contains(g.GroupId)).ToList();
                var groupmodel = groups.Select(g => new GroupModel(g)).ToArray();
                return groupmodel;
            });
        }

    }
}
