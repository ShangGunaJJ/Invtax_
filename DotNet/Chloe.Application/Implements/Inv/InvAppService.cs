using Ace.IdStrategy;
using Chloe.Application.Interfaces.System;
using Chloe.Application.Models.Scan;
using Chloe.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection.Context;
using System.Threading.Tasks;
namespace Chloe.Application.Implements.Inv
{
    public class InvAppService : AdminAppService, IInvAppService
    {
        public string getRepeat(List<string> dm, List<string> hm)
        {
            List<inv_main> invms = this.DbContext.Query<inv_main>().Where(a => dm.Contains(a.fpdm) && hm.Contains(a.fphm) && a.companyguid == this.Session.CompanyID).ToList();
            StringBuilder sb = new StringBuilder();
            if (invms.Count > 0)
            {
                for (int i = 0; i < invms.Count; i++)
                {
                    inv_repeat_log repeatlog = new inv_repeat_log();

                    repeatlog.fpdm = invms[i].fpdm;
                    repeatlog.fphm = invms[i].fphm;
                    repeatlog.createtime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    repeatlog.createuser = this.Session.UserId;
                    repeatlog.mainid = invms[i].Id;
                    this.DbContext.Insert(repeatlog);
                    sb.Append(invms[i].fpdm + ',' + invms[i].fphm + ";");
                }
                return sb.ToString();
            }
            else
                return "";

        }
        public inv_main Add(AddOrUpdateInvMain input)
        {
            inv_main entity = new inv_main();

            entity.fplx = input.fplx;
            entity.fpdm = input.fpdm;
            entity.fphm = input.fphm;
            entity.dq = input.dq;
            entity.fpmc = input.fpmc;
            entity.je = input.fplx == "01" ? input.je : 0;
            entity.jym = input.jym;
            entity.kprq = input.kprq;
            entity.companyguid = this.Session.CompanyID;
            entity.checkstauts = "待查验";
            entity.createuser = this.Session.UserId;
            entity.createtime = DateTime.Now;

            return this.DbContext.Insert(entity);
        }
        public int Update(AddOrUpdateInvMain input)
        {

            if (this.DbContext.Update<inv_main>(a => a.Id == input.Id, a => new inv_main()
            {
                fplx = input.fplx,
                fpdm = input.fpdm,
                fphm = input.fphm,
                fpmc = input.fpmc,
                je = input.fplx == "01" ? input.je : 0,
                jym = input.jym,
                kprq = input.kprq,
                locked = 0,
                lockedTime = null,
                checkstauts = "待查验",
                createtime = DateTime.Now,
            }) > 0)
            {
                this.DbContext.Delete<inv_detail>(a => input.Id == a.main_id);
                return 1;
            }
            return 0;
        }
        public int UpdateState(List<int> ids, string Exception)
        {
            return this.DbContext.Update<inv_main>(a => ids.Contains(a.Id), a => new inv_main()
            {
                Exception = Exception
            });
        }

        public List<inv_detail> getDetail(int MainId)
        {
            return this.DbContext.Query<inv_detail>().Where(a => a.main_id == MainId).ToList();
        }
        public List<string[]> getDetailFors(List<int> MainId)
        {
            var view = this.DbContext.Query<inv_detail>().Where(a => MainId.Contains(a.main_id)).LeftJoin(this.DbContext.Query<inv_main>(), (d, m) => m.Id == d.main_id).Select(
                (d, m) => new { m.fpdm, m.fphm, d.mc, d.gg, d.dw, d.amount, d.dj, d.je, d.sl, d.se, m.kprq, m.xfmc, m.xfsh, m.xfdz, m.xfzh }).ToList();
            List<string[]> ss = new List<string[]>();
            for (int i = 0; i < view.Count; i++)
            {
                var m = view[i];
                string[] newstr = new[] { m.fpdm, m.fphm, m.mc, m.gg, m.dw, m.amount, m.dj.ToString(), m.je.ToString(), m.sl, m.se.ToString(), m.kprq, m.xfmc, m.xfsh, m.xfdz, m.xfzh };
                ss.Add(newstr);
            }
            return ss;
        }
        public string Delete(List<int> id)
        {
            int detailCount = 0;
            int mValue = 0;
            try
            {
                mValue = this.DbContext.Delete<inv_main>(a => id.Contains(a.Id));
                if (mValue > 0)
                {
                    detailCount = this.DbContext.Delete<inv_detail>(a => id.Contains(a.main_id));
                }
            }
            catch (Exception e)
            {
                return e.ToString();
            }
            return "成功删除" + mValue + "张发票，货物明细记录" + detailCount + "条。";
        }

