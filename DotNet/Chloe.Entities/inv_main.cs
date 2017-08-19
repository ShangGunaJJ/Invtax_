using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Entities
{
    public class inv_main
    {
        public int Id { get; set; }

        /// <summary>
        /// 发票类型
        /// </summary>
        public string fplx { get; set; }

        /// <summary>
        /// 地区
        /// </summary>
        public string dq { get; set; }
        /// <summary>
        /// 发票名称
        /// </summary>
        public string fpmc { get; set; }
        /// <summary>
        /// 发票代码
        /// </summary>
        public string fpdm { get; set; }
        /// <summary>
        /// 发票号码
        /// </summary>
        public string fphm { get; set; }
        /// <summary>
        /// 开票日期
        /// </summary>
        public string kprq { get; set; }
        /// <summary>
        /// 金额
        /// </summary>
        public Decimal je { get; set; }
        /// <summary>
        /// 税额
        /// </summary>
        public Decimal se { get; set; }
        /// <summary>
        /// 合计
        /// </summary>
        public Decimal jshj { get; set; }
        /// <summary>
        /// 校验码
        /// </summary>
        public string jym { get; set; }
        /// <summary>
        /// 机器码
        /// </summary>
        public string jqm { get; set; }
        /// <summary>
        /// 购方名称
        /// </summary>
        public string gfmc { get; set; }
        /// <summary>
        /// 购方税号
        /// </summary>
        public string gfsh { get; set; }
        /// <summary>
        /// 购方地址
        /// </summary>
        public string gfdz { get; set; }
        /// <summary>
        /// 购方账号
        /// </summary>
        public string gfzh { get; set; }
        /// <summary>
        /// 销方名称
        /// </summary>
        public string xfmc { get; set; }
        /// <summary>
        /// 销方税号
        /// </summary>
        public string xfsh { get; set; }
        /// <summary>
        /// 销方地址
        /// </summary>
        public string xfdz { get; set; }
        /// <summary>
        /// 销方账号
        /// </summary>
        public string xfzh { get; set; }

        /// <summary>
        /// 公司编码
        /// </summary>
        public string companyguid { get; set; }
        /// <summary>
        /// 创建用户
        /// </summary>
        public string createuser { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime? createtime { get; set; }
        /// <summary>
        /// 发票状态
        /// </summary>
        public string checkstauts { get; set; }
        /// <summary>
        /// 查验时间
        /// </summary>
        public DateTime? checktime { get; set; }
        /// <summary>
        /// 打码用户
        /// </summary>
        public string checkuser { get; set; }
        /// <summary>
        /// 打码次数
        /// </summary>
        public int checkcount { get; set; }
        /// <summary>
        /// 备注
        /// </summary>
        public string remarks { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int locked { get; set; }

        /// <summary>
        ///  
        /// </summary>
        public DateTime? lockedTime { get; set; }
        /// <summary>
        /// 查验次数
        /// </summary>
        public int cycs { get; set; }
        /// <summary>
        ///标识：0：工作台，1发票仓库
        /// </summary>
        public int flag { get; set; }

        /// <summary>
        /// 异常状态\n正常\n错票\n假票\n敏感
        /// </summary>
        public string Exception { get; set; }
    }

    public class inv_main_sea:inv_main {

    }
}
