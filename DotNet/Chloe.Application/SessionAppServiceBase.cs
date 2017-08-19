using Ace;
using Ace.Application;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application
{
    public abstract class SessionAppServiceBase<TSession> : AppServiceBase, IAceSessionAppService where TSession : class, IAceSession
    {
        protected SessionAppServiceBase()
            : this(null, null)
        {
        }
        protected SessionAppServiceBase(IAppServiceFactory serviceFactory, IAceSession session)
            : base(serviceFactory)
        {
            this.ServiceFactory = serviceFactory;
            this.AceSession = session;
        }

        public IAceSession AceSession
        {
            get
            {
                return this.Session;
            }
            set
            {
                if (value == null)
                {
                    this.Session = null;
                    return;
                }

                TSession s = value as TSession;
                if (s == null)
                    throw new ArgumentException();

                this.Session = s;
            }
        }
        public TSession Session { get; set; }
    }

}