        public List<inv_main> GetInvData(Searcher sear, out int count)
        {
            //var view = this.DbContext.Query<inv_main>().Where(a => a.companyguid == this.Session.CompanyID && a.createuser == this.Session.UserId);
            count = 0;
            string sql = @"select m.id
      ,m.fplx
      ,m.dq
      ,m.fpmc
      ,m.fpdm
      ,m.fphm
      ,m.kprq
      ,m.je
      ,m.se
      ,m.jshj
      ,m.jym
      ,m.jqm
      ,m.gfmc
      ,m.gfsh
      ,m.gfdz
      ,m.gfzh
      ,m.xfmc
      ,m.xfsh
      ,m.xfdz
      ,m.xfzh
      ,m.companyguid
      ,u.RealName as createuser
      ,m.createtime
      ,m.checkstauts
      ,m.checktime
      ,m.checkuser
      ,m.checkcount
      ,m.remarks
      ,m.locked
      ,m.lockedTime
      ,m.cycs
      ,m.flag
      ,m.Exception from inv_main m left join inv_users u on m.createuser=u.id  where  m.fplx in ('" + sear.fplx.Replace(",", "','") + "') ";

            List<DbParam> dpl = new List<DbParam>();

            if (sear.SearcherValues != null)
            {
                if (sear.SearcherValues.Id > 0)
                {
                    sql += " and m.id=@id";
                    dpl.Add(new DbParam("@id", sear.SearcherValues.Id));
                }
                if (sear.SearcherValues.je > 0)
                {
                    sql += " and m.je=@je";
                    dpl.Add(new DbParam("@je", sear.SearcherValues.je));
                }
                if (!string.IsNullOrEmpty(sear.SearcherValues.jqm))
                {
                    sql += " and m.jqm=@jqm";
                    dpl.Add(new DbParam("@jqm", sear.SearcherValues.jqm));
                }
                if (!string.IsNullOrEmpty(sear.SearcherValues.jym))
                {
                    sql += " and m.jym=@jym";
                    dpl.Add(new DbParam("@jym", sear.SearcherValues.jym));

                }
                if (!string.IsNullOrEmpty(sear.SearcherValues.fpdm))
                {
                    sql += " and m.fpdm like '%'+@fpdm+'%'";
                    dpl.Add(new DbParam("@fpdm", sear.SearcherValues.fpdm));
                }
                if (!string.IsNullOrEmpty(sear.SearcherValues.fphm))
                {
                    sql += " and m.fphm like '%'+@fphm+'%'";
                    dpl.Add(new DbParam("@fphm", sear.SearcherValues.fphm));
                }
                if (!string.IsNullOrEmpty(sear.SearcherValues.xfmc))
                {
                    sql += " and m.xfmc like '%'+@xfmc+'%'";
                    dpl.Add(new DbParam("@xfmc", sear.SearcherValues.xfmc));
                }

                if (!string.IsNullOrEmpty(sear.SearcherValues.fplx))
                {
                    sql += " and m.fplx=@fplx";
                    dpl.Add(new DbParam("@fplx", sear.SearcherValues.fplx));
                }

                if (!string.IsNullOrEmpty(sear.SearcherValues.gfdz))
                {
                    sql += " and m.gfdz=@gfdz";
                    dpl.Add(new DbParam("@gfdz", sear.SearcherValues.gfdz));
                }
                if (!string.IsNullOrEmpty(sear.SearcherValues.xfsh))
                {
                    sql += " and m.xfsh=@xfsh";
                    dpl.Add(new DbParam("@xfsh", sear.SearcherValues.xfsh));
                }
                if (!string.IsNullOrEmpty(sear.SearcherValues.checkstauts) && sear.SearcherValues.checkstauts != "全部")
                {
                    sql += " and m.checkstauts=@checkstauts";
                    dpl.Add(new DbParam("@checkstauts", sear.SearcherValues.checkstauts));
                }

                if (!string.IsNullOrEmpty(sear.SearcherValues.Exception) && sear.SearcherValues.Exception != "全部")
                {
                    sql += " and m.Exception=@Exception";
                    dpl.Add(new DbParam("@Exception", sear.SearcherValues.Exception));
                }


                if (!string.IsNullOrEmpty(sear.SearcherValues.kprq))
                {

                    DateTime dd;
                    DateTime.TryParse(sear.SearcherValues.kprq, out dd);
                    if (dd != null)
                    {
                        sql += " and m.kprq=@kprq";
                        dpl.Add(new DbParam("@kprq", dd));
                    }

                }
                if (!string.IsNullOrEmpty(sear.SearcherValues.xfzh))
                {
                    sql += " and m.xfzh=@xfzh";
                    dpl.Add(new DbParam("@xfzh", sear.SearcherValues.xfzh));
                }
                if (!string.IsNullOrEmpty(sear.SearcherValues.gfmc))
                {
                    sql += " and m.gfmc=@gfmc";
                    dpl.Add(new DbParam("@gfmc", sear.SearcherValues.gfmc));
                }
                if (!string.IsNullOrEmpty(sear.SearcherValues.gfsh))
                {
                    sql += " and m.gfsh=@gfsh";
                    dpl.Add(new DbParam("@gfsh", sear.SearcherValues.gfsh));
                }

                if (sear.SearcherValues.jshj > 0)
                {
                    sql += " and m.jshj=@jshj";
                    dpl.Add(new DbParam("@jshj", sear.SearcherValues.jshj));
                }
                if (sear.SearcherValues.checktime != null)
                {
                    sql += " and m.checktime=@checktime";
                    dpl.Add(new DbParam("@checktime", sear.SearcherValues.checktime));
                }
                if (sear.SearcherValues.createtime != null)
                {
                    sql += " and m.createtime>@createtime and m.createtime<@createtimeEnd";
                    dpl.Add(new DbParam("@createtime", sear.SearcherValues.createtime));
                    dpl.Add(new DbParam("@createtimeEnd", sear.SearcherValues.createtime.Value.AddHours(23).AddMinutes(59).AddSeconds(59)));
                }
            }

            if (this.Session._IsAdmin)
            {
                sql += " and m.createuser in (select id from inv_users where companyguid in (select * from inv_company where id=@CompanyID or ParentID=@ParentID)) ";
                dpl.Add(new DbParam("@CompanyID", this.Session.CompanyID));
                dpl.Add(new DbParam("@ParentID", this.Session.CompanyID));
            }
            else if (!this.Session.IsAdmin)
            {
                sql += " and m.createuser=@createuser";
                dpl.Add(new DbParam("@createuser", this.Session.UserId));
            }
            if (sear.SortColumn != "")
            {
                sql += " order by m." + sear.SortColumn + " " + sear.OrderBy;
            }
            else
            {
                sql += " order by m.createtime " + sear.OrderBy;
            }

            var view = this.DbContext.SqlQuery<inv_main>(sql, dpl.ToArray());
            count = view.Count();
            return view.Skip((sear.PageIndex - 1) * sear.PageSize).Take(sear.PageSize).ToList();
            //return view.TakePage(((sear.PageIndex-1)* sear.PageSize+1), sear.PageSize* sear.PageIndex).ToList();
        }

