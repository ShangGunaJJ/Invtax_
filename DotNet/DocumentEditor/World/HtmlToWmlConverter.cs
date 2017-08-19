﻿/***************************************************************************

Copyright (c) Microsoft Corporation 2012-2015.

This code is licensed using the Microsoft Public License (Ms-PL).  The text of the license can be found here:

http://www.microsoft.com/resources/sharedsource/licensingbasics/publiclicense.mspx

Published at http://OpenXmlDeveloper.org
Resource Center and Documentation: http://openxmldeveloper.org/wiki/w/wiki/powertools-for-open-xml.aspx

Developer: Eric White
Blog: http://www.ericwhite.com
Twitter: @EricWhiteDev
Email: eric@ericwhite.com

***************************************************************************/

using System;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Xml;
using System.Xml.Linq;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Validation;
using OpenXmlPowerTools;
using OpenXmlPowerTools.HtmlToWml;

public class HtmlToWmlConverterHelper
{
    public static void ConvertToDocx(string file, string destinationDir)
    {
        bool s_ProduceAnnotatedHtml = true;
        
        var sourceHtmlFi = new FileInfo(file);
        Console.WriteLine("Converting " + sourceHtmlFi.Name);
        var sourceImageDi = new DirectoryInfo(destinationDir);

        var destCssFi = new FileInfo(Path.Combine(destinationDir, sourceHtmlFi.Name.Replace(".html", ".css")));
        var destDocxFi = new FileInfo(Path.Combine(destinationDir, sourceHtmlFi.Name.Replace(".html", "-ConvertedByHtmlToWml.docx")));
        var annotatedHtmlFi = new FileInfo(Path.Combine(destinationDir, sourceHtmlFi.Name.Replace(".html", "-Annotated.txt")));

        XElement html = HtmlToWmlReadAsXElement.ReadAsXElement(sourceHtmlFi);
        
        string usedAuthorCss = HtmlToWmlConverter.CleanUpCss((string)html.Descendants().FirstOrDefault(d => d.Name.LocalName.ToLower() == "style" && !d.HasAttributes));
        usedAuthorCss = ConvertFontEncode(usedAuthorCss);
        File.WriteAllText(destCssFi.FullName, usedAuthorCss);

        HtmlToWmlConverterSettings settings = HtmlToWmlConverter.GetDefaultSettings();
        // image references in HTML files contain the path to the subdir that contains the images, so base URI is the name of the directory
        // that contains the HTML files
        settings.BaseUriForImages = sourceHtmlFi.DirectoryName;

        WmlDocument doc = HtmlToWmlConverter.ConvertHtmlToWml(defaultCss, usedAuthorCss, userCss, html, settings, null, s_ProduceAnnotatedHtml ? annotatedHtmlFi.FullName : null);
        doc.SaveAs(destDocxFi.FullName);
    }

    private static string ConvertFontEncode(string css)
    {
        StringBuilder sb = new StringBuilder(css);
        sb.Replace("新细明体", "PMingLiU");
        sb.Replace("细明体", "MingLiU");
        sb.Replace("标楷体", "DFKai-SB");
        sb.Replace("黑体", "SimHei");
        sb.Replace("宋体", "SimSun");
        sb.Replace("新宋体", "NSimSun");
        sb.Replace("仿宋", "FangSong");
        sb.Replace("楷体", "KaiTi");
        sb.Replace("仿宋_GB2312", "FangSong_GB2312");
        sb.Replace("楷体_GB2312", "KaiTi_GB2312");
        sb.Replace("微软正黑体", "Microsoft JhengHei");
        sb.Replace("微软雅黑", "Microsoft YaHei");
        //装Office会多出来的一些字体： 
        //sb.Replace("隶书", "LiSu");
        //sb.Replace("幼圆", "YouYuan");
        //sb.Replace("华文细黑", "STXihei");
        //sb.Replace("华文楷体", "STKaiti");
        //sb.Replace("华文宋体", "STSong");
        //sb.Replace("华文中宋", "STZhongsong");
        //sb.Replace("华文仿宋", "STFangsong");
        //sb.Replace("方正舒体", "FZShuTi");
        //sb.Replace("方正姚体", "FZYaoti");
        //sb.Replace("华文彩云", "STCaiyun");
        //sb.Replace("华文琥珀", "STHupo");
        //sb.Replace("华文隶书", "STLiti");
        //sb.Replace("华文行楷", "STXingkai");
        //sb.Replace("华文新魏", "STXinwei");
        return sb.ToString();
    }

