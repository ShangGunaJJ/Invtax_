using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application.Common
{
    public class AppConsts
    {
        const string _AdminUserName = "sysadmin";

        public static string AdminUserName { get { return _AdminUserName; } }


        const string _Admin = "admin";

        public static string Admin { get { return _Admin; } }
        const string _Agent = "agent";

        public static string Agent { get { return _Agent; } }
    }
}
