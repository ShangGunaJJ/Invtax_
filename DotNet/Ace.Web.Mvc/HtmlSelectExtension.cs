using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Reflection;

namespace System.Web.Mvc.Html
{
    public static class HtmlSelectExtension
    {
        public static HtmlString SelectOptions(this HtmlHelper htmlHelper, IEnumerable<SelectOption> optionList, string defaultText = "--请选择--")
        {
            StringBuilder htmlBuilder = new StringBuilder();

            const string optionFormat = "<option value=\"{0}\">{1}</option>";
            if (!string.IsNullOrEmpty(defaultText))
            {
                htmlBuilder.AppendFormat(optionFormat, string.Empty, defaultText);
            }

            foreach (var option in optionList)
            {
                htmlBuilder.AppendFormat(optionFormat, option.Value, option.Text);
            }
            return new HtmlString(htmlBuilder.ToString());
        }
    }
}