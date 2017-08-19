using Ace.IdStrategy;
using Chloe.Application.Interfaces;
using Chloe.Application.Interfaces.System;
using Chloe.Application.Models.Role;
using Chloe.Entities;
using Chloe.Admin.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Chloe.Admin.Areas.SystemManage.Controllers
{
    [LoginAuthorizeAttribute]
    public class RoleController : WebController
    {
        // GET: SystemManage/Role
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult GetModels(string keyword)
        {
            List<Sys_Role> data = this.CreateService<IRoleAppService>().GetRoles(keyword);
            return this.SuccessData(data);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public ActionResult Add(AddRoleInput input)
        {
            this.CreateService<IRoleAppService>().Add(input);
            return this.AddSuccessMsg();
        }
        [HttpPost]
        //[ValidateAntiForgeryToken]
        public ActionResult Update(UpdateRoleInput input)
        {
            this.CreateService<IRoleAppService>().Update(input);
            return this.UpdateSuccessMsg();
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public ActionResult Delete(string id)
        {
            this.CreateService<IRoleAppService>().Delete(id);
            return this.DeleteSuccessMsg();
        }
    }
}