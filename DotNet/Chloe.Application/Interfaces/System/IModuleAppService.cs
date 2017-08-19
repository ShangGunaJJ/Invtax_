using Ace.Application;
using Chloe.Application.Models.Module;
using Chloe.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application.Interfaces.System
{
    public interface IModuleAppService : IAppService
    {
        List<Sys_Module> GetList();
        void Add(AddModuleInput input);
        void Update(UpdateModuleInput input);
        void DeleteById(string id);
    }
}
