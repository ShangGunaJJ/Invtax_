using Chloe.Entities.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application.Models.User
{
    public class UserModel
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string OrganizeId { get; set; }
        public string DepartmentId { get; set; }
        public string RoleId { get; set; }
        public string DutyId { get; set; }
        public string RealName { get; set; }
        public Gender? Gender { get; set; }
        public string MobilePhone { get; set; }
        public DateTime? Birthday { get; set; }
        public string WeChat { get; set; }
        public string Email { get; set; }
        public bool? IsAdministrator { get; set; }
        public bool IsEnabled { get; set; }
        public string Description { get; set; }
    }
}
