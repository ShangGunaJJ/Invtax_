using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.tool.xml;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace DocumentEditor.Pdf
{
    public class HtmlToPdfConverter
    {
        /// <summary> 
        /// 判断是否有乱码 
        /// </summary> 
        /// <param name="txt"></param> 
        /// <returns></returns> 
        public bool isMessyCode(string txt)
        {
            var bytes = Encoding.UTF8.GetBytes(txt);             
            for (var i = 0; i < bytes.Length; i++)
            {
                if (i < bytes.Length - 3)
                    if (bytes[i] == 239 && bytes[i + 1] == 191 && bytes[i + 2] == 189)
                    {
                        return true;
                    }
            }
            return false;
        }

        /// <summary> 
        /// 获取网站内容，包含了 HTML+CSS+JS 
        /// </summary> 
        /// <returns>String返回网页信息</returns> 
        public async Task<string> getWebContent(string path)
        {
            try
            {
                WebClient webClient = new WebClient();
                //MyWebClient.Credentials = CredentialCache.DefaultCredentials;
                WebProxy webProxy = new WebProxy();
                webProxy.Address = new Uri("http://10.1.1.4:3128");
                webProxy.Credentials = new NetworkCredential("gogo.li", "admin");
                webClient.Proxy = webProxy;
                //获取或设置用于向Internet资源的请求进行身份验证的网络凭据 
                byte[] pageData = await webClient.DownloadDataTaskAsync(path);
                //从指定网站下载数据 
                string pageHtml = Encoding.UTF8.GetString(pageData);
                //如果获取网站页面采用的是GB2312，则使用这句        
                bool isBool = isMessyCode(pageHtml);//判断使用哪种编码 读取网页信息 
                if (!isBool)
                {
                    string pageHtml1 = Encoding.UTF8.GetString(pageData);
                    pageHtml = pageHtml1;
                }
                else
                {
                    string pageHtml2 = Encoding.Default.GetString(pageData);
                    pageHtml = pageHtml2;
                }
                return pageHtml;
            }

            catch (WebException webEx)
            {
                Console.WriteLine(webEx.Message.ToString());
                return webEx.Message;
            }
        }

        public async Task<string> GetHtmlContent(string path)
        {
            try
            {
                System.Net.Http.HttpClient client = new System.Net.Http.HttpClient();
                var result = await client.GetStringAsync("http://www.cnblogs.com/flish/archive/2012/04/01/2428350.html");
                return result;
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <summary> 
        /// 将Html文字 输出到PDF档里 
        /// </summary> 
        /// <param name="htmlText"></param> 
        /// <returns></returns> 
        public byte[] ConvertHtmlTextToPDF(string htmlText)
        {
            if (string.IsNullOrEmpty(htmlText))
            {
                return null;
            }
            //避免当htmlText无任何html tag标签的纯文字时，转PDF时会挂掉，所以一律加上<p>标签 
            htmlText = "<p>" + htmlText + "</p>";

            MemoryStream outputStream = new MemoryStream();//要把PDF写到哪个串流 
            byte[] data = Encoding.UTF8.GetBytes(htmlText);//字串转成byte[] 
            MemoryStream msInput = new MemoryStream(data);
            Document doc = new Document();//要写PDF的文件，建构子没填的话预设直式A4 
            PdfWriter writer = PdfWriter.GetInstance(doc, outputStream);
            //指定文件预设开档时的缩放为100% 

            PdfDestination pdfDest = new PdfDestination(PdfDestination.XYZ, 0, doc.PageSize.Height, 1f);
            //开启Document文件  
            doc.Open();

            //使用XMLWorkerHelper把Html parse到PDF档里 
            // XMLWorkerHelper.GetInstance().ParseXHtml(writer, doc, msInput, null, Encoding.UTF8, new UnicodeFontFactory()); 
            XMLWorkerHelper.GetInstance().ParseXHtml(writer, doc, msInput, null, Encoding.UTF8, new UnicodeFontFactory());

            //将pdfDest设定的资料写到PDF档 
            PdfAction action = PdfAction.GotoLocalPage(1, pdfDest, writer);
            writer.SetOpenAction(action);
            doc.Close();
            msInput.Close();
            outputStream.Close();
            //回传PDF档案  
            return outputStream.ToArray();

        }

        public async Task<byte[]> GetPdf(string htmlpath,string companyCode)
        {
            string path= Path.Combine(EMW.IEntity.ConstValue.FilePath, companyCode, "UserFile");
            //string path = System.Web.HttpContext.Current.Server.MapPath("~/UserFile");

            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);

            WebClient wc = new WebClient();
            //从网址下载Html字串 
            wc.Encoding = Encoding.UTF8;
            string htmlText = await getWebContent(htmlpath);
            //string htmlText =await GetHtmlContent(htmlpath);
            //html转换成pdf
            byte[] pdfFile = this.ConvertHtmlTextToPDF(htmlText);
            return pdfFile;

            //string fileId = "/file_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".pdf";
            //string pdfpath = "~/UserFile" + fileId;
            ////写入path + fileId
            //System.IO.File.WriteAllBytes(path + fileId, pdfFile);
            //return pdfpath;
        }

        //设置字体类 
        public class UnicodeFontFactory : FontFactoryImp
        {
            private static readonly string arialFontPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Fonts),
                "arialuni.ttf");//arial unicode MS是完整的unicode字型。
            private static readonly string 標楷體Path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Fonts),
              "KAIU.TTF");//標楷體


            public override iTextSharp.text.Font GetFont(string fontname, string encoding, bool embedded, float size, int style, BaseColor color,
                bool cached)
            {
                //可用Arial或標楷體，自己選一個
                BaseFont baseFont = BaseFont.CreateFont(標楷體Path, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
                return new iTextSharp.text.Font(baseFont, size, style, color);
            }
        }
    }
}
