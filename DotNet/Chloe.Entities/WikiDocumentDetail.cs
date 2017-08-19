using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Entities
{
    [Chloe.Entity.Table("WikiDocument")]
    public class WikiDocumentDetail : WikiDocument
    {
        public string HtmlContent { get; set; }
        public string MarkdownCode { get; set; }
    }
}
