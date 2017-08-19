using Chloe.Entities.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application.Models.User
{
    public class AddUserInput : AddUpdateUserInputBase
    {
        [RequiredAttribute(ErrorMessage = "用户名不能为空")]
        public string UserName { get; set; }
        /// <summary>
        /// 创建用户时，传的是明文
        /// </summary>
        [RequiredAttribute(ErrorMessage = "密码不能为空")]
        [StringLength(15, MinimumLength = 6, ErrorMessage = "密码必须是{2}-{1}位")]
        public string Password { get; set; }
    }
}
