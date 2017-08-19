using Chloe.Entities.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application.Models.Account
{
    public class ModifyAccountInfoInput : Ace.Application.ValidationModel
    {
        [Required(ErrorMessage = "姓名不能为空")]
        public string RealName { get; set; }
        public Gender? Gender { get; set; }
        public DateTime? Birthday { get; set; }


        public string MobilePhone { get; set; }
        public string WeChat { get; set; }
        public string Email { get; set; }
        public string Description { get; set; }
    }
}
