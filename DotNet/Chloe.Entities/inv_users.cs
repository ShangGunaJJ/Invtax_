using Chloe.Entities.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Entities
{
    public class inv_users
    {
        public string Id { get; set; }
        /// <summary>
        /// 登录名称
        /// </summary>
        public string username { get; set; }
        /// <summary>
        /// 用户显示名称
        /// </summary>
        public string RealName { get; set; }
        public string HeadIcon { get; set; }
        /// <summary>
        /// 性别
        /// </summary>
        public Gender? Gender { get; set; }
        /// <summary>
        /// 出生日期
        /// </summary>
        public DateTime? Birthday { get; set; }
        /// <summary>
        /// 手机号码
        /// </summary>
        public string MobilePhone { get; set; }

        /// <summary>
        /// 权限
        /// </summary>
        public string RoleId { get; set; }
        public string DutyId { get; set; }

        /// <summary>
        /// 是否启用
        /// </summary>
        public int IsEnabled { get; set; }
        
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime createtime { get; set; }
        /// <summary>
        /// 创建用户ID
        /// </summary>
        public string CreateUserId { get; set; }

        /// <summary>
        /// 用户类型
        /// </summary>
        public UserType? privilege
        {
            get; set;
        }
        /// <summary>
        /// 是否在线
        /// </summary>
        public int? IsOnline { get; set; }
        /// <summary>
        /// 公司ID
        /// </summary>
        public string companyguid { get; set; }
        /// <summary>
        /// 公司名称
        /// </summary>
        public string companyname { get; set; }

        /// <summary>
        /// 密码
        /// </summary>
        public string password { get; set; }
        /// <summary>
        /// 是否第一次登录
        /// </summary>
        public int IsFirst { get; set; }

        public string Theme { get; set; }
    }
}
