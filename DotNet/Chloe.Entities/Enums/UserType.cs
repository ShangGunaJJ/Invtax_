using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Entities.Enums
{
    /// <summary>
    /// 1：普通用户；2：操作员；3：管理员;4 超级管理员
    /// </summary>
    public enum UserType
    {
        common=1,
        Operator=2,
        Administrator=3,
        SuperAdministrator=4
    }
}
