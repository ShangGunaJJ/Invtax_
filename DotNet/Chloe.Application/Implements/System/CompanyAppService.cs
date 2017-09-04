using Ace.IdStrategy;
using Chloe.Application.Interfaces.System;
using Chloe.Application.Models.Company;
using Chloe.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chloe.Application.Implements.System
{
    public class CompanyAppService : AdminAppService, ICompanyAppService
    {
        public List<inv_company> GetCompaneys(string keyword)
        {
            var q = this.DbContext.Query<inv_company>().WhereIfNotNullOrEmpty(keyword, a => a.name.Contains(keyword));
            q = q.OrderBy(a => a.createDate);

            return q.ToList();
        }
        public List<inv_company> GetCompaneyByID(string CompanyId)
        {
            var q = this.DbContext.Query<inv_company>().Where(a => a.Id == CompanyId);
            q = q.OrderBy(a => a.createDate);

            return q.ToList();
        }


        public List<string> GetCompanysID()
        {
            var q = this.DbContext.Query<inv_company>().Where(a => a.Id == this.Session.CompanyID||a.ParentID==this.Session.CompanyID).Select(a=>a.Id);
            return q.ToList();

        }


        public List<SimpleCompanyModel> GetSimpleModels()
        {
            var q = this.DbContext.Query<inv_company>();
            q = q.OrderBy(a => a.createDate);

            return q.Select(a => new SimpleCompanyModel() { Id = a.Id, Name = a.name }).ToList();
        }
        public void Add(AddCompanyInput input)
        {
            inv_company entity = this.CreateEntity<inv_company>();
            //input.Validate();
            entity.name = input.name;
            entity.lxr = input.lxr;
            entity.Mode = input.Mode;
            entity.dh = input.dh;
            entity.dz = input.dz;
            entity.zh = input.zh;
            entity.email = input.email;
            entity.expirealertpages = input.expirealertpages;
            entity.createDate = DateTime.Now;
            entity.priority = input.priority;
            entity.sh = input.sh;
            entity.guid = entity.Id;

            this.DbContext.Insert(entity);
        }
        public void Update(UpdateCompanyInput input)
        {
            input.Validate();

            this.DbContext.Update<inv_company>(a => a.Id == input.Id, a => new inv_company()
            {
                name = input.name,
                lxr = input.lxr,
                Mode = input.Mode,
                dh = input.dh,
                dz = input.dz,
                zh = input.zh,
                email = input.email,
                expirealertpages = input.expirealertpages,
                priority = input.priority,
                sh = input.sh
            });
        }
        public int UpdataTryKey(string Key)
        {
            return this.DbContext.Update<inv_company>(a => a.Id == this.Session.CompanyID, a => new inv_company()
            {
                TryKeyword = Key
            });
        }

        public string GetTryKey()
        {
            return this.DbContext.Query<inv_company>(a => a.Id == this.Session.CompanyID).Select(a => a.TryKeyword).FirstOrDefault();
        }
        public void Delete(string id)
        {
            this.DbContext.Delete<inv_company>(a => a.Id == id);
        }

        /// <summary>
        /// 获取当前用户公司对象
        /// </summary>
        /// <returns></returns>
        public inv_company GetUserCompany()
        {
            return this.DbContext.Query<inv_company>().Where((c) => c.Id == this.Session.CompanyID).ToList()[0];
        }
        /// <summary>
        /// 查询当前公司已经使用量
        /// </summary>
        /// <returns></returns>
        public int GetUserPages()
        {
            int taxcount = this.DbContext.Query<inv_tax_log>().Where((c) => c.companyguid == this.Session.CompanyID).Count();
            int mcount = this.DbContext.Query<inv_main>().Where((c) => c.companyguid == this.Session.CompanyID && c.checkstauts == "待查验").Count();
            return (taxcount + mcount);
        }

        public int AddTotleforCompany(string companyid, int totle, string date)
        {
            inv_addlicences_log entity = new inv_addlicences_log();
            //input.Validate();
            entity.companyguid = companyid;
            entity.createtime = DateTime.Now;
            entity.createuser = this.Session.UserId;
            entity.totlePage = totle;
            entity.expiredDate = DateTime.Parse(date);
            if (this.DbContext.Insert(entity).id > 0)
            {
                return this.DbContext.Update<inv_company>(a => a.Id == companyid, a => new inv_company()
                {
                    totlePage = a.totlePage + totle
                });
            }
            return 0;
        }
    }
}
