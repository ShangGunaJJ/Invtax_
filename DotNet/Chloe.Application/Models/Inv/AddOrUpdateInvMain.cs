using Ace.Application;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Chloe.Application.Models.Scan
{
    public class AddOrUpdateInvMain : ValidationModel
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
        /// 校验码
        /// </summary>
        public string jym { get; set; }

        public DateTime? createtime { get; set; }

        public string createuser { get; set; }


    }
    public class AddMainInput : AddOrUpdateInvMain
    {

    }
    public class UpdateMainInput : AddOrUpdateInvMain
    {
        [RequiredAttribute(ErrorMessage = "{0}不能为空")]
        public string Id { get; set; }
    }
}
