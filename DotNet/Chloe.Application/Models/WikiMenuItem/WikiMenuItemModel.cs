using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Chloe.Entities;

namespace Chloe.Application.Models.WikiMenuItem
{
    public class WikiMenuItem_WikiDocument
    {
        public Chloe.Entities.WikiMenuItem MenuItem { get; set; }
        public Chloe.Entities.WikiDocument Document { get; set; }
    }
}
