using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Entities
{
    public class Notice
    {
        public int id { get; set; }

        public string content { get; set; }

        public DateTime createTime { get; set; }
    }
}
