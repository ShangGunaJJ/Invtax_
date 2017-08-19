using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application.Models.WikiDocument
{
    public class AddDocumentInput : Ace.Application.ValidationModel
    {
        [RequiredAttribute(ErrorMessage = "标题不能为空")]
        public string Title { get; set; }
        public string Summary { get; set; }
        public string Tag { get; set; }
        public string HtmlContent { get; set; }
        public string MarkdownCode { get; set; }
    }
}