        /// <summary>
        /// 查询4个发票类型的使用量
        /// </summary>
        /// <param name="special">专用</param>
        /// <param name="ordinary">普通</param>
        /// <param name="electronic">电子</param>
        /// <param name="ordinaryG">普通（卷）</param>
        public void GetInvTypeNum(out int special, out int ordinary, out int electronic, out int ordinaryG)
        {
            special = 0; ordinary = 0;
            electronic = 0; ordinaryG = 0;
            special = this.DbContext.Query<inv_main>().Where(a => a.companyguid == this.Session.CompanyID).Where(a => a.fplx == "01" || a.fplx == "02").Select(a => AggregateFunctions.Count()).First();
            ordinary = this.DbContext.Query<inv_main>().Where(a => a.companyguid == this.Session.CompanyID).Where(a => a.fplx == "04").Select(a => AggregateFunctions.Count()).First();
            electronic = this.DbContext.Query<inv_main>().Where(a => a.companyguid == this.Session.CompanyID).Where(a => a.fplx == "03" || a.fplx == "10").Select(a => AggregateFunctions.Count()).First();
            ordinaryG = this.DbContext.Query<inv_main>().Where(a => a.companyguid == this.Session.CompanyID).Where(a => a.fplx == "11").Select(a => AggregateFunctions.Count()).First();
        }

        /// <summary>
        /// 重新检验
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        public int AgainSearch(List<int> ids)
        {
            if (this.DbContext.Update<inv_main>(a => ids.Contains(a.Id), a => new inv_main()
            {
                checkstauts = "待查验",
                locked = 0,
                lockedTime = null,
                checktime = DateTime.Now
            }) > 0)
            {
                this.DbContext.Delete<inv_detail>(a => ids.Contains(a.main_id));
                return 1;
            }
            return 0;
        }

        public Notice SetNotice(string Con)
        {
            Notice n = new Notice();
            n.content = Con;
            n.createTime = DateTime.Now;

            return this.DbContext.Insert(n);
        }
        public string GetNotice()
        {
            return this.DbContext.Query<Notice>().OrderByDesc(a => a.createTime).Select(a => a.content).FirstOrDefault();
        }

    }
}
