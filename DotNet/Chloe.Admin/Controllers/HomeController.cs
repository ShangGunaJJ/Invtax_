using Ace;
using Chloe.Admin.Common;
using Chloe.Application;
using Chloe.Application.Interfaces.System;
using Chloe.Entities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Chloe.Admin.Controllers
{
    [LoginAuthorizeAttribute]
    public class HomeController : WebController
    {
        // GET: Home
        public ActionResult Index()
        {
            this.ViewBag.CurrentSession = this.CurrentSession;
            this.ViewBag.CompanyName = this.CurrentSession.CompanyName;
            this.ViewBag.ClassName = "theme-blue";
            if (!string.IsNullOrEmpty(this.CurrentSession.ThemeName)) {
                this.ViewBag.ClassName = this.CurrentSession.ThemeName;
            }
            return View();
        }
        public ActionResult Default()
        {
            this.ViewBag.CurrentSession = this.CurrentSession;
            return View();
        }
        public ActionResult Home() {
            this.ViewBag.CurrentSession = this.CurrentSession;
            var InvService = this.CreateService<IInvAppService>();
            int special; int ordinary; int electronic; int ordinaryG;
            InvService.GetInvTypeNum(out special, out ordinary, out electronic, out ordinaryG);
            this.ViewBag.special = special;
            this.ViewBag.ordinary = ordinary;
            this.ViewBag.electronic = electronic;
            this.ViewBag.ordinaryG = ordinaryG;
            var CompanyAppService = this.CreateService<ICompanyAppService>();
            int userPages = CompanyAppService.GetUserPages();

            inv_company com = CompanyAppService.GetUserCompany();

            this.ViewBag.totle = com.totlePage;
            this.ViewBag.UseTotle = userPages;
            this.ViewBag.remaining = com.totlePage - userPages;
            this.ViewBag.Con = InvService.GetNotice();

            return View();
        }
        [HttpGet]
        public ActionResult GetClientsDataJson()
        {
            var data = new
            {
                //dataItems = this.GetDataItemList(),
                //organize = this.GetOrganizeList(),
                //role = this.GetRoleList(),
                //duty = this.GetDutyList(),
                user = "",
                authorizeMenu = this.GetMenuList(),
                //authorizeButton = this.GetMenuButtonList(),
            };
            return this.SuccessData(data);
        }

        object GetMenuList()
        {
            var roleId = this.CurrentSession.RoleId;
            var service = this.CreateService<IRoleAuthorizeAppService>();
            List<Sys_Module> menuList = service.GetMenuList(roleId);

            menuList.ForEach(a =>
            {
                if (a.UrlAddress.IsNotNullOrEmpty())
                {
                    a.UrlAddress = this.Url.Content(a.UrlAddress);
                }
            });

            return this.ToMenuJson(menuList, null);
        }
        string ToMenuJson(List<Sys_Module> data, string parentId)
        {
            StringBuilder sbJson = new StringBuilder();
            sbJson.Append("[");
            List<Sys_Module> entities = data.FindAll(t => t.ParentId == parentId);
            if (entities.Count > 0)
            {
                foreach (var item in entities)
                {
                    string strJson = JsonHelper.Serialize(item);
                    strJson = strJson.Insert(strJson.Length - 1, ",\"ChildNodes\":" + ToMenuJson(data, item.Id) + "");
                    sbJson.Append(strJson + ",");
                }
                sbJson = sbJson.Remove(sbJson.Length - 1, 1);
            }
            sbJson.Append("]");
            return sbJson.ToString();
        }
    }
}