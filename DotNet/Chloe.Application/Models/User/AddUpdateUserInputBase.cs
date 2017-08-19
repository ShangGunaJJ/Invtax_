using Chloe.Entities.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application.Models.User
{
    public class AddUpdateUserInputBase : Ace.Application.ValidationModel
    {
        public string companyguid { get; set; }
        public string companyname { get; set; }
        public string RoleId { get; set; }
        public string DutyId { get; set; }
        public string RealName { get; set; }
        public Gender? Gender { get; set; }
        public string MobilePhone { get; set; }
        public DateTime? Birthday { get; set; }
        public int IsEnabled { get; set; }
        public int IsOnline { get; set; }
        public string Description { get; set; }
        public UserType? privilege
        {
            get; set;
        }
    }
}
