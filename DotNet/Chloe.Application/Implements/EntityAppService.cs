using Chloe.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application.Implements
{
    public class EntityAppService : AppServiceBase, IEntityAppService
    {
        public T GetByKey<T>(object key) where T : new()
        {
            return this.DbContext.QueryByKey<T>(key);
        }
        public List<T> GetList<T>() where T : new()
        {
            return this.DbContext.Query<T>().ToList();
        }
        public List<T> GetList<T>(Expression<Func<T, bool>> predicate) where T : new()
        {
            return this.DbContext.Query<T>(predicate).ToList();
        }
        public int Delete<T>(Expression<Func<T, bool>> predicate)
        {
            return this.DbContext.Delete(predicate);
        }
        public int Delete<T>(T entity)
        {
            return this.DbContext.Delete(entity);
        }
        public int DeleteByKey<T>(object key)
        {
            key.NotNullOrEmpty("key 不能为空");
            return this.DbContext.DeleteByKey<T>(key);
        }
        public int SoftDelete<T>(object key)
        {
            key.NotNullOrEmpty("key 不能为空");
            return this.DbContext.SoftDelete<T>(key);
        }
        public T Insert<T>(T entity)
        {
            return this.DbContext.Insert(entity);
        }
        public int Update<T>(T entity)
        {
            return this.DbContext.Update(entity);
        }
    }
}
