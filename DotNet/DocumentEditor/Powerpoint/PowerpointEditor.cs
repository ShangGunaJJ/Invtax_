using Aspose.Slides;
using Aspose.Slides.Export;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace DocumentEditor.Powerpoint
{
    public class PowerpointEditor : DocEditor
    {
        public override string ToHTML(string path)
        {
            //获取不带扩展的文件名
            string name = Path.GetFileNameWithoutExtension(path);
            string destFilePath = Path.Combine(Path.GetDirectoryName(path), name);
            string htmlFileName = $"{name}.html";
            var buffer = File.ReadAllBytes(path);
            using (MemoryStream ms = new MemoryStream())
            {
                ms.Write(buffer, 0, buffer.Length);
                if (ms.Length <= 0) return "false";

                using (Presentation pres = new Presentation(path))
                {
                    HtmlOptions htmlOpt = new HtmlOptions();
                    htmlOpt.HtmlFormatter = HtmlFormatter.CreateDocumentFormatter(Css, false);
                    if (!Directory.Exists(destFilePath))
                    {
                        Directory.CreateDirectory(destFilePath);
                    }
                    //hmtl文件保存地址
                    string htmlFilePath = Path.Combine(destFilePath, htmlFileName);
                    pres.Save(htmlFilePath, SaveFormat.Html, htmlOpt);
                    string htmlString = File.ReadAllText(htmlFilePath);
                    //XElement xhtml = XElement.Load(htmlFilePath);

                    return JsonConvert.SerializeObject(new { htmlString = htmlString, Size = pres.SlideSize });
                }
            }
                
            
        }

        private const string Css = ".rx-cy-my-rh { stroke: #ddd;stroke-width: 3; }.rx-cy-my-rh-pq { stroke: #fff; }.rx-cy-my-ny { fill: #666;font-size: 12px;font-weight: bold; }";
    }
}
