using Ace.Application;
using Chloe.Application.Models.WikiMenuItem;
using Chloe.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application.Interfaces.Wiki
{
    public interface IWikiMenuItemAppService : IAppService
    {
        List<WikiMenuItem> GetWikiMenuItems();
        List<WikiMenuItem> GetRootWikiMenuItems();
        List<WikiMenuItem_WikiDocument> GetWikiMenuItem_Documents();
        WikiMenuItem Add(AddWikiMenuItemInput input);
        void Update(UpdateWikiMenuItemInput input);
        void Delete(string id);
    }
}
