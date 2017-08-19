using Ace.Application;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Timers;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Chloe.Home
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
           // throw new BigBigException("由于您未给博主点赞，博主伤心的向您抛了个大大的异常");

            AppServiceFactory.RegisterServices();
            AppServiceFactory.RegisterServicesFromAssembly(Chloe.Application.CurrentAssembly.Value);

            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }
        protected void Application_End()
        {
        }

        //protected void Application_Error()
        //{
        //}
    }

    public class BigBigException : Exception
    {
        public BigBigException(string msg)
            : base(msg)
        {
        }
    }
}
