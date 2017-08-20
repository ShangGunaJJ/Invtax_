using Ace.Application;
using Chloe.Application.Models.Company;
using Chloe.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application.Interfaces.System
{
    public interface ICompanyAppService : IAppService
    {
        List<inv_company> GetCompaneys(string keyword);
        List<inv_company> GetCompaneyByID(string CompanyId);
        List<SimpleCompanyModel> GetSimpleModels();

        inv_company GetUserCompany();

        int GetUserPages();
        void Add(AddCompanyInput input);
        void Update(UpdateCompanyInput input);
        int UpdataTryKey(string Key);
        void Delete(string id);
        string GetTryKey();
        int AddTotleforCompany(string companyid, int totle, string date);
    }
}
