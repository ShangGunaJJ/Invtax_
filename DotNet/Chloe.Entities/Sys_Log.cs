using Chloe.Entities.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Entities
{
    public class Sys_Log
    {
        [Chloe.Oracle.Sequence("Sys_Log_AUTOID")]
        public int Id { get; set; }
        public string UserId { get; set; }
        public string RealName { get; set; }
        public LogType Type { get; set; }
        public string IP { get; set; }
        public string IPAddress { get; set; }
        public string ModuleId { get; set; }
        public string ModuleName { get; set; }
        public bool? Result { get; set; }
        public string Description { get; set; }
        public DateTime CreationTime { get; set; }
    }
}
