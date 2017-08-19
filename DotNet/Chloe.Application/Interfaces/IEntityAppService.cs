using Ace.Application;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application.Interfaces
{
    /// <summary>
    /// 对单个实体的简单操作。Tips：如涉及多表操作，请另写额外应用服务事务控制。
    /// </summary>
    public interface IEntityAppService : IAppService
    {
        T GetByKey<T>(object key) where T : new();
        List<T> GetList<T>() where T : new();
        List<T> GetList<T>(Expression<Func<T, bool>> predicate) where T : new();
        int Delete<T>(Expression<Func<T, bool>> predicate);
        int Delete<T>(T entity);
        int DeleteByKey<T>(object key);
        int SoftDelete<T>(object key);
        T Insert<T>(T entity);
        int Update<T>(T entity);
    }
}
