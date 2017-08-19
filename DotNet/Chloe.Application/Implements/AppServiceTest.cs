using Ace.Application;
using Chloe.Application.Interfaces;
using Chloe.Data;
using Chloe.Entities;
using Chloe.MySql;
using Chloe.Oracle;
using Chloe.SQLite;
using Chloe.SqlServer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application.Implements
{
    public class AppServiceTest : AppServiceBase, IAppServiceTest
    {
        public string Console(string s)
        {
            return s;
        }
    }
}
