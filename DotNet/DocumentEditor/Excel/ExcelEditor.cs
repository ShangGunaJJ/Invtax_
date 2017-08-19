using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Data;
using Aspose.Cells;

namespace DocumentEditor.Excel
{
    public class ExcelEditor:DocEditor
    {
        public override string Create<T>(string path, List<T> data)
        {
            var list = new List<DataTable>();
            if (typeof(T) == typeof(System.Data.DataTable))
            {

                foreach (var item in data)
                {
                    var obj = (object)item;
                    var db = (System.Data.DataTable)obj;
                    db.TableName = "DBTable";
                    list.Add(db);
                }
            }
            else
            {
                var table = data.ToTable();
                table.TableName = "DBTable";
                list.Add(table);
            }
            string ext = Path.GetExtension(path);
            string filename = Guid.NewGuid().ToString("N") + ext;
            string fileSavePath = Path.GetDirectoryName(path) + "\\" + filename;
            File.Copy(path, fileSavePath);
             SmlToHtmlConverterHelper.CreateNewExcel(fileSavePath, list);
            return filename;
        }

        public override string ToHTML(string path,string company, bool dataOnly, bool isallsheet)
        {
            string htmlPath = SmlToHtmlConverterHelper.ConvertToHtml(path, this.FilePath, dataOnly, isallsheet);
            //创建文件目录+ "\\" + company + "\\UserFile\\"
            string name = System.IO.Path.GetFileNameWithoutExtension(path);
            var savePath = Path.Combine(this.FilePath , name + "\\");
            if (!Directory.Exists(savePath))
            {
                Directory.CreateDirectory(savePath);
            }
            return htmlPath;
        }
        public override void ToFile(string html)
        {
            base.ToFile(html);
        }
    }
}
