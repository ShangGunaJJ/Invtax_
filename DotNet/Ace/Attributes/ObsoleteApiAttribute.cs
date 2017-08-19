using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ace.Attributes
{
    public class ObsoleteApiAttribute : Attribute
    {
        public ObsoleteApiAttribute()
        {
        }
        public ObsoleteApiAttribute(string message)
        {
            this.Message = message;
        }

        public string Message { get; private set; }
    }
}
