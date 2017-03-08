using Contribution.Core.Business;
using Contribution.Core.Entities;
using Contribution.Core.Interface.Data;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Web;
using static Contribution.Core.Entities.Role;

namespace Contribution.Core.Manager
{
    public class UserManager : IUserManager
    {
        private IDataRepository _db;
        public UserManager(IDataRepository db)
        {
            _db = db;
        }
        public Operation<long> CreateUser(UserModel model)
        {

            return Operation.Create(() =>
            {
                //Check to see if User Already Exists
                var user = _db.Query<User>().Where(u => u.Email == model.Email).FirstOrDefault();
                if (user != null) throw new Exception("Email Address Already Exist");

                //Create User Record and Encrypt Password
                user = model.Create();
                //user.Password = _enc.Encrypt(user.Password);
                user.Password = model.Password;
                _db.Add<User>(user);

                var roleId = _db.Query<Role>().Where(r => r.RoleName == "SystemAdministrator").Select(r => r.RoleId).FirstOrDefault();
                AddRoleToUser(model, roleId);

                _db.SaveChanges().Throw();
                model.Update(user);
                model.Update(user.Profile);
                return (long)user.UserId;
            });
        }

        public Operation<UserModel> UpdateUser(UserModel model)
        {
            return Operation.Create(() =>
            {
                if (model == null) throw new Exception("No Data recieved");

                var user = _db.Query<User>(_u => _u.Profile)
                    .FirstOrDefault(_u => _u.Email == model.Email);

                if (user == null) throw new Exception("User not Found");
                if (user.Profile == null) throw new Exception("Profile not Found");

                user.Profile.Title = model.Title;
                user.Profile.FirstName = model.FirstName;
                user.Profile.LastName = model.LastName;
                var entity = _db.Update<User>(user);  //.Throw();
                _db.SaveChanges().Throw();
                return new UserModel(entity);
            });
        }

        public Operation<UserModel> ValidateUser(string email, string password)
        {
            return Operation.Create(() =>
            {
                if (string.IsNullOrWhiteSpace(email)) throw new Exception("Email can not be empty");
                var userValid = _db.Query<User>(u => u.Profile).Where(u => u.Email == email && u.Password == password).FirstOrDefault();
                if (userValid == null) throw new Exception("User does not exist");
                var usermodel = new UserModel(userValid);
                return usermodel;
            }
            );
        }

        public Operation<UserModel> FindUserById(long userId)
        {
            return Operation.Create(() =>
            {
                var user = _db.GetByID<User>((int)userId);
                if (user == null) throw new Exception("User not Found");

                var userRoles = _db.Query<UserRole>(ur => ur.Role).Where(ur => ur.UserId == user.UserId).ToList();

                var model = new UserModel(user);
                return model;
            });
        }

        public void AddRoleToUser(UserModel model, int roleId)
        {
            Operation.Create(() =>
            {
                var isExist = _db.Query<UserRole>().Where(ur => ur.RoleId == roleId && ur.UserId == model.UserId).FirstOrDefault();
                if (isExist != null) throw new Exception("Role Already Exist");
                UserRole userrole = new UserRole();
                userrole.UserId = model.UserId;
                userrole.RoleId = roleId;
                _db.Add<UserRole>(userrole);
                _db.SaveChanges();
            });

        }

