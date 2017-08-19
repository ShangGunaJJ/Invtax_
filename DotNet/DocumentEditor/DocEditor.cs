using DocumentFormat.OpenXml.Drawing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DocumentEditor
{
    public class DocEditor
    {
        public string FilePath;
        public bool IsCreated = false;
        public static DocEditor Create(string path)
        {
            var index = path.LastIndexOf(".");
            if (index == -1) return null;
            var exname = path.Substring(index + 1);
            switch (exname.ToLower())
            {
                case "doc":
                case "docx":
                    return new World.WorldEditor();
                case "xls":
                case "xlsx":
                    return new Excel.ExcelEditor();
                case "ppt":
                    goto case "pptx";
                case "pptx":
                    return new Powerpoint.PowerpointEditor();
            }
            return null;
        }
        public virtual string ToHTML(string path)
        {
            return null;
        }
        public virtual string ToHTML(string path, string company, bool dataOnly, bool isallsheet)
        {
            return null;
        }
        public virtual void ToFile(string html)
        {

        }
        public virtual string Create<T>(string path, List<T> data) { return string.Empty; }

        public static string Replace<T>(string path, List<T> data) {

            string ext = System.IO.Path.GetExtension(path);
            switch (ext) {
                case ".doc":
                case ".docx":
                    return new World.WorldEditor().Create<T>(path, data);
                case ".xls":
                case ".xlsx":
                    return new Excel.ExcelEditor().Create<T>(path, data);
                default:
                    return null;
            }
        }
    }
}
