using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Entities
{
    public class inv_detail
    {
        public int Id { get; set; }

        /// <summary>
        /// 主表ID
        /// </summary>
        public int main_id { get; set; }

        /// <summary>
        /// 名称
        /// </summary>
        public string mc { get; set; }

        /// <summary>
        /// 规格型号
        /// </summary>
        public string gg { get; set; }

        /// <summary>
        /// 单位
        /// </summary>
        public string dw { get; set; }

        /// <summary>
        /// 数量
        /// </summary>
        public string amount { get; set; }
        /// <summary>
        /// 单价
        /// </summary>
        public decimal dj { get; set; }
        /// <summary>
        /// 金额
        /// </summary>
        public decimal je { get; set; }
        /// <summary>
        /// 税率
        /// </summary>
        public string sl { get; set; }
        /// <summary>
        /// 税额
        /// </summary>
        public decimal se { get; set; }
    }
}
