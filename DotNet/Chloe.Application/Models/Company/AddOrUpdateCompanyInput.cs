using Ace.Application;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application.Models.Company
{
    public class AddOrUpdateCompanyInput : ValidationModel
    {
        [RequiredAttribute(ErrorMessage = "公司名称不能为空")]
        public string Id { get; set; }
        public string name { get; set; }
        /// <summary>
        /// 纳税人识别号
        /// </summary>
        public string sh { get; set; }
        /// <summary>
        /// 地址
        /// </summary>
        public string dz { get; set; }
        /// <summary>
        /// 开户行及账号
        /// </summary>
        public string zh { get; set; }
        /// <summary>
        /// 联系人
        /// </summary>
        public string lxr { get; set; }
        /// <summary>
        /// 电话
        /// </summary>
        public string dh { get; set; }
        /// <summary>
        /// 邮箱
        /// </summary>
        public string email { get; set; }
        /// <summary>
        /// 过期时间
        /// </summary>
        public DateTime expireDate { get; set; }
        /// <summary>
        /// 注册时间
        /// </summary>
        public DateTime createDate { get; set; }
        /// <summary>
        /// 年识别总量
        /// </summary>
        public int totlePage { get; set; }

        /// <summary>
        /// 优先级别
        /// </summary>
        public int priority { get; set; }
        /// <summary>
        /// 公司编号
        /// </summary>
        public string guid { get; set; }
        /// <summary>
        /// 剩余数据提示
        /// </summary>
        public int expirealertpages{ get; set; }
        /// <summary>
        /// 公司模式:0 企业,1 会计师事务所
        /// </summary>
        public int Mode { get; set; }
        /// <summary>
        /// 敏感字库
        /// </summary>
        public string TryKeyword { get; set; }
        /// <summary>
        /// 父公司ID
        /// </summary>
        public int ParentID { get; set; }
    }

    public class AddCompanyInput : AddOrUpdateCompanyInput
    {
    }
    public class UpdateCompanyInput : AddOrUpdateCompanyInput
    {
        [RequiredAttribute(ErrorMessage = "名称不能为空")]

        public string name { get; set; }
    }
}
