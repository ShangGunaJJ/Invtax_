using Ace;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application
{
    public class AdminSession : AceSession<string>
    {
        public string UserName { get; set; }
        public string RealName { get; set; }
        public string CompanyID { get; set; }
        public string DutyId { get; set; }
        public string RoleId { get; set; }
        public string SH { get; set; }
        public string CompanyName { get; set; }
        public string RoleCode { get; set; }
        public string LoginIP { get; set; }
        public DateTime LoginTime { get; set; }
        public bool IsAdmin { get; set; }

        public bool _IsAdmin { get; set; }

        public List<string> RolUserId { get; set; }

        public bool IsAgent { get; set; }

        public string ThemeName { get; set; }
    }
}
