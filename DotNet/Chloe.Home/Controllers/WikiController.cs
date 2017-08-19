using Chloe.Application.Interfaces;
using Chloe.Application.Interfaces.Wiki;
using Chloe.Application.Models.WikiDocument;
using Chloe.Entities;
using Chloe.Home.Common;
using Chloe.Home.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Chloe.Home.Controllers
{
    public class WikiController : WebController
    {
        [OutputCache(Duration = WebConsts.PageOutputCacheDuration, VaryByParam = "id")]
        public ActionResult Document(string id)
        {
            List<WikiMenuItem> menuItems = this.CreateService<IWikiMenuItemAppService>().GetWikiMenuItems();
            List<WikiMenuTreeNode> rootNodes = this.CreateTreeNodes(menuItems);

            this.ViewBag.RootNodes = rootNodes;

            string docId = id ?? rootNodes.First().ChildNodes.First().DocumentId;

            WikiDocumentDetailModel model = this.CreateService<IWikiDocumentAppService>().GetDetailModel(docId);

            if (model == null)
            {
                /* 404 */
                return this.NotFound();
            }

            this.ViewBag.Document = model;

            WikiMenuItem menuItem = menuItems.Where(a => a.DocumentId == model.Id).FirstOrDefault();

            if (menuItem != null)
            {
                string expandedNodeId = menuItem.Id;
                this.ViewBag.CurrentNodeId = expandedNodeId;
            }

            return View();
        }

        List<WikiMenuTreeNode> CreateTreeNodes(List<WikiMenuItem> menuItems)
        {
            List<WikiMenuItem> rootItems = menuItems.Where(a => a.ParentId == null).OrderBy(a => a.SortCode).ToList();

            List<WikiMenuTreeNode> rootNodes = new List<WikiMenuTreeNode>(rootItems.Count);
            foreach (var item in rootItems)
            {
                WikiMenuTreeNode rootNode = new WikiMenuTreeNode();
                rootNode.Id = item.Id;
                rootNode.Name = item.Name;

                foreach (WikiMenuItem childItem in menuItems.Where(a => a.ParentId == rootNode.Id).OrderBy(a => a.SortCode))
                {
                    WikiMenuTreeNode childNode = new WikiMenuTreeNode() { Id = childItem.Id, ParentId = childItem.ParentId, Name = childItem.Name, DocumentId = childItem.DocumentId };

                    RouteValueDictionary parameDic = new RouteValueDictionary();
                    parameDic.Add("id", childItem.DocumentId);
                    string url = this.Url.Action("Document", parameDic);
                    childNode.Url = url;

                    rootNode.ChildNodes.Add(childNode);
                }

                rootNodes.Add(rootNode);
            }

            return rootNodes;
        }
    }
}