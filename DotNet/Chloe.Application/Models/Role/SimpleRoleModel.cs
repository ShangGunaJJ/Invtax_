using Chloe.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application.Models.Role
{
    public class SimpleRoleModel
    {
        public string Id { get; set; }
        public string Name { get; set; }

        public static SimpleRoleModel Create(Sys_Role role)
        {
            SimpleRoleModel roleModel = new SimpleRoleModel();

            roleModel.Id = role.Id;
            roleModel.Name = role.Name;

            return roleModel;
        }
    }

}
