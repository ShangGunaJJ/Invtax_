using Ace.Application;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application.Models.Duty
{
    public class AddorUpdateDutyInputBase : ValidationModel
    {
        [RequiredAttribute(ErrorMessage = "职责名称不能为空")]
        public string Name { get; set; }
        public string DepartmentId { get; set; }
        public int? SortCode { get; set; }
    }

    public class AddDutyInput : AddorUpdateDutyInputBase
    {
    }

    public class UpdateDutyInput : AddorUpdateDutyInputBase
    {
        [RequiredAttribute(ErrorMessage = "{0}不能为空")]
        public string Id { get; set; }
    }
}
