using Ace.Application;
using Chloe.Application.Models.Scan;
using Chloe.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application.Interfaces.System
{
    public interface IInvAppService : IAppService
    {
        inv_main Add(AddOrUpdateInvMain input);

        int Update(AddOrUpdateInvMain input);

        int UpdateState(List<int> ids, string Exception);
        string Delete(List<int> id);

        string getRepeat(List<string> dm,List<string> hm);

        List<inv_main> GetInvData(Searcher sear, out int count);
        List<inv_detail> getDetail(int MainId);
        void GetInvTypeNum(out int special, out int ordinary, out int electronic, out int ordinaryG);
        string GetNotice();
        Notice SetNotice(string Con);
        int AgainSearch(List<int> ids);
    }
}
