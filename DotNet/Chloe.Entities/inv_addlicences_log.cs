using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Entities
{
   public class inv_addlicences_log
    {
        public int id { get; set; }

        public string companyguid { get; set; }

        public DateTime expiredDate { get; set; }

        public int totlePage { get; set; }

        public DateTime createtime { get; set; }

        public string createuser { get; set; }
    }
}
