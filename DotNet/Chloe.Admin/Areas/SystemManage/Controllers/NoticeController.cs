using Ace.IdStrategy;
using Chloe.Admin.Common.Tree;
using Chloe.Application.Interfaces;
using Chloe.Application.Interfaces.System;
using Chloe.Application.Models.User;
using Chloe.Entities;
using Chloe.Admin.Common;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using Ace;
using System.Text;
namespace Chloe.Admin.Areas.SystemManage.Controllers
{
    [LoginAuthorizeAttribute]
    public class NoticeController : WebController
    {
        public ActionResult Index()
        {
            var InvService = this.CreateService<IInvAppService>();
            this.ViewBag.Con = InvService.GetNotice();
            return View();
        }
        [HttpPost]
        public ActionResult Updata(string con)
        {
            var InvService = this.CreateService<IInvAppService>();
            InvService.SetNotice(con);
            var result = Result.CreateResult<object>(ResultStatus.OK, null);
            result.Msg = "修改成功！";
            return this.JsonContent(result);
        }

    }
}