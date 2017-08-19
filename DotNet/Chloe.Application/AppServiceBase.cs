using Ace;
using Ace.Application;
using Ace.IdStrategy;
using Chloe;
using Chloe.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application
{
    public abstract class AppServiceBase : IAppServiceFactoryProvider, IDisposable
    {
        IDbContext _dbContext;

        protected AppServiceBase()
            : this(null)
        {
        }
        protected AppServiceBase(IAppServiceFactory serviceFactory)
        {
            this.ServiceFactory = serviceFactory;
        }

        public IAppServiceFactory ServiceFactory { get; set; }
        public IDbContext DbContext
        {
            get
            {
                if (this._dbContext == null)
                    this._dbContext = DbContextFactory.CreateContext();
                return this._dbContext;
            }
            set
            {
                this._dbContext = value;
            }
        }

        public Task DoAsync(Action<IDbContext> act, bool? startTransaction = null)
        {
            return Task.Run(() =>
            {
                using (var dbContext = DbContextFactory.CreateContext())
                {
                    if (startTransaction.HasValue && startTransaction.Value == true)
                    {
                        dbContext.DoWithTransaction(() =>
                        {
                            act(dbContext);
                        });
                    }
                    else
                    {
                        act(dbContext);
                    }
                }
            });
        }

        public void Dispose()
        {
            if (this._dbContext != null)
            {
                this._dbContext.Dispose();
            }
            this.Dispose(true);
        }

        protected virtual void Dispose(bool disposing)
        {
        }
    }
}
