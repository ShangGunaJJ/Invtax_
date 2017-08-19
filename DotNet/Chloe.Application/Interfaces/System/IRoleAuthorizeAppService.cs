using Ace.Application;
using Chloe.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application.Interfaces.System
{
    public interface IRoleAuthorizeAppService : IAppService
    {
        List<Sys_RoleAuthorize> GetList(string roleId);
        List<Sys_Module> GetMenuList(string roleId);
    }
}
