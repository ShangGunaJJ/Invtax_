using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Optimization;

namespace Ace.Web.Mvc
{
    public static class ContentHelper
    {
        public static IHtmlString RefStyle(string virtualPath)
        {
            string absUrl = Styles.Url(virtualPath).ToHtmlString();
            string html = string.Format("<link rel=\"stylesheet\" href=\"{0}\">", absUrl);
            return new HtmlString(html);
        }

        public static IHtmlString RefScript(string virtualPath)
        {
            string absUrl = Scripts.Url(virtualPath).ToHtmlString();
            string html = string.Format("<script type=\"text/javascript\" src=\"{0}\"></script>", absUrl);
            return new HtmlString(html);
        }
    }
}