    public class HtmlToWmlReadAsXElement
    {
        public static XElement ReadAsXElement(FileInfo sourceHtmlFi)
        {
            string htmlString = File.ReadAllText(sourceHtmlFi.FullName);
            XElement html = null;
            try
            {
                html = XElement.Parse(htmlString);
            }
#if USE_HTMLAGILITYPACK
            catch (XmlException)
            {
                HtmlDocument hdoc = new HtmlDocument();
                hdoc.Load(sourceHtmlFi.FullName, Encoding.Default);
                hdoc.OptionOutputAsXml = true;
                hdoc.Save(sourceHtmlFi.FullName, Encoding.Default);
                StringBuilder sb = new StringBuilder(File.ReadAllText(sourceHtmlFi.FullName, Encoding.Default));
                sb.Replace("&amp;", "&");
                sb.Replace("&nbsp;", "\xA0");
                sb.Replace("&quot;", "\"");
                sb.Replace("&lt;", "~lt;");
                sb.Replace("&gt;", "~gt;");
                sb.Replace("&#", "~#");
                sb.Replace("&", "&amp;");
                sb.Replace("~lt;", "&lt;");
                sb.Replace("~gt;", "&gt;");
                sb.Replace("~#", "&#");
                File.WriteAllText(sourceHtmlFi.FullName, sb.ToString(), Encoding.Default);
                html = XElement.Parse(sb.ToString());
            }
#else
            catch (XmlException e)
            {
                throw e;
            }
#endif
            // HtmlToWmlConverter expects the HTML elements to be in no namespace, so convert all elements to no namespace.
            html = (XElement)ConvertToNoNamespace(html);
            return html;
        }

        private static object ConvertToNoNamespace(XNode node)
        {
            XElement element = node as XElement;
            if (element != null)
            {
                return new XElement(element.Name.LocalName,
                    element.Attributes().Where(a => !a.IsNamespaceDeclaration),
                    element.Nodes().Select(n => ConvertToNoNamespace(n)));
            }
            return node;
        }
    }

    static string defaultCss =
        @"html, address,
blockquote,
body, dd, div,
dl, dt, fieldset, form,
frame, frameset,
h1, h2, h3, h4,
h5, h6, noframes,
ol, p, ul, center,
dir, hr, menu, pre { display: block; unicode-bidi: embed }
li { display: list-item }
head { display: none }
table { display: table }
tr { display: table-row }
thead { display: table-header-group }
tbody { display: table-row-group }
tfoot { display: table-footer-group }
col { display: table-column }
colgroup { display: table-column-group }
td, th { display: table-cell }
caption { display: table-caption }
th { font-weight: bolder; text-align: center }
caption { text-align: center }
body { margin: auto; }
h1 { font-size: 2em; margin: auto; }
h2 { font-size: 1.5em; margin: auto; }
h3 { font-size: 1.17em; margin: auto; }
h4, p,
blockquote, ul,
fieldset, form,
ol, dl, dir,
menu { margin: auto }
a { color: blue; }
h5 { font-size: .83em; margin: auto }
h6 { font-size: .75em; margin: auto }
h1, h2, h3, h4,
h5, h6, b,
strong { font-weight: bolder }
blockquote { margin-left: 40px; margin-right: 40px }
i, cite, em,
var, address { font-style: italic }
pre, tt, code,
kbd, samp { font-family: monospace }
pre { white-space: pre }
button, textarea,
input, select { display: inline-block }
big { font-size: 1.17em }
small, sub, sup { font-size: .83em }
sub { vertical-align: sub }
sup { vertical-align: super }
table { border-spacing: 2px; }
thead, tbody,
tfoot { vertical-align: middle }
td, th, tr { vertical-align: inherit }
s, strike, del { text-decoration: line-through }
hr { border: 1px inset }
ol, ul, dir,
menu, dd { margin-left: 40px }
ol { list-style-type: decimal }
ol ul, ul ol,
ul ul, ol ol { margin-top: 0; margin-bottom: 0 }
u, ins { text-decoration: underline }
br:before { content: ""\A""; white-space: pre-line }
center { text-align: center }
:link, :visited { text-decoration: underline }
:focus { outline: thin dotted invert }
/* Begin bidirectionality settings (do not change) */
BDO[DIR=""ltr""] { direction: ltr; unicode-bidi: bidi-override }
BDO[DIR=""rtl""] { direction: rtl; unicode-bidi: bidi-override }
*[DIR=""ltr""] { direction: ltr; unicode-bidi: embed }
*[DIR=""rtl""] { direction: rtl; unicode-bidi: embed }

";

    static string userCss = @"";
}
