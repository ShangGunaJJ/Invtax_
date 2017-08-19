using Ace.Application;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application.Models.WikiMenuItem
{
    public class AddWikiMenuItemInput : ValidationModel
    {
        public string ParentId { get; set; }
        [RequiredAttribute(ErrorMessage = "名称不能为空")]
        public string Name { get; set; }
        public string DocumentId { get; set; }
        public bool IsEnabled { get; set; }
        public int? SortCode { get; set; }
    }
}
