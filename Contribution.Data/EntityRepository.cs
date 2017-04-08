using Contribution.Data.Interface;
using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Linq;
using System.Linq.Expressions;

namespace Contribution.Core
{
    public class EntityRepository : IDataRepository
    {
        private readonly DbContext _dbContext;

        public EntityRepository(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IQueryable<T> Query<T>() where T : class
        {
            return _dbContext.Set<T>();
        }

        public IQueryable<T> Query<T>(params Expression<Func<T, object>>[] includeProperties) where T : class
        {
            IQueryable<T> query = Query<T>();
            foreach (var includeProperty in includeProperties)
            {
                query = query.Include(includeProperty);
            }
            return query;
        }

        public T GetByID<T>(int id) where T : class
        {
            return _dbContext.Set<T>().Find(id);
        }

        public void Add<T>(T item) where T : class
        {
            _dbContext.Set<T>().Add(item);
        }

        public void Delete<T>(T item) where T : class
        {
            _dbContext.Set<T>().Remove(item);
        }

        public T Update<T>(T entity) where T : class
        {
            if (_dbContext.Entry(entity).State == EntityState.Detached)
            {
                _dbContext.Set<T>().Attach(entity);
            }
            _dbContext.Entry(entity).State = EntityState.Modified;
            return entity;
        }

        public Operation SaveChanges()
        {
            var operation = new Operation();
            try
            {
                _dbContext.SaveChanges();
                operation.Succeeded = true;
                operation.Message = "Changes were Saved Successfully";
            }
            catch (DbEntityValidationException dbe)
            {
                operation = new Operation(dbe);
                string message = "An Error occured Saving: ";
                foreach (var ex in dbe.EntityValidationErrors)
                {
                    //Aggregate Errors
                    string errors = ex.ValidationErrors.Select(e => e.ErrorMessage).Aggregate((ag, e) => ag + " " + e);
                    message += errors;
                }
                operation.Message = message;
                operation.Succeeded = false;
            }
            catch (DbUpdateException uex)
            {
                operation = new Operation(uex);
                Exception ex = uex;
                while (ex.InnerException != null)
                {
                    ex = ex.InnerException;
                }

                var message = "Could not save: " + ex.Message;
                operation.Message = message;
                operation.Succeeded = false;
            }
            catch (Exception ex)
            {
                operation = new Operation(ex);
                while (ex.InnerException != null)
                {
                    ex = ex.InnerException;
                }
                var message = "Could not save: " + ex.Message;
                operation.Message = message;
                operation.Succeeded = false;
            }
            return operation;
        }
    }

}
