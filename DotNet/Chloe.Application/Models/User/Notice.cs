using Chloe.Entities.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application.Models.User
{
   public class Notice
    {
        public string id { get; set; }

        public string content { get; set; }

        public DateTime? createtime { get; set; }
    }
}
