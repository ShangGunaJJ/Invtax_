using Ace;
using Chloe.Application.Interfaces;
using Chloe.Application.Interfaces.Wiki;
using Chloe.Application.Models.WikiDocument;
using Chloe.Entities;
using Chloe.Admin.Common;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Chloe.Admin.Areas.WikiManage.Controllers
{
    [LoginAuthorizeAttribute]
    public class WikiDocumentController : WebController
    {
        // GET: Wiki
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Document(string id)
        {
            DocumentModel doc = new DocumentModel();

            if (id != null)
            {
                IWikiDocumentAppService service = this.CreateService<IWikiDocumentAppService>();
                WikiDocumentDetail detail = service.GetDocumentDetail(id);

                if (detail == null)
                {
                    /* 404 */
                }

                doc.Id = detail.Id;
                doc.Title = detail.Title;
                doc.Tag = detail.Tag;
                doc.Summary = detail.Summary;
                doc.MarkdownCode = detail.MarkdownCode;
            }

            this.ViewBag.Doc = doc;

            return View();
        }
        public ActionResult GetModels(Pagination pagination, string keyword)
        {
            PagedData<WikiDocument> pagedData = this.CreateService<IWikiDocumentAppService>().GetPageData(pagination, keyword);
            return this.SuccessData(pagedData);
        }
        public ActionResult GetDocument(string id)
        {
            IWikiDocumentAppService service = this.CreateService<IWikiDocumentAppService>();
            WikiDocumentDetail doc = service.GetDocumentDetail(id);
            return this.SuccessData(doc);
        }

        public ActionResult Test(long? id)
        {
            return this.SuccessData(id);
        }

        [HttpPost]
        [System.Web.Mvc.ValidateInput(false)]
        public ActionResult Add(AddDocumentInput input)
        {
            IWikiDocumentAppService service = this.CreateService<IWikiDocumentAppService>();
            string id = service.Add(input);
            return this.SuccessData(id);
        }

        [HttpPost]
        [System.Web.Mvc.ValidateInput(false)]
        public ActionResult Update(UpdateDocumentInput input)
        {
            IWikiDocumentAppService service = this.CreateService<IWikiDocumentAppService>();
            service.Update(input);
            return this.SuccessMsg("更新成功");
        }
        [HttpPost]
        public ActionResult Delete(string id)
        {
            IEntityAppService service = this.CreateService<IEntityAppService>();
            service.SoftDelete<WikiDocument>(id);
            return this.SuccessMsg("删除成功");
        }
    }

    public class DocumentModel
    {
        public string Id { get; set; }/* 由于 */
        public string Title { get; set; }
        public string Tag { get; set; }
        public string Summary { get; set; }
        public string MarkdownCode { get; set; }
        //public long? Id { get; set; }
    }
}