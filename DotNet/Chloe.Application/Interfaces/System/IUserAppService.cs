using Ace;
using Ace.Application;
using Chloe.Application.Models.User;
using Chloe.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application.Interfaces.System
{
    public interface IUserAppService : IAppService
    {
        void EnableAccount(string userId);
        void DisableAccount(string userId);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="pwdText">明文</param>
        void RevisePassword(string userId, string pwdText);
        void DeleteAccount(string userId);

        void AddUser(AddUserInput input);
        void UpdateUser(UpdateUserInput input);
        List<SimpleUserModel> GetSimpleModels();
        PagedData<inv_users> GetPageData(Pagination page, string keyword);
        int UpdateUserTheme(string t);
    }
}