        public Operation<RoleModel[]> GetRoles(int userId)
        {
            return Operation.Create(() =>
            {
                var query = _db.Query<UserRole>().Where(ur => ur.UserId == userId).Select(ur => ur.RoleId).ToList();
                var roles = new List<RoleModel>();
                foreach (var rolId in query)
                {
                    var role = _db.Query<Role>().Where(r => r.RoleId == rolId).FirstOrDefault();
                    roles.Add(new RoleModel(role));
                }
                return roles.ToArray();
            });

        }
        public Operation<UserModel[]> GetUsers()
        {
            return Operation.Create(() =>
            {
                var users = _db.Query<User>().ToList();
                return users.Select(u => new UserModel(u)).ToArray();
            });
        }
        public Operation<long> AddUser(UserModel model)
        {
            return Operation.Create(() =>
            {
                //Check to see if User Already Exists
                var user = _db.Query<User>().Where(u => u.Email == model.Email).FirstOrDefault();
                if (user != null) throw new Exception("Email Address Already Exist");

                //Create User Record and Encrypt Password
                user = model.Create();
                _db.Add<User>(user);

                var roleId = _db.Query<Role>().Where(r => r.RoleName == AppRole.User.ToString()).Select(r => r.RoleId).FirstOrDefault();
                AddRoleToUser(model, roleId);

                _db.SaveChanges().Throw();
                model.Update(user);
                model.Update(user.Profile);
                return (long)user.UserId;
            });
        }

        public Role GetRoleByName(string roleName)
        {
            return _db.Query<Role>().FirstOrDefault(r => r.RoleName == roleName);
        }

        private User GetUserById(long userId)
        {
            return _db.Query<User>().FirstOrDefault(u => u.UserId == userId);
        }

        public IEnumerable<UserRole> GetUserRoles(long userId)
        {
            var query = from userRole in _db.Query<UserRole>(ur => ur.Role, ur => ur.User)
                        where userRole.UserId == userId
                        select userRole;
            return query.ToArray();
        }

        public Operation<UserModel> AssignRole(long userId, string roleName)
        {
            return Operation.Create(() =>
            {
                var role = GetRoleByName(roleName);
                if (role == null) throw new Exception("Invalid Role");

                var user = GetUserById(userId);
                if (user == null) throw new Exception("Invalid User ID");


                var roles = GetUserRoles(user.UserId);
                var userRoleExists = roles.Select(r => r.RoleId).Contains(role.RoleId);

                if (userRoleExists) throw new Exception($"User already has role: {role.RoleName}");

                //var assignRole = AssignRole(userId, role.Name);
                _db.Add(new UserRole
                {
                    UserId = user.UserId,
                    RoleId = role.RoleId,
                });
                _db.SaveChanges().Throw();

                return new UserModel(user);

            });
        }

        public Operation<RoleModel> RemoveRole(int userId, string roleName)
        {
            return Operation.Create(() =>
            {
                //Get User's Role 
                var userRoles = _db.Query<UserRole>(ur => ur.User, ur => ur.Role)
                     .Where(_ur => _ur.User.UserId == userId)
                     .ToArray();

                //Get Role to delete
                var usrrole = userRoles.Where(ur => string.Equals(ur.Role.RoleName, roleName, StringComparison.OrdinalIgnoreCase))
                                 .FirstOrDefault();


                if (usrrole == null) throw new Exception("User does not have this Role");

                var model = new RoleModel(usrrole.Role);
                _db.Delete(usrrole);
                _db.SaveChanges();
                return model;
            });
        }

        public Operation ChangePassword(int userId, string password, string newpassword)
        {
            return Operation.Create(() =>
            {
                if (string.IsNullOrEmpty(password) || string.IsNullOrEmpty(newpassword)) throw new Exception("Password cannot be empty");
                if (newpassword.Length < 8) throw new Exception("Password should be at least 8 characters");

                //Get User
                var user = GetUserById(userId);
                if (user == null) throw new Exception("Invalid Username/Email");

                user.Password = newpassword; //_hasher.ComputeHash(newpassword, null);
                var entity = _db.Update(user); //.Throw();
                _db.SaveChanges().Throw();
            });
        }

        public Operation<string> GetProfileImageUri(long userId)
        {
            return Operation.Create(() =>
            {
                var profile = _db.Query<User>(_u => _u.Profile)
                    .Where(_u => _u.UserId == userId)
                    .Select(_u => _u.Profile)
                    .FirstOrDefault();
                return profile?.ImageUrl;
            });
        }

