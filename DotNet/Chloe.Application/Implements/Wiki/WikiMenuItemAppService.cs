using Chloe.Application.Interfaces;
using Chloe.Application.Models.WikiMenuItem;
using Chloe.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ace.Application;
using Ace.Exceptions;
using Chloe.Application.Interfaces.Wiki;

namespace Chloe.Application.Implements.Wiki
{
    public class WikiMenuItemAppService : AdminAppService, IWikiMenuItemAppService
    {
        public List<WikiMenuItem> GetWikiMenuItems()
        {
            List<WikiMenuItem> menuItems = this.DbContext.Query<WikiMenuItem>().ToList();

            return menuItems;
        }
        public List<WikiMenuItem> GetRootWikiMenuItems()
        {
            List<WikiMenuItem> menuItems = this.DbContext.Query<WikiMenuItem>().Where(a => a.ParentId == null).OrderBy(a => a.SortCode).ToList();
            return menuItems;
        }
        public List<WikiMenuItem_WikiDocument> GetWikiMenuItem_Documents()
        {
            var items = this.DbContext.Query<WikiMenuItem>();
            var docs = this.DbContext.Query<WikiDocument>();

            var q = items.LeftJoin(docs, (menuItem, doc) => menuItem.DocumentId == doc.Id);

            var ret = q.Select((menuItem, doc) => new WikiMenuItem_WikiDocument() { MenuItem = menuItem, Document = doc }).ToList();

            return ret;
        }

        public WikiMenuItem Add(AddWikiMenuItemInput input)
        {
            WikiMenuItem entity = new WikiMenuItem();

            entity.Id = this.CreateId();
            entity.ParentId = input.ParentId;
            entity.Name = input.Name;
            entity.DocumentId = input.DocumentId;
            entity.IsEnabled = input.IsEnabled;
            entity.SortCode = input.SortCode;

            entity.CreationTime = DateTime.Now;

            this.DbContext.Insert(entity);

            return entity;
        }

        public void Update(UpdateWikiMenuItemInput input)
        {
            input.Validate();

            this.DbContext.Update<WikiMenuItem>(a => a.Id == input.Id, a => new WikiMenuItem()
            {
                ParentId = input.ParentId,
                Name = input.Name,
                DocumentId = input.DocumentId,
                IsEnabled = input.IsEnabled,
                SortCode = input.SortCode,
            });
        }
        public void Delete(string id)
        {
            id.NotNullOrEmpty();

            bool existsChildren = this.DbContext.Query<WikiMenuItem>(a => a.ParentId == id).Any();
            if (existsChildren)
                throw new InvalidDataException("删除失败！操作的对象包含了下级数据");

            this.DbContext.DeleteByKey<WikiMenuItem>(id);
        }
    }
}
