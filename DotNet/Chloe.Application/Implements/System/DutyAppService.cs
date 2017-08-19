using Chloe.Application.Interfaces.System;
using Chloe.Application.Models.Duty;
using Chloe.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application.Implements.System
{
    public class DutyAppService : AdminAppService, IDutyAppService
    {
        public List<Sys_Duty> GetDutyList(string keyword)
        {
            var q = this.DbContext.Query<Sys_Duty>().FilterDeleted().WhereIfNotNullOrEmpty(keyword, a => a.Name.Contains(keyword));
            q = q.OrderBy(a => a.SortCode);

            return q.ToList();
        }
        public List<SimpleDutyModel> GetSimpleModels()
        {
            var models = this.DbContext.Query<Sys_Duty>().Where(a => !a.IsDeleted).OrderBy(a => a.SortCode).Select(a => new SimpleDutyModel() { Id = a.Id, Name = a.Name, DepartmenId = a.DepartmentId }).ToList();
            return models;
        }

        public void Add(AddDutyInput input)
        {
            input.Validate();
            Sys_Duty entity = this.CreateEntity<Sys_Duty>();

            entity.Name = input.Name;
            entity.DepartmentId = input.DepartmentId;
            entity.SortCode = input.SortCode;

            this.DbContext.Insert(entity);
        }
        public void Update(UpdateDutyInput input)
        {
            input.Validate();

            this.DbContext.Update<Sys_Duty>(a => a.Id == input.Id, a => new Sys_Duty()
            {
                Name = input.Name,
                DepartmentId = input.DepartmentId,
                SortCode = input.SortCode,
            });
        }
        public void Delete(string id)
        {
            this.SoftDelete<Sys_Duty>(id);
        }
    }
}