        public Operation<string> SetProfileImage(long userId, string mime, MemoryStream data)
        {
            return Operation.Create(() =>
            {
                var user = GetUserById(userId);
                if (user == null) throw new Exception("Invalid UserID");

                //Crop the Image Stream
                var croppedImage = Crop(data, 300, 300);

                var virtualPath = "~/content/images";
                var physicalPath = HttpContext.Current.Server.MapPath(virtualPath);                     // Translate to Physical Path C:\...

                var fileName = user.UserId + ".jpg";
                if (!Directory.Exists(physicalPath)) Directory.CreateDirectory(physicalPath);

                using (var file = File.Create(Path.Combine(physicalPath, fileName)))
                {
                    croppedImage.CopyTo(file);
                }

                var imageLocation = (virtualPath + "/" + fileName).Replace("~", ""); ;

                user.Profile.ImageUrl = imageLocation;
                var profile = _db.Update(user.Profile); //.Throw(); 
                _db.SaveChanges();

                return imageLocation;
            });
        }

        #region Crop Stream
        public MemoryStream Crop(Stream imageStream, int height)
        {
            //Create Output Stream
            var output = new MemoryStream();

            //Get Image from Stream
            using (var image = Image.FromStream(imageStream))
            {
                //Scale Image by Height and Save
                var newImage = Crop(image, height);
                newImage.Save(output, ImageFormat.Jpeg);
            }

            //Reset Stream Pointer
            output.Seek(0, SeekOrigin.Begin);
            return output;
        }

        public MemoryStream Crop(Stream imageStream, int width, int height)
        {
            //Create Output Stream
            var output = new MemoryStream();

            //Get Image from Stream
            using (var image = Image.FromStream(imageStream))
            {
                //Scale Image by Height and Save
                var newImage = Crop(image, width, height);
                newImage.Save(output, ImageFormat.Jpeg);
            }

            //Reset Stream Pointer
            output.Seek(0, SeekOrigin.Begin);
            return output;
        }
        #endregion
        #region Crop Image
        public Image Crop(Image image, int height)
        {
            //Maintain Aspect Ratio
            var width = height * image.Width / (float)image.Width;
            return Crop(image, Convert.ToInt32(width), height);
        }

        public Image Crop(Image imgPhoto, int Width, int Height)
        {
            int sourceWidth = imgPhoto.Width;
            int sourceHeight = imgPhoto.Height;
            int sourceX = 0;
            int sourceY = 0;
            int destX = 0;
            int destY = 0;

            float nPercent = 0;
            float nPercentW = 0;
            float nPercentH = 0;

            nPercentW = Width / (float)sourceWidth;
            nPercentH = Height / (float)sourceHeight;

            if (nPercentH < nPercentW)
            {
                nPercent = nPercentW;
                destY = (int)((Height - (sourceHeight * nPercent)) / 2);
            }
            else
            {
                nPercent = nPercentH;
                destX = (int)((Width - (sourceWidth * nPercent)) / 2);
            }

            int destWidth = (int)(sourceWidth * nPercent);
            int destHeight = (int)(sourceHeight * nPercent);

            Bitmap bmPhoto = new Bitmap(Width, Height, PixelFormat.Format24bppRgb);
            bmPhoto.SetResolution(imgPhoto.HorizontalResolution, imgPhoto.VerticalResolution);

            Graphics grPhoto = Graphics.FromImage(bmPhoto);
            grPhoto.InterpolationMode = InterpolationMode.HighQualityBicubic;

            grPhoto.DrawImage(imgPhoto,
                new Rectangle(destX, destY, destWidth, destHeight),
                new Rectangle(sourceX, sourceY, sourceWidth, sourceHeight),
                GraphicsUnit.Pixel);

            grPhoto.Dispose();
            return bmPhoto;
        }
        #endregion

    }
}
