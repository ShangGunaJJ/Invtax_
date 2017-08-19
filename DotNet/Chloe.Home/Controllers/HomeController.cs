using Chloe.Application.Interfaces;
using Chloe.Application.Interfaces.Wiki;
using Chloe.Application.Models.WikiDocument;
using Chloe.Home.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Chloe.Home.Controllers
{
    public class HomeController : WebController
    {
        // GET: Home
        [OutputCache(Duration = WebConsts.PageOutputCacheDuration)]
        public ActionResult Index()
        {
            return View();
        }

        [OutputCache(Duration = WebConsts.PageOutputCacheDuration, VaryByParam = "id")]
        public ActionResult UpgradeNotes(string id)
        {
            string docId = id;

            WikiDocumentDetailModel model = this.CreateService<IWikiDocumentAppService>().GetDetailModel(docId);

            if (model == null)
            {
                /* 404 */
                return this.NotFound();
            }

            this.ViewBag.Document = model;
            return View();
        }
    }
}