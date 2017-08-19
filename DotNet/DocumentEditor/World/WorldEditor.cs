using Aspose.Words;
using ws=Aspose.Words.Saving;
using System.IO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using Aspose.Words.MailMerging;
using Newtonsoft.Json;
using DocumentEditor.World;
using Aspose.Words.Layout;
using System.Collections;
using System.Globalization;
using System.Xml.Linq;

namespace DocumentEditor.World
{
    public class WorldEditor : DocEditor
    {
        public override string Create<T>(string path, List<T> data)
        {
            Document doc = new Document(path);
            System.Data.DataSet ds = new System.Data.DataSet();
            if (typeof(T) == typeof(System.Data.DataTable))
            {

                foreach (var item in data) {
                    var obj = (object)item;
                    var db = (System.Data.DataTable)obj;
                    db.TableName= "DBTable";
                    ds.Tables.Add(db);
                }
            }
            else {
                var table = data.ToTable();
                table.TableName = "DBTable";
                ds.Tables.Add(table);
            }


            //doc.MailMerge.TrimWhitespaces = false;
            //doc.MailMerge.Execute(names, values);
            doc.MailMerge.UseNonMergeFields = true;
            //设置父子表的关系，主表Dt的Id关联从表XM的UserId
            //ds.Relations.Add(dt.Columns["Id"], xmDt.Columns["UserId"]);
            doc.MailMerge.ExecuteWithRegions(ds);
            string ext = Path.GetExtension(path);
            string filename = null;
            if (string.IsNullOrEmpty(filename))
            {
                filename = Guid.NewGuid().ToString("N") + ext;
            }
            else {
                if(!filename.Contains('.'))
                    filename = filename + ext;
            }
            string fileSavePath = Path.GetDirectoryName(path) + "\\" + filename;
            //if (!string.IsNullOrEmpty(newFileName)) {
                
            //    if (File.Exists(fileSavePath)) {
            //        File.Delete(fileSavePath);
            //    }
            //}
            ws.SaveOptions saveOptions = ws.SaveOptions.CreateSaveOptions(path);
            saveOptions.PrettyFormat = true;
            SectionCollection sc = doc.Sections;
            foreach (Section section in sc)
            {
                section.PageSetup.PaperSize = PaperSize.A4;
                section.PageSetup.Orientation = Orientation.Portrait;
                section.PageSetup.VerticalAlignment = PageVerticalAlignment.Top;
                section.PageSetup.PageNumberStyle = NumberStyle.VietCardinalText;
            }
            doc.Save(fileSavePath, saveOptions);
            return filename;
        }

        /// <summary>
        /// 绝对路径相对路径转换为url地址
        /// </summary>
        /// <param name="path">绝对路径相对路径</param>
        /// <returns></returns>
        private string MapPathReverse(string path)
        {
            string appPath = HttpContext.Current.Server.MapPath("~");
            var scheme = HttpContext.Current.Request.Url.Scheme;
            var authority = HttpContext.Current.Request.Url.Authority;
            string name = Path.GetExtension(path);
            var virtualPath = "/" + path.Replace(appPath, "").Replace(name, "").Replace("\\", "/");
            string res = string.Format("{0}://{1}/{2}", scheme, authority, virtualPath);
            return virtualPath;
        }
       
        /// <summary>
        /// word生成html字符串
        /// </summary>
        /// <param name="path">word路径</param>
        /// <returns></returns>
        public override string ToHTML(string path)
        {
            //openxml引用
            //string htmlPath=WmlToHtmlConverterHelper.ConvertToHtml(path, this.FilePath);
            //aspose引用 api网址http://www.aspose.com
            if (!File.Exists(path))
            {
                return string.Empty;
            }
            //PageNumberFinder
            Document doc = new Document(path);
            var paperSize = doc.FirstSection.PageSetup.PaperSize.ToString(); //纸张大小
            var pageCount = doc.PageCount;  //获得页数
            doc.MailMerge.UseNonMergeFields = false;
            doc.MailMerge.UseWholeParagraphAsRegion = true;
            //doc.MailMergeSettings.ViewMergedData = false;
            //doc.MailMergeSettings.LinkToQuery = true;
            //doc.MailMergeSettings.MailAsAttachment = true;
            //html设置
            ws.HtmlSaveOptions option = new ws.HtmlSaveOptions(SaveFormat.Html);
            option.ExportHeadersFootersMode = ws.ExportHeadersFootersMode.PerSection;
            option.PrettyFormat = true;
            option.UseAntiAliasing = true;
            option.ExportTocPageNumbers = false;
            option.ExportRoundtripInformation = true;
            //option.ExportListLabels = ExportListLabels.AsInlineText;
            string name = Path.GetFileNameWithoutExtension(path);
            //生成图片保存路径
            option.ImagesFolderAlias = MapPathReverse(path);
            //Path.Combine(Path.GetDirectoryName(path), name);
            //string.Format("/Resource/emw/UserFile/{0}/", name);
            var savePath = Path.Combine(this.FilePath, name + "\\");
            if (!Directory.Exists(savePath))
            {
                Directory.CreateDirectory(savePath);
            }
            LayoutCollector layoutCollector = new LayoutCollector(doc);

            // 构建布局模型,收集必要的信息。
            doc.UpdatePageLayout();

            // 节点在文档分割成单独的页面。
            DocumentPageSplitter splitter = new DocumentPageSplitter(layoutCollector);
            //for (int page = 1; page <= doc.PageCount; page++)
            //{
            //    Document pageDoc = splitter.GetDocumentOfPage(page);
            //    NodeCollection paras = pageDoc.GetChildNodes(NodeType.Paragraph, true);
            //    foreach (Paragraph para in paras)
            //    {
            //        if (para.GetText().Contains("Evaluation Only. Created with Aspose.Words. Copyright 2003-2016 Aspose Pty Ltd."))
            //        {
            //            paras.Remove(para);
            //        }
            //    }
            //    var pageFileName = Path.Combine(savePath, string.Format("{0}-page{1}{2}", name, page, ".html"));
            //    pageDoc.Save(pageFileName,option);
            //}
            // 从文档中分离收集器。
            layoutCollector.Document = null;
            //html保存地址
            string htmlPath = savePath + name + ".html";
            doc.Save(htmlPath, option);
            XElement xhtml = XElement.Load(htmlPath);
            var idCounter = 1000000;
            foreach (var d in xhtml.Descendants())
            {
                if (d.Name.LocalName == "head" || d.Name.LocalName == "meta" || d.Name.LocalName == "title" || d.Name.LocalName == "body")
                    continue;
                string idName = d.Name.LocalName + "-" + idCounter.ToString().Substring(1);
                XAttribute id = new XAttribute("data-uniqid", idName);
                if (d.Attribute("id") == null)
                {
                    d.Add(id);
                }
                idCounter++;
            }
            File.WriteAllText(htmlPath, xhtml.ToString(), Encoding.UTF8);
            string htmlString = xhtml.ToString();// File.ReadAllText(htmlPath);
            string jsonStr = JsonConvert.SerializeObject(new { pageCount = pageCount, paperSize = paperSize, htmlString = htmlString,  path = path });
            return jsonStr;
        }
        public override void ToFile(string html)
        {
            HtmlToWmlConverterHelper.ConvertToDocx(html, this.FilePath);
            //base.ToFile(html);
        }
    }
}
