using Chloe.Admin.Common.Tree;
using Chloe.Application.Interfaces.System;
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
    public class RoleAuthorizeController : WebController
    {
        // GET: SystemManage/RoleAuthorize
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetPermissionTree(string roleId)
        {
            var moduledata = this.CreateService<IModuleAppService>().GetList();
            var authorizedata = new List<Sys_RoleAuthorize>();
            if (!string.IsNullOrEmpty(roleId))
            {
                authorizedata = this.CreateService<IRoleAuthorizeAppService>().GetList(roleId);
            }
            var treeList = new List<TreeViewModel>();
            foreach (Sys_Module module in moduledata)
            {
                TreeViewModel tree = new TreeViewModel();
                bool hasChildren = moduledata.Any(a => a.ParentId == module.Id);
                tree.Id = module.Id;
                tree.Text = module.Name;
                tree.Value = module.EnCode;
                tree.ParentId = module.ParentId;
                tree.Isexpand = true;
                tree.Complete = true;
                tree.Showcheck = true;
                tree.Checkstate = authorizedata.Count(t => t.ModuleId == module.Id);
                tree.HasChildren = hasChildren;
                tree.Img = module.Icon == "" ? "" : module.Icon;
                treeList.Add(tree);
            }

            return Content(TreeHelper.ConvertToJson(treeList));
        }
    }
}