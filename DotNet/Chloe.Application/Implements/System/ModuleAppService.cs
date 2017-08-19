using Ace.Exceptions;
using Ace.IdStrategy;
using Chloe.Application.Interfaces.System;
using Chloe.Application.Models.Module;
using Chloe.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application.Implements.System
{
    public class ModuleAppService : AdminAppService, IModuleAppService
    {
        public List<Sys_Module> GetList()
        {
            return this.DbContext.GetSys_Modules().OrderBy(t => t.SortCode).ToList();
        }
        public void Add(AddModuleInput input)
        {
            input.Validate();
            Sys_Module module = this.CreateEntity<Sys_Module>();
            module.ParentId = input.ParentId;
            module.Name = input.Name;
            module.Icon = input.Icon;
            module.UrlAddress = input.UrlAddress;
            module.OpenTarget = input.OpenTarget;
            module.IsMenu = input.IsMenu;
            module.IsExpand = input.IsExpand;
            module.IsPublic = input.IsPublic;
            module.SortCode = input.SortCode;
            module.Description = input.Description;
            module.IsEnabled = input.IsEnabled;

            this.DbContext.Insert(module);
        }

        public void Update(UpdateModuleInput input)
        {
            input.Validate();

            var now = DateTime.Now;
            this.DbContext.Update<Sys_Module>(a => a.Id == input.Id, a => new Sys_Module()
            {
                ParentId = input.ParentId,
                Name = input.Name,
                Icon = input.Icon,
                UrlAddress = input.UrlAddress,
                OpenTarget = input.OpenTarget,
                IsMenu = input.IsMenu,
                IsExpand = input.IsExpand,
                IsPublic = input.IsPublic,
                SortCode = input.SortCode,
                Description = input.Description,
                IsEnabled = input.IsEnabled,

                LastModifyTime = now,
                LastModifyUserId = this.Session.UserId,
            });
        }

        public void DeleteById(string id)
        {
            id.NotNullOrEmpty();

            bool existsChildren = this.DbContext.Query<Sys_Module>(a => a.ParentId == id).Any();
            if (existsChildren)
                throw new InvalidDataException("删除失败！操作的对象包含了下级数据");

            this.DbContext.DeleteByKey<Sys_Module>(id);
        }
    }
}
