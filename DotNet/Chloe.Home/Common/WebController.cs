using Ace.Application;
using Ace.Attributes;
using Ace.Web.Mvc;
using Chloe.Application;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Chloe.Home.Common
{
    public abstract class WebController : BaseController
    {
        [Disposable]
        IAppServiceFactory _appServicesFactory;
        IAppServiceFactory AppServicesFactory
        {
            get
            {
                if (this._appServicesFactory == null)
                    _appServicesFactory = new AppServiceFactory(null);
                return this._appServicesFactory;
            }
        }


        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            bool obsolete = filterContext.ActionDescriptor.IsDefined(typeof(ObsoleteApiAttribute), false);
            if (obsolete)
            {
                ObsoleteApiAttribute attr = filterContext.ActionDescriptor.GetCustomAttributes(typeof(ObsoleteApiAttribute), false).FirstOrDefault() as ObsoleteApiAttribute;
                if (attr != null)
                {
                    filterContext.Result = this.FailedMsg(attr.Message);
                }
            }

            obsolete = filterContext.ActionDescriptor.ControllerDescriptor.IsDefined(typeof(ObsoleteApiAttribute), false);

            if (obsolete)
            {
                ObsoleteApiAttribute attr = filterContext.ActionDescriptor.ControllerDescriptor.GetCustomAttributes(typeof(ObsoleteApiAttribute), false).FirstOrDefault() as ObsoleteApiAttribute;
                if (attr != null)
                {
                    filterContext.Result = this.FailedMsg(attr.Message);
                }
            }

            base.OnActionExecuting(filterContext);
        }
        protected override void OnException(ExceptionContext filterContext)
        {
            if (filterContext.ExceptionHandled)
                return;

            /* 记录异常日志 */

            filterContext.Result = this.InternalError();
            filterContext.ExceptionHandled = true;
        }


        protected T CreateService<T>(bool managed = true) where T : IAppService
        {
            return this.AppServicesFactory.CreateService<T>(managed);
        }

        protected ActionResult InternalError()
        {
            this.Response.StatusCode = 500;
            this.Server.ClearError();
            return View("~/Views/Shared/Error.cshtml");
        }
        protected ActionResult NotFound()
        {
            this.Response.StatusCode = 404;
            return View("~/Views/Shared/NotFound.cshtml");
        }
    }
}