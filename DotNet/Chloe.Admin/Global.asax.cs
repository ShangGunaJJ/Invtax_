using Ace.Application;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Chloe.Admin
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            //throw new BigBigException("由于您未给博主点赞，博主伤心的向您抛了个大大的异常");

            AppServiceFactory.RegisterServices();
            AppServiceFactory.RegisterServicesFromAssembly(Chloe.Application.CurrentAssembly.Value);

            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }
    }

    public class BigBigException : Exception
    {
        public BigBigException(string msg)
            : base(msg)
        {
        }
    }
}
