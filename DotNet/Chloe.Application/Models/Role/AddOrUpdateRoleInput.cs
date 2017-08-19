using Ace.Application;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application.Models.Role
{
    public class AddOrUpdateRoleInputBase : ValidationModel
    {
        public string EnCode { get; set; }
        [RequiredAttribute(ErrorMessage = "角色名称不能为空")]
        public string Name { get; set; }
        public int? SortCode { get; set; }
        public bool IsEnabled { get; set; }
        public string Description { get; set; }
        public string PermissionIds { get; set; }

        public string[] GetPermissionIds()
        {
            if (this.PermissionIds == null)
                return new string[0];

            return this.PermissionIds.Split(',');
        }
    }

    public class AddRoleInput : AddOrUpdateRoleInputBase
    {

    }
    public class UpdateRoleInput : AddOrUpdateRoleInputBase
    {
        [RequiredAttribute(ErrorMessage = "{0}不能为空")]
        public string Id { get; set; }
    }
}
