using Chloe.Descriptors;
using Chloe.Exceptions;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Chloe
{
    public static class ChloeDbContextExtension
    {
        /// <summary>
        /// dbContext.Update&lt;TEntity&gt;(a => a.PrimaryKey == key, a => new TEntity() { IsEnabled = false });
        /// </summary>
        /// <typeparam name="TEntity">必须包含 IsEnabled 属性</typeparam>
        /// <param name="dbContext"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static int Disable<TEntity>(this IDbContext dbContext, object key)
        {
            return UpdateIsEnabled<TEntity>(dbContext, key, false);
        }
        /// <summary>
        /// dbContext.Update&lt;TEntity&gt;(a => a.PrimaryKey == key, a => new TEntity() { IsEnabled = true });
        /// </summary>
        /// <typeparam name="TEntity">必须包含 IsEnabled 属性</typeparam>
        /// <param name="dbContext"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static int Enable<TEntity>(this IDbContext dbContext, object key)
        {
            return UpdateIsEnabled<TEntity>(dbContext, key, true);
        }
        /// <summary>
        /// dbContext.Update&lt;TEntity&gt;(a => a.PrimaryKey == key, a => new TEntity() { IsDeleted = true, DeletionTime = deletionTime });
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="dbContext"></param>
        /// <param name="key"></param>
        /// <param name="deletionTime">传 null 则会将 DateTime.Now 值更新至数据库</param>
        /// <returns></returns>
        public static int SoftDelete<TEntity>(this IDbContext dbContext, object key, DateTime? deletionTime = null)
        {
            Type entityType = typeof(TEntity);

            List<MemberBinding> bindings = new List<MemberBinding>();
            bindings.Add(GetMemberAssignment(entityType, "IsDeleted", true, false));
            bindings.Add(GetMemberAssignment(entityType, "DeletionTime", deletionTime ?? DateTime.Now));

            return dbContext.Update<TEntity>(key, bindings);
        }
        /// <summary>
        /// dbContext.Update&lt;TEntity&gt;(a => a.PrimaryKey == key, a => new TEntity() { IsDeleted = true, DeletionTime = DateTime.Now, DeleteUserId = deleteUserId });
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="dbContext"></param>
        /// <param name="key"></param>
        /// <param name="deleteUserId"></param>
        /// <returns></returns>
        public static int SoftDelete<TEntity>(this IDbContext dbContext, object key, object deleteUserId)
        {
            return dbContext.SoftDelete<TEntity>(key, DateTime.Now, deleteUserId);
        }
        /// <summary>
        /// dbContext.Update&lt;TEntity&gt;(a => a.PrimaryKey == key, a => new TEntity() { IsDeleted = true, DeletionTime = deletionTime, DeleteUserId = deleteUserId });
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="dbContext"></param>
        /// <param name="key"></param>
        /// <param name="deletionTime"></param>
        /// <param name="deleteUserId"></param>
        /// <returns></returns>
        public static int SoftDelete<TEntity>(this IDbContext dbContext, object key, DateTime deletionTime, object deleteUserId)
        {
            Type entityType = typeof(TEntity);

            List<MemberBinding> bindings = new List<MemberBinding>();
            bindings.Add(GetMemberAssignment(entityType, "IsDeleted", true, false));
            bindings.Add(GetMemberAssignment(entityType, "DeletionTime", deletionTime));
            bindings.Add(GetMemberAssignment(entityType, "DeleteUserId", deleteUserId));

            return dbContext.Update<TEntity>(key, bindings);
        }


        static Expression<Func<TEntity, bool>> BuildPredicate<TEntity>(object key)
        {
            Utils.CheckNull(key);

            Type entityType = typeof(TEntity);
            TypeDescriptor typeDescriptor = TypeDescriptor.GetDescriptor(entityType);
            if (!typeDescriptor.HasPrimaryKey())
            {
                throw new ChloeException(string.Format("The entity type '{0}' does not define a primary key.", typeDescriptor.EntityType.FullName));
            }

            ParameterExpression parameter = Expression.Parameter(entityType, "a");
            Expression propOrField = Expression.PropertyOrField(parameter, typeDescriptor.PrimaryKey.MemberInfo.Name);
            Expression keyValue = Utils.MakeWrapperAccess(key, typeDescriptor.PrimaryKey.MemberInfoType);
            Expression lambdaBody = Expression.Equal(propOrField, keyValue);

            Expression<Func<TEntity, bool>> predicate = Expression.Lambda<Func<TEntity, bool>>(lambdaBody, parameter);

            return predicate;
        }
        static int UpdateIsEnabled<TEntity>(IDbContext dbContext, object key, bool isEnabled)
        {
            Type entityType = typeof(TEntity);

            List<MemberBinding> bindings = new List<MemberBinding>();
            bindings.Add(GetMemberAssignment(entityType, "IsEnabled", isEnabled, false));

            return dbContext.Update<TEntity>(key, bindings);
        }
        static int Update<TEntity>(this IDbContext dbContext, object key, List<MemberBinding> bindings)
        {
            Type entityType = typeof(TEntity);
            NewExpression newExp = Expression.New(entityType);

            ParameterExpression parameter = Expression.Parameter(entityType, "a");
            Expression lambdaBody = Expression.MemberInit(newExp, bindings);

            Expression<Func<TEntity, TEntity>> lambda = Expression.Lambda<Func<TEntity, TEntity>>(lambdaBody, parameter);
            Expression<Func<TEntity, bool>> condition = BuildPredicate<TEntity>(key);

            return dbContext.Update(condition, lambda);
        }

        static void ThrowIfPropIsNull(Type entityType, PropertyInfo prop, string propName)
        {
            if (prop == null)
                throw new ArgumentException(string.Format("The type '{0}' doesn't define property '{1}'", entityType.FullName, propName));
        }
        static MemberAssignment GetMemberAssignment(Type entityType, string propName, object bindValue, bool makeWrapperAccess = true)
        {
            PropertyInfo prop = entityType.GetProperty(propName);
            ThrowIfPropIsNull(entityType, prop, propName);

            Expression exp = makeWrapperAccess ? Utils.MakeWrapperAccess(bindValue, prop.PropertyType) : Expression.Constant(bindValue, prop.PropertyType);

            MemberAssignment bind = Expression.Bind(prop, exp);

            return bind;
        }
    }
}
