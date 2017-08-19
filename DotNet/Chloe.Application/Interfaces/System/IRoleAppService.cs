using Ace.Application;
using Chloe.Application.Models.Role;
using Chloe.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application.Interfaces.System
{
    public interface IRoleAppService : IAppService
    {
        List<Sys_Role> GetRoles(string keyword = "");
        List<SimpleRoleModel> GetSimpleModels();
        void Add(AddRoleInput input);
        void Update(UpdateRoleInput input);
        void Delete(string roleId);
    }
}
