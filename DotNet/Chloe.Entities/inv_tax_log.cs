using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Entities
{
    public class inv_tax_log
    {
        public int id { get; set; }
         public int mainid { get; set; }
        public string companyguid { get; set;}

        public string result { get; set; }

        public DateTime? createtime { get; set; }
    }
}
