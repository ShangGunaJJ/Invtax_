using Ace.Application;
using Ace.Attributes;
using Ace.Exceptions;
using Ace.Web.Mvc;
using Chloe.Admin.Common;
using Chloe.Application;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace Chloe.Admin.Common
{
    public abstract class WebController : BaseController
    {
        [Disposable]
        AppServiceFactory _appServicesFactory;
        IAppServiceFactory AppServicesFactory
        {
            get
            {
                if (this._appServicesFactory == null)
                    this._appServicesFactory = new AppServiceFactory(this.CurrentSession);
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

            //执行过程出现未处理异常
            Exception ex = filterContext.Exception;

#if DEBUG
            if (filterContext.HttpContext.Request.IsAjaxRequest())
            {
                string msg = null;

                if (ex is Ace.Exceptions.InvalidDataException)
                {
                    msg = ex.Message;
                    filterContext.Result = this.FailedMsg(msg);
                    filterContext.ExceptionHandled = true;
                    return;
                }
            }

            return;
#endif

            if (filterContext.HttpContext.Request.IsAjaxRequest())
            {
                string msg = null;

                if (ex is InvalidDataException)
                {
                    msg = ex.Message;
                }
                else
                {
                    //TODO 将错误记录进日志
                    msg = "服务器错误";
                }

                filterContext.Result = this.FailedMsg(msg);
                filterContext.ExceptionHandled = true;
                return;
            }
            else
            {
                //对于非 ajax 请求
                //TODO 将错误记录进日志

                HttpStatusCodeResult internalServerErrorResult = new HttpStatusCodeResult(HttpStatusCode.InternalServerError);
                filterContext.Result = internalServerErrorResult;
                filterContext.ExceptionHandled = true;
                return;
            }
        }


        AdminSession _session;
        public AdminSession CurrentSession
        {
            get
            {
                if (this._session != null)
                    return this._session;

                AdminSession session = WebUtils.GetCurrentSession();
                this._session = session;
                return session;
            }
            set
            {
                AdminSession session = value;
                WebUtils.SetSession(session);

                if (this._appServicesFactory != null)
                {
                    this._appServicesFactory.Session = session;
                }

                this._session = session;
            }
        }

        protected T CreateService<T>(bool managed = true) where T : IAppService
        {
            return this.AppServicesFactory.CreateService<T>(managed);
        }
    }
}