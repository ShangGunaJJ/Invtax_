using Ace;
using Chloe.Admin.Common;
using Chloe.Application.Interfaces;
using Chloe.Application.Interfaces.System;
using Chloe.Application.Models.Duty;
using Chloe.Application.Models.Role;
using Chloe.Application.Models.User;
using Chloe.Entities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;

namespace Chloe.Admin.Areas.SystemManage.Controllers
{
    [LoginAuthorizeAttribute]
    public class UserController : WebController
    {
        // GET: SystemManage/User
        public ActionResult Index()
        {
            List<SelectOption> CompanyList = SelectOption.CreateList(this.CreateService<ICompanyAppService>().GetSimpleModels());
            List<SelectOption> dutyModelList = SelectOption.CreateList(this.CreateService<IUserAppService>().GetSimpleModels());

            List<SelectOption> roleList = SelectOption.CreateList(this.CreateService<IRoleAppService>().GetSimpleModels());

            this.ViewBag.CompanyList = CompanyList;
            this.ViewBag.UserList = dutyModelList;
            this.ViewBag.RoleList = roleList;

            return View();
        }

        [HttpGet]
        public ActionResult GetModels(Pagination pagination, string keyword)
        {
            PagedData<inv_users> pagedData = this.CreateService<IUserAppService>().GetPageData(pagination, keyword);
            return this.SuccessData(pagedData);
        }


        [HttpPost]
        public ActionResult Add(AddUserInput input)
        {
            this.CreateService<IUserAppService>().AddUser(input);
            return this.AddSuccessMsg();
        }
        [HttpPost]
        public ActionResult Update(UpdateUserInput input)
        {
            this.CreateService<IUserAppService>().UpdateUser(input);
            return this.UpdateSuccessMsg();
        }


        [HttpPost]
        public ActionResult Delete(string id)
        {
            this.CreateService<IUserAppService>().DeleteAccount(id);
            return this.DeleteSuccessMsg();
        }

        [HttpGet]
        public ActionResult RevisePassword()
        {
            return View();
        }
        [HttpPost]
        public ActionResult RevisePassword(string userId, string newPassword)
        {
            if (userId.IsNullOrEmpty())
                return this.FailedMsg("userId 不能为空");

            this.CreateService<IUserAppService>().RevisePassword(userId, newPassword);
            return this.SuccessMsg("重置密码成功");
        }
    }
}