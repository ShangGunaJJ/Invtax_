using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Chloe.Entities
{
    public class Searcher
    {
        public int PageSize { get; set; }

        public int PageIndex { get; set; }

        public inv_main SearcherValues { get; set; }

        public string SortColumn { get; set; }

        public string OrderBy { get; set; }

        public string fplx { get; set; }
    }
}
