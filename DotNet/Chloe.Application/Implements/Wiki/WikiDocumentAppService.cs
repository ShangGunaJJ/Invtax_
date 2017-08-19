using Ace;
using Ace.IdStrategy;
using Chloe.Application.Interfaces;
using Chloe.Application.Interfaces.Wiki;
using Chloe.Application.Models.WikiDocument;
using Chloe.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application.Implements.Wiki
{
    public class WikiDocumentAppService : AdminAppService, IWikiDocumentAppService
    {
        public WikiDocumentDetailModel GetDetailModel(string id)
        {
            var details = this.DbContext.Query<WikiDocumentDetail>().FilterDeleted();
            WikiDocumentDetailModel model = details.Select(a => new WikiDocumentDetailModel() { Id = a.Id, Title = a.Title, Summary = a.Summary, HtmlContent = a.HtmlContent }).Where(a => a.Id == id).FirstOrDefault();

            return model;
        }

        public string Add(AddDocumentInput input)
        {
            input.Validate();

            WikiDocumentDetail detail = new WikiDocumentDetail();
            detail.Id = IdHelper.CreateSnowflakeId().ToString();

            detail.Title = input.Title;
            detail.Summary = input.Summary;
            detail.Tag = input.Tag;

            detail.IsDeleted = false;
            detail.CreationTime = DateTime.Now;

            detail.HtmlContent = input.HtmlContent;
            detail.MarkdownCode = input.MarkdownCode;

            this.DbContext.Insert(detail);

            return detail.Id;
        }
        public void Update(UpdateDocumentInput input)
        {
            input.Validate();

            DateTime updationTime = DateTime.Now;
            this.DbContext.Update<WikiDocumentDetail>(a => a.Id == input.Id, a => new WikiDocumentDetail() { Title = input.Title, Summary = input.Summary, HtmlContent = input.HtmlContent, MarkdownCode = input.MarkdownCode, Tag = input.Tag, UpdationTime = updationTime });
        }

        public List<WikiDocument> GetAll()
        {
            var q = this.DbContext.Query<WikiDocument>().FilterDeleted();
            return q.ToList();
        }
        public PagedData<WikiDocument> GetPageData(Pagination page, string keyword)
        {
            var q = this.DbContext.Query<WikiDocument>().FilterDeleted().WhereIfNotNullOrEmpty(keyword, a => a.Title.Contains(keyword) || a.Tag.Contains(keyword));

            var pagedData = q.TakePageData(page);

            return pagedData;
        }
        public WikiDocumentDetail GetDocumentDetail(string id)
        {
            var doc = this.DbContext.QueryByKey<WikiDocumentDetail>(id);
            return doc;
        }
    }
}
