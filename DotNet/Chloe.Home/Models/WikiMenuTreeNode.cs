using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Chloe.Home.Models
{
    public class WikiMenuTreeNode
    {
        public WikiMenuTreeNode()
        {
            this.ChildNodes = new List<WikiMenuTreeNode>();
        }
        public string Id { get; set; }
        public string ParentId { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public string DocumentId { get; set; }
        //public bool Expanded { get; set; }
        //public bool Expanded { get; set; }
        public List<WikiMenuTreeNode> ChildNodes { get; set; }
    }
}