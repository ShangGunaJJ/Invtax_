using Ace.Application;
using Chloe.Application.Models.Duty;
using Chloe.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application.Interfaces.System
{
    public interface IDutyAppService : IAppService
    {
        List<Sys_Duty> GetDutyList(string keyword);
        List<SimpleDutyModel> GetSimpleModels();
        void Add(AddDutyInput input);
        void Update(UpdateDutyInput input);
        void Delete(string id);
    }
}
