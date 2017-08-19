using Ace.IdStrategy;
using Chloe.Admin.Common.Tree;
using Chloe.Application.Interfaces;
using Chloe.Application.Interfaces.System;
using Chloe.Application.Models.Module;
using Chloe.Entities;
using Chloe.Admin.Common;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Chloe.Admin.Areas.SystemManage.Controllers
{
    [LoginAuthorizeAttribute]
    public class ModuleController : WebController
    {
        // GET: SystemManage/Module
        public ActionResult Index()
        {
            var data = this.CreateService<IModuleAppService>().GetList();
            var treeList = new List<TreeSelectModel>();

            foreach (Sys_Module item in data)
            {
                TreeSelectModel treeModel = new TreeSelectModel();
                treeModel.id = item.Id;
                treeModel.text = item.Name;
                treeModel.parentId = item.ParentId;
                treeList.Add(treeModel);
            }

            this.ViewBag.Menus = TreeHelper.ConvertToJson(treeList);
            return View();
        }

        public ActionResult GetModels(string keyword)
        {
            var data = this.CreateService<IModuleAppService>().GetList();
            if (!string.IsNullOrEmpty(keyword))
            {
                data = TreeHelper.TreeWhere(data, a => a.Name.Contains(keyword), a => a.Id, a => a.ParentId);
            }

            List<DataTableTree> ret = new List<DataTableTree>();
            DataTableTree.AppendChildren(data, ref ret, null, 0, a => a.Id, a => a.ParentId);

            return this.SuccessData(ret);
        }

        [HttpPost]
        public ActionResult Add(AddModuleInput input)
        {
            this.CreateService<IModuleAppService>().Add(input);
            return this.AddSuccessMsg();
        }
        [HttpPost]
        public ActionResult Update(UpdateModuleInput input)
        {
            this.CreateService<IModuleAppService>().Update(input);
            return this.UpdateSuccessMsg();
        }

        [HttpPost]
        public ActionResult Delete(string id)
        {
            if (id.IsNullOrEmpty())
                return this.FailedMsg("id 不能为空");

            this.CreateService<IModuleAppService>().DeleteById(id);
            return this.DeleteSuccessMsg();
        }

    }
}