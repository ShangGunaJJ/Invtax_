/*
Navicat Oracle Data Transfer
Oracle Client Version : 11.2.0.2.0

Source Server         : localhost_1521_ORCL
Source Server Version : 110200
Source Host           : localhost:1521
Source Schema         : SYSTEM

Target Server Type    : ORACLE
Target Server Version : 110200
File Encoding         : 65001

Date: 2016-12-11 15:18:20
*/


-- ----------------------------
-- Table structure for WIKIDOCUMENT
-- ----------------------------
DROP TABLE "SYSTEM"."WIKIDOCUMENT";
CREATE TABLE "SYSTEM"."WIKIDOCUMENT" (
"ID" VARCHAR2(100 BYTE) NOT NULL ,
"TITLE" NVARCHAR2(100) NULL ,
"SUMMARY" NVARCHAR2(500) NULL ,
"TAG" NVARCHAR2(100) NULL ,
"HTMLCONTENT" CLOB NULL ,
"CREATIONTIME" DATE NOT NULL ,
"UPDATIONTIME" DATE NULL ,
"ISDELETED" NUMBER(9) NOT NULL ,
"DELETIONTIME" DATE NULL ,
"MARKDOWNCODE" VARCHAR2(4000 BYTE) NULL 
)
LOGGING
NOCOMPRESS
NOCACHE

;

-- ----------------------------
-- Records of WIKIDOCUMENT
-- ----------------------------
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325149550670249984', 'Oracle-聚合查询', 'Oracle-聚合查询', 'Oracle-聚合查询', '<h1 id="h1-u805Au5408u67E5u8BE2"><a name="聚合查询" class="reference-link"></a><span class="header-link octicon octicon-link"></span>聚合查询</h1><p>Chloe 可以像写 sql 一样实现聚合查询。</p>
<pre><code class="lang-csharp">IQuery&lt;User&gt; q = context.Query&lt;User&gt;();

q.Select(a =&gt; AggregateFunctions.Count()).First();
/*
 * SELECT COUNT(1) AS &quot;C&quot; FROM &quot;USERS&quot; &quot;USERS&quot; WHERE ROWNUM &lt; 2
 */

/* 支持多个聚合函数 */
q.Select(a =&gt; new
{
    Count = AggregateFunctions.Count(),
    LongCount = AggregateFunctions.LongCount(),
    Sum = AggregateFunctions.Sum(a.Age),
    Max = AggregateFunctions.Max(a.Age),
    Min = AggregateFunctions.Min(a.Age),
    Average = AggregateFunctions.Average(a.Age)
}).First();
/*
 * SELECT COUNT(1) AS &quot;COUNT&quot;,COUNT(1) AS &quot;LONGCOUNT&quot;,SUM(&quot;USERS&quot;.&quot;AGE&quot;) AS &quot;SUM&quot;,MAX(&quot;USERS&quot;.&quot;AGE&quot;) AS &quot;MAX&quot;,MIN(&quot;USERS&quot;.&quot;AGE&quot;) AS &quot;MIN&quot;,AVG(&quot;USERS&quot;.&quot;AGE&quot;) AS &quot;AVERAGE&quot; 
   FROM &quot;USERS&quot; &quot;USERS&quot; 
   WHERE ROWNUM &lt; 2
 */

var count = q.Count();
/*
 * SELECT COUNT(1) AS &quot;C&quot; FROM &quot;USERS&quot; &quot;USERS&quot;
 */

var longCount = q.LongCount();
/*
 * SELECT COUNT(1) AS &quot;C&quot; FROM &quot;USERS&quot; &quot;USERS&quot;
 */

var sum = q.Sum(a =&gt; a.Age);
/*
 * SELECT SUM(&quot;USERS&quot;.&quot;AGE&quot;) AS &quot;C&quot; FROM &quot;USERS&quot; &quot;USERS&quot;
 */

var max = q.Max(a =&gt; a.Age);
/*
 * SELECT MAX(&quot;USERS&quot;.&quot;AGE&quot;) AS &quot;C&quot; FROM &quot;USERS&quot; &quot;USERS&quot;
 */

var min = q.Min(a =&gt; a.Age);
/*
 * SELECT MIN(&quot;USERS&quot;.&quot;AGE&quot;) AS &quot;C&quot; FROM &quot;USERS&quot; &quot;USERS&quot;
 */

var avg = q.Average(a =&gt; a.Age);
/*
 * SELECT AVG(&quot;USERS&quot;.&quot;AGE&quot;) AS &quot;C&quot; FROM &quot;USERS&quot; &quot;USERS&quot;
 */
</code></pre>
', TO_DATE('2016-12-02 15:57:12', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-03 14:23:21', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 聚合查询
Chloe 可以像写 sql 一样实现聚合查询。
```csharp
IQuery<User> q = context.Query<User>();

q.Select(a => AggregateFunctions.Count()).First();
/*
 * SELECT COUNT(1) AS "C" FROM "USERS" "USERS" WHERE ROWNUM < 2
 */

/* 支持多个聚合函数 */
q.Select(a => new
{
    Count = AggregateFunctions.Count(),
    LongCount = AggregateFunctions.LongCount(),
    Sum = AggregateFunctions.Sum(a.Age),
    Max = AggregateFunctions.Max(a.Age),
    Min = AggregateFunctions.Min(a.Age),
    Average = AggregateFunctions.Average(a.Age)
}).First();
/*
 * SELECT COUNT(1) AS "COUNT",COUNT(1) AS "LONGCOUNT",SUM("USERS"."AGE") AS "SUM",MAX("USERS"."AGE") AS "MAX",MIN("USERS"."AGE") AS "MIN",AVG("USERS"."AGE") AS "AVERAGE" 
   FROM "USERS" "USERS" 
   WHERE ROWNUM < 2
 */

var count = q.Count();
/*
 * SELECT COUNT(1) AS "C" FROM "USERS" "USERS"
 */

var longCount = q.LongCount();
/*
 * SELECT COUNT(1) AS "C" FROM "USERS" "USERS"
 */

var sum = q.Sum(a => a.Age);
/*
 * SELECT SUM("USERS"."AGE") AS "C" FROM "USERS" "USERS"
 */

var max = q.Max(a => a.Age);
/*
 * SELECT MAX("USERS"."AGE") AS "C" FROM "USERS" "USERS"
 */

var min = q.Min(a => a.Age);
/*
 * SELECT MIN("USERS"."AGE") AS "C" FROM "USERS" "USERS"
 */

var avg = q.Average(a => a.Age);
/*
 * SELECT AVG("USERS"."AGE") AS "C" FROM "USERS" "USERS"
 */
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325149450531241984', 'Oracle-分组查询', 'Oracle-分组查询', 'Oracle-分组查询', '<h1 id="h1-u5206u7EC4u67E5u8BE2"><a name="分组查询" class="reference-link"></a><span class="header-link octicon octicon-link"></span>分组查询</h1><p>Chloe 支持分组查询以及分组后 Having 过滤和聚合查询。</p>
<pre><code class="lang-csharp">IQuery&lt;User&gt; q = context.Query&lt;User&gt;();

IGroupingQuery&lt;User&gt; g = q.Where(a =&gt; a.Id &gt; 0).GroupBy(a =&gt; a.Age);
g = g.Having(a =&gt; a.Age &gt; 1 &amp;&amp; AggregateFunctions.Count() &gt; 0);

g.Select(a =&gt; new
{
    a.Age,
    Count = AggregateFunctions.Count(),
    Sum = AggregateFunctions.Sum(a.Age),
    Max = AggregateFunctions.Max(a.Age),
    Min = AggregateFunctions.Min(a.Age),
    Avg = AggregateFunctions.Average(a.Age)
}).ToList();
/*
 * SELECT &quot;USERS&quot;.&quot;AGE&quot; AS &quot;AGE&quot;,COUNT(1) AS &quot;COUNT&quot;,SUM(&quot;USERS&quot;.&quot;AGE&quot;) AS &quot;SUM&quot;,MAX(&quot;USERS&quot;.&quot;AGE&quot;) AS &quot;MAX&quot;,MIN(&quot;USERS&quot;.&quot;AGE&quot;) AS &quot;MIN&quot;,AVG(&quot;USERS&quot;.&quot;AGE&quot;) AS &quot;AVG&quot; 
   FROM &quot;USERS&quot; &quot;USERS&quot; 
   WHERE &quot;USERS&quot;.&quot;ID&quot; &gt; 0 
   GROUP BY &quot;USERS&quot;.&quot;AGE&quot; 
   HAVING (&quot;USERS&quot;.&quot;AGE&quot; &gt; 1 AND COUNT(1) &gt; 0)
 */
</code></pre>
', TO_DATE('2016-12-02 15:56:48', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-03 14:22:09', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 分组查询
Chloe 支持分组查询以及分组后 Having 过滤和聚合查询。
```csharp
IQuery<User> q = context.Query<User>();

IGroupingQuery<User> g = q.Where(a => a.Id > 0).GroupBy(a => a.Age);
g = g.Having(a => a.Age > 1 && AggregateFunctions.Count() > 0);

g.Select(a => new
{
    a.Age,
    Count = AggregateFunctions.Count(),
    Sum = AggregateFunctions.Sum(a.Age),
    Max = AggregateFunctions.Max(a.Age),
    Min = AggregateFunctions.Min(a.Age),
    Avg = AggregateFunctions.Average(a.Age)
}).ToList();
/*
 * SELECT "USERS"."AGE" AS "AGE",COUNT(1) AS "COUNT",SUM("USERS"."AGE") AS "SUM",MAX("USERS"."AGE") AS "MAX",MIN("USERS"."AGE") AS "MIN",AVG("USERS"."AGE") AS "AVG" 
   FROM "USERS" "USERS" 
   WHERE "USERS"."ID" > 0 
   GROUP BY "USERS"."AGE" 
   HAVING ("USERS"."AGE" > 1 AND COUNT(1) > 0)
 */
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325149605842124800', 'Oracle-Sql查询', 'Oracle-Sql查询', 'Oracle-Sql查询', '<h1 id="h1-sql-"><a name="Sql查询" class="reference-link"></a><span class="header-link octicon octicon-link"></span>Sql查询</h1><p>对于一些极其复杂的 sql 查询，还是得依赖原生 sql，因此，Chloe 提供了原生 sql 查询接口。<br><strong>获取满足条件的用户信息，将结果映射到 User 类上：</strong></p>
<pre><code class="lang-csharp">context.SqlQuery&lt;User&gt;(&quot;select * from Users where Age&gt;:age&quot;, new DbParam(&quot;:age&quot;, 18)).ToList();
</code></pre>
<p><strong>获取满足条件的用户 Id：</strong></p>
<pre><code class="lang-csharp">context.SqlQuery&lt;int&gt;(&quot;select Id from Users where Age&gt;:age&quot;, new DbParam(&quot;:age&quot;, 18)).ToList();
</code></pre>
<p><strong>支持存储过程：</strong></p>
<pre><code class="lang-csharp">context.SqlQuery&lt;User&gt;(&quot;Proc_Test&quot;, CommandType.StoredProcedure, new DbParam(&quot;:age&quot;, 18)).ToList();
</code></pre>
', TO_DATE('2016-12-02 15:57:25', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-03 14:25:01', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# Sql查询
对于一些极其复杂的 sql 查询，还是得依赖原生 sql，因此，Chloe 提供了原生 sql 查询接口。
**获取满足条件的用户信息，将结果映射到 User 类上：**
```csharp
context.SqlQuery<User>("select * from Users where Age>:age", new DbParam(":age", 18)).ToList();
```
**获取满足条件的用户 Id：**
```csharp
context.SqlQuery<int>("select Id from Users where Age>:age", new DbParam(":age", 18)).ToList();
```
**支持存储过程：**
```csharp
context.SqlQuery<User>("Proc_Test", CommandType.StoredProcedure, new DbParam(":age", 18)).ToList();
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325149662540726272', 'Oracle-插入数据', 'Oracle-插入数据', 'Oracle-插入数据', '<h1 id="h1-u63D2u5165u6570u636E"><a name="插入数据" class="reference-link"></a><span class="header-link octicon octicon-link"></span>插入数据</h1><p>Chloe 具备两种插入数据的方式。<br><strong>1.实体插入：</strong><br>该方式插入，如果一个实体存在自增列（序列），会自动将自增列设置到相应的属性上。</p>
<pre><code class="lang-csharp">User user = new User();
user.Name = &quot;lu&quot;;
user.Age = 18;
user.Gender = Gender.Man;
user.CityId = 1;
user.OpTime = DateTime.Now;

/* 会自动将自增 Id 设置到 user 的 Id 属性上 */
user = context.Insert(user);
/*
 * SELECT &quot;USERS_AUTOID&quot;.&quot;NEXTVAL&quot; FROM &quot;DUAL&quot;
 * Int32 :P_0 = 15;
   String :P_1 = &#39;lu&#39;;
   Int32 :P_2 = 1;
   Int32 :P_3 = 18;
   DateTime :P_4 = &#39;2016/9/5 9:16:59&#39;;
   INSERT INTO &quot;USERS&quot;(&quot;ID&quot;,&quot;NAME&quot;,&quot;GENDER&quot;,&quot;AGE&quot;,&quot;CITYID&quot;,&quot;OPTIME&quot;)     
   VALUES(:P_0,:P_1,:P_2,:P_3,:P_2,:P_4)
 */
</code></pre>
<p><strong>2.lambda 方式插入：</strong><br>此种方式插入的好处是，可以指定列插入，就像写 sql 一样简单。<br>同时，该方式插入返回表主键值。如果实体主键是自增列，返回值就会是自增值。</p>
<pre><code class="lang-csharp">/* 返回主键 Id */
int id = (int)context.Insert&lt;User&gt;(() =&gt; new User()
{
    Name = &quot;lu&quot;,
    Age = 18,
    Gender = Gender.Man,
    CityId = 1,
    OpTime = DateTime.Now
});
/*
 * SELECT &quot;USERS_AUTOID&quot;.&quot;NEXTVAL&quot; FROM &quot;DUAL&quot;
 * Int32 :P_0 = 14;
   INSERT INTO &quot;USERS&quot;(&quot;NAME&quot;,&quot;AGE&quot;,&quot;GENDER&quot;,&quot;CITYID&quot;,&quot;OPTIME&quot;,&quot;ID&quot;) 
   VALUES(N&#39;lu&#39;,18,1,1,SYSTIMESTAMP,:P_0)
 */
</code></pre>
', TO_DATE('2016-12-02 15:57:38', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-04 22:22:24', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 插入数据
Chloe 具备两种插入数据的方式。
**1.实体插入：**
该方式插入，如果一个实体存在自增列（序列），会自动将自增列设置到相应的属性上。
```csharp
User user = new User();
user.Name = "lu";
user.Age = 18;
user.Gender = Gender.Man;
user.CityId = 1;
user.OpTime = DateTime.Now;

/* 会自动将自增 Id 设置到 user 的 Id 属性上 */
user = context.Insert(user);
/*
 * SELECT "USERS_AUTOID"."NEXTVAL" FROM "DUAL"
 * Int32 :P_0 = 15;
   String :P_1 = ''lu'';
   Int32 :P_2 = 1;
   Int32 :P_3 = 18;
   DateTime :P_4 = ''2016/9/5 9:16:59'';
   INSERT INTO "USERS"("ID","NAME","GENDER","AGE","CITYID","OPTIME")     
   VALUES(:P_0,:P_1,:P_2,:P_3,:P_2,:P_4)
 */
```
**2.lambda 方式插入：**
此种方式插入的好处是，可以指定列插入，就像写 sql 一样简单。
同时，该方式插入返回表主键值。如果实体主键是自增列，返回值就会是自增值。
```csharp
/* 返回主键 Id */
int id = (int)context.Insert<User>(() => new User()
{
    Name = "lu",
    Age = 18,
    Gender = Gender.Man,
    CityId = 1,
    OpTime = DateTime.Now
});
/*
 * SELECT "USERS_AUTOID"."NEXTVAL" FROM "DUAL"
 * Int32 :P_0 = 14;
   INSERT INTO "USERS"("NAME","AGE","GENDER","CITYID","OPTIME","ID") 
   VALUES(N''lu'',18,1,1,SYSTIMESTAMP,:P_0)
 */
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325149150596562944', 'Oracle-实体特性', 'Oracle-实体特性', 'Oracle-实体特性', '<h1 id="h1-u5B9Eu4F53u7279u6027"><a name="实体特性" class="reference-link"></a><span class="header-link octicon octicon-link"></span>实体特性</h1><p><strong>Chloe.Entity.TableAttribute：</strong><br>Name：映射的表名。<br>实体对应的表默认是实体类名，如实体类型名与表名不一致，可通过该特性指定映射的表名。</p>
<pre><code class="lang-csharp">public class TableAttribute : Attribute
{
    public TableAttribute() { }
    public TableAttribute(string name)
    {
        Name = name;
    }
    public string Name { get; set; }
}
</code></pre>
<p><strong>Chloe.Entity.ColumnAttribute：</strong><br>Name：映射的列名，如不指定，则默认使用属性名。<br>IsPrimaryKey：指示列是否为主键，默认为 false。<br>当一个实体没显示指定主键的时候，Chloe 默认选择名为 Id 的属性（如果存在）作为主键列。</p>
<pre><code class="lang-csharp">public class ColumnAttribute : Attribute
{
    public ColumnAttribute() { }
    public ColumnAttribute(string name)
    {
        this.Name = name;
    }
    public string Name { get; set; }
    public bool IsPrimaryKey { get; set; }
}
</code></pre>
<p><strong>Chloe.Oracle.SequenceAttribute：</strong><br>标记属性通过序列实现自增，需要指定序列名称。</p>
<pre><code class="lang-csharp">public class SequenceAttribute : Attribute
{
    public SequenceAttribute(string name)
    {
        this.Name = name;
    }
    public string Name { get; private set; }
}
</code></pre>
<p><strong>Chloe.Entity.NotMappedAttribute：</strong><br>指示属性不映射任何列。</p>
<pre><code class="lang-csharp">public class NotMappedAttribute : Attribute
{
}
</code></pre>
', TO_DATE('2016-12-02 15:55:36', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-03 13:56:31', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 实体特性
**Chloe.Entity.TableAttribute：**
Name：映射的表名。
实体对应的表默认是实体类名，如实体类型名与表名不一致，可通过该特性指定映射的表名。
```csharp
public class TableAttribute : Attribute
{
    public TableAttribute() { }
    public TableAttribute(string name)
    {
        Name = name;
    }
    public string Name { get; set; }
}
```
**Chloe.Entity.ColumnAttribute：**
Name：映射的列名，如不指定，则默认使用属性名。
IsPrimaryKey：指示列是否为主键，默认为 false。
当一个实体没显示指定主键的时候，Chloe 默认选择名为 Id 的属性（如果存在）作为主键列。
```csharp
public class ColumnAttribute : Attribute
{
    public ColumnAttribute() { }
    public ColumnAttribute(string name)
    {
        this.Name = name;
    }
    public string Name { get; set; }
    public bool IsPrimaryKey { get; set; }
}
```
**Chloe.Oracle.SequenceAttribute：**
标记属性通过序列实现自增，需要指定序列名称。
```csharp
public class SequenceAttribute : Attribute
{
    public SequenceAttribute(string name)
    {
        this.Name = name;
    }
    public string Name { get; private set; }
}
```
**Chloe.Entity.NotMappedAttribute：**
指示属性不映射任何列。
```csharp
public class NotMappedAttribute : Attribute
{
}
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325149206355640320', 'Oracle-实体定义', 'Oracle-实体定义', 'Oracle-实体定义', '<h1 id="h1-u5B9Eu4F53u5B9Au4E49"><a name="实体定义" class="reference-link"></a><span class="header-link octicon octicon-link"></span>实体定义</h1><p>实体为纯 POCO，支持可空类型以及枚举类型映射。</p>
<pre><code class="lang-csharp">public enum Gender
{
    Man = 1,
    Woman
}
</code></pre>
<pre><code class="lang-csharp">[TableAttribute(&quot;Users&quot;)]
public class User
{
    [Sequence(&quot;USERS_AUTOID&quot;)]
    public int Id { get; set; }
    public string Name { get; set; }
    public Gender? Gender { get; set; }
    public int? Age { get; set; }
    public int? CityId { get; set; }
    public DateTime? OpTime { get; set; }
}
</code></pre>
<pre><code class="lang-csharp">public class City
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int ProvinceId { get; set; }
}
</code></pre>
<pre><code class="lang-csharp">public class Province
{
    public int Id { get; set; }
    public string Name { get; set; }
}
</code></pre>
', TO_DATE('2016-12-02 15:55:50', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-03 13:57:47', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 实体定义
实体为纯 POCO，支持可空类型以及枚举类型映射。
```csharp
public enum Gender
{
    Man = 1,
    Woman
}
```
```csharp
[TableAttribute("Users")]
public class User
{
    [Sequence("USERS_AUTOID")]
    public int Id { get; set; }
    public string Name { get; set; }
    public Gender? Gender { get; set; }
    public int? Age { get; set; }
    public int? CityId { get; set; }
    public DateTime? OpTime { get; set; }
}
```
```csharp
public class City
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int ProvinceId { get; set; }
}
```
```csharp
public class Province
{
    public int Id { get; set; }
    public string Name { get; set; }
}
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325149282020884480', 'Oracle-创建DbContext', 'Oracle-创建DbContext', 'Oracle-创建DbContext', '<h1 id="h1--dbcontext"><a name="创建 DbContext" class="reference-link"></a><span class="header-link octicon octicon-link"></span>创建 DbContext</h1><p>对于 Oracle 数据库，需要引用程序集 Chloe.dll 和 Chloe.Oracle.dll，然后使用 Chloe.Oracle.OracleContext 创建上下文实例。<br>因为框架本身需要与具体的数据库驱动解耦，所以 OracleContext 构造函数需要一个 IDbConnectionFactory 的参数，IDbConnectionFactory 接口只有一个 CreateConnection() 方法，必须先建个类，实现 CreateConnection 方法。</p>
<pre><code class="lang-csharp">public class OracleConnectionFactory : IDbConnectionFactory
{
    string _connString = null;
    public OracleConnectionFactory(string connString)
    {
        this._connString = connString;
    }
    public IDbConnection CreateConnection()
    {
        OracleConnection oracleConnection = new OracleConnection(this._connString);
        OracleConnectionDecorator conn = new OracleConnectionDecorator(oracleConnection);
        return conn;
    }
}
</code></pre>
<p>由于笔者使用的是 Oracle.ManagedDataAccess 数据库驱动，OracleConnection 创建的 DbCommand 默认是以顺序方式绑定参数，所以，上述例子使用了装饰者模式对 OracleConnection 封装了一遍，主要就是修改 DbCommand 参数绑定方式。OracleConnectionDecorator 定义如下：</p>
<pre><code class="lang-csharp">class OracleConnectionDecorator : IDbConnection, IDisposable
{
    private OracleConnection _oracleConnection;
    public OracleConnectionDecorator(OracleConnection oracleConnection)
    {
        if (oracleConnection == null)
            throw new Exception(&quot;Please call 911.&quot;);
        _oracleConnection = oracleConnection;
    }

    public string ConnectionString
    {
        get { return _oracleConnection.ConnectionString; }
        set { _oracleConnection.ConnectionString = value; }
    }
    public int ConnectionTimeout
    {
        get { return _oracleConnection.ConnectionTimeout; }
    }
    public string Database
    {
        get { return _oracleConnection.Database; }
    }
    public ConnectionState State
    {
        get { return _oracleConnection.State; }
    }

    public IDbTransaction BeginTransaction()
    {
        return _oracleConnection.BeginTransaction();
    }
    public IDbTransaction BeginTransaction(IsolationLevel il)
    {
        return _oracleConnection.BeginTransaction(il);
    }
    public void ChangeDatabase(string databaseName)
    {
        _oracleConnection.ChangeDatabase(databaseName);
    }
    public void Close()
    {
        _oracleConnection.Close();
    }
    public IDbCommand CreateCommand()
    {
        var cmd = _oracleConnection.CreateCommand();
        cmd.BindByName = true;
        return cmd;
    }
    public void Open()
    {
        _oracleConnection.Open();
    }

    public void Dispose()
    {
        _oracleConnection.Dispose();
    }
}
</code></pre>
<p>接下来就可以创建 OracleContext：</p>
<pre><code class="lang-csharp">string connString = &quot;Your connection string&quot;;
OracleContext context = new OracleContext(new OracleConnectionFactory(connString));
</code></pre>
<p>OracleContext 生成 sql 语句时默认将所有字段转成大写形式，如需要修改该默认设置，操作如下：</p>
<pre><code class="lang-csharp">context.ConvertToUppercase = false;
</code></pre>
', TO_DATE('2016-12-02 15:56:08', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-04 22:09:57', 'YYYY-MM-DD HH24:MI:SS'), '0', null, null);
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325146546785222656', 'MySql-存储过程', 'MySql-存储过程', 'MySql-存储过程', '<h1 id="h1-u5B58u50A8u8FC7u7A0B"><a name="存储过程" class="reference-link"></a><span class="header-link octicon octicon-link"></span>存储过程</h1><p>Chloe 支持存储过程以及 output 参数。<br><strong>通过存储过程获取一个 User 信息：</strong></p>
<pre><code class="lang-csharp">DbParam id = new DbParam(&quot;?id&quot;, 1);
User user = context.SqlQuery&lt;User&gt;(&quot;Proc_GetUser&quot;, CommandType.StoredProcedure, id).FirstOrDefault();
</code></pre>
<p><strong>通过存储过程的 output 参数获取一个用户的 name：</strong></p>
<pre><code class="lang-csharp">DbParam id = new DbParam(&quot;?id&quot;, 1);
DbParam outputName = new DbParam(&quot;?name&quot;, null, typeof(string)) { Direction = ParamDirection.Output };
context.Session.ExecuteNonQuery(&quot;Proc_GetUserName&quot;, CommandType.StoredProcedure, id, outputName);
</code></pre>
', TO_DATE('2016-12-02 15:45:16', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-02 19:25:10', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 存储过程
Chloe 支持存储过程以及 output 参数。
**通过存储过程获取一个 User 信息：**
```csharp
DbParam id = new DbParam("?id", 1);
User user = context.SqlQuery<User>("Proc_GetUser", CommandType.StoredProcedure, id).FirstOrDefault();
```
**通过存储过程的 output 参数获取一个用户的 name：**
```csharp
DbParam id = new DbParam("?id", 1);
DbParam outputName = new DbParam("?name", null, typeof(string)) { Direction = ParamDirection.Output };
context.Session.ExecuteNonQuery("Proc_GetUserName", CommandType.StoredProcedure, id, outputName);
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325146606914764800', 'MySql-事务', 'MySql-事务', 'MySql-事务', '<h1 id="h1-u4E8Bu52A1u652Fu6301"><a name="事务支持" class="reference-link"></a><span class="header-link octicon octicon-link"></span>事务支持</h1><p><strong>基本用法：</strong></p>
<pre><code class="lang-csharp">string connString = &quot;Your connection string&quot;;
using (MySqlContext context = new MySqlContext(new MySqlConnectionFactory(connString)))
{
    try
    {
        context.Session.BeginTransaction();

        /* do some things here */
        context.Update(user);
        context.Delete&lt;User&gt;(a =&gt; a.Gender == null);

        context.Session.CommitTransaction();
    }
    catch
    {
        if (context.Session.IsInTransaction)
            context.Session.RollbackTransaction();
        throw;
    }
}
</code></pre>
', TO_DATE('2016-12-02 15:45:30', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-02 19:26:16', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 事务支持
**基本用法：**
```csharp
string connString = "Your connection string";
using (MySqlContext context = new MySqlContext(new MySqlConnectionFactory(connString)))
{
    try
    {
        context.Session.BeginTransaction();

        /* do some things here */
        context.Update(user);
        context.Delete<User>(a => a.Gender == null);

        context.Session.CommitTransaction();
    }
    catch
    {
        if (context.Session.IsInTransaction)
            context.Session.RollbackTransaction();
        throw;
    }
}
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325146654268456960', 'MySql-常用函数', 'MySql-常用函数', 'MySql-常用函数', '<h1 id="h1-u5E38u7528u51FDu6570"><a name="常用函数" class="reference-link"></a><span class="header-link octicon octicon-link"></span>常用函数</h1><p><strong>Chloe 对很多数据库函数支持很丰富，具体用法如下：</strong></p>
<pre><code class="lang-csharp">IQuery&lt;User&gt; q = context.Query&lt;User&gt;();

var space = new char[] { &#39; &#39; };

DateTime startTime = DateTime.Now;
DateTime endTime = DateTime.Now.AddDays(1);

var ret = q.Select(a =&gt; new
{
    Id = a.Id,

    String_Length = (int?)a.Name.Length,//LENGTH(`Users`.`Name`)
    Substring = a.Name.Substring(0),//SUBSTRING(`Users`.`Name`,0 + 1,LENGTH(`Users`.`Name`))
    Substring1 = a.Name.Substring(1),//SUBSTRING(`Users`.`Name`,1 + 1,LENGTH(`Users`.`Name`))
    Substring1_2 = a.Name.Substring(1, 2),//SUBSTRING(`Users`.`Name`,1 + 1,2)
    ToLower = a.Name.ToLower(),//LOWER(`Users`.`Name`)
    ToUpper = a.Name.ToUpper(),//UPPER(`Users`.`Name`)
    IsNullOrEmpty = string.IsNullOrEmpty(a.Name),//CASE WHEN (`Users`.`Name` IS NULL OR `Users`.`Name` = N&#39;&#39;) THEN 1 ELSE 0 END = 1
    Contains = (bool?)a.Name.Contains(&quot;s&quot;),//`Users`.`Name` LIKE CONCAT(&#39;%&#39;,N&#39;s&#39;,&#39;%&#39;)
    Trim = a.Name.Trim(),//TRIM(`Users`.`Name`)
    TrimStart = a.Name.TrimStart(space),//LTRIM(`Users`.`Name`)
    TrimEnd = a.Name.TrimEnd(space),//RTRIM(`Users`.`Name`)
    StartsWith = (bool?)a.Name.StartsWith(&quot;s&quot;),//`Users`.`Name` LIKE CONCAT(N&#39;s&#39;,&#39;%&#39;)
    EndsWith = (bool?)a.Name.EndsWith(&quot;s&quot;),//`Users`.`Name` LIKE CONCAT(&#39;%&#39;,N&#39;s&#39;)

    DiffYears = DbFunctions.DiffYears(startTime, endTime),//TIMESTAMPDIFF(YEAR,?P_0,?P_1)
    DiffMonths = DbFunctions.DiffMonths(startTime, endTime),//TIMESTAMPDIFF(MONTH,?P_0,?P_1)
    DiffDays = DbFunctions.DiffDays(startTime, endTime),//TIMESTAMPDIFF(DAY,?P_0,?P_1)
    DiffHours = DbFunctions.DiffHours(startTime, endTime),//TIMESTAMPDIFF(HOUR,?P_0,?P_1)
    DiffMinutes = DbFunctions.DiffMinutes(startTime, endTime),//TIMESTAMPDIFF(MINUTE,?P_0,?P_1)
    DiffSeconds = DbFunctions.DiffSeconds(startTime, endTime),//TIMESTAMPDIFF(SECOND,?P_0,?P_1)
    //DiffMilliseconds = DbFunctions.DiffMilliseconds(startTime, endTime),//MySql 不支持 Millisecond
    //DiffMicroseconds = DbFunctions.DiffMicroseconds(startTime, endTime),//ex

    Now = DateTime.Now,//NOW()
    UtcNow = DateTime.UtcNow,//UTC_TIMESTAMP()
    Today = DateTime.Today,//CURDATE()
    Date = DateTime.Now.Date,//DATE(NOW())
    Year = DateTime.Now.Year,//YEAR(NOW())
    Month = DateTime.Now.Month,//MONTH(NOW())
    Day = DateTime.Now.Day,//DAY(NOW())
    Hour = DateTime.Now.Hour,//HOUR(NOW())
    Minute = DateTime.Now.Minute,//MINUTE(NOW())
    Second = DateTime.Now.Second,//SECOND(NOW())
    Millisecond = DateTime.Now.Millisecond,//?P_2 AS `Millisecond`
    DayOfWeek = DateTime.Now.DayOfWeek,//(DAYOFWEEK(NOW()) - 1)

    //Byte_Parse = byte.Parse(&quot;1&quot;),//不支持
    Int_Parse = int.Parse(&quot;1&quot;),//CAST(N&#39;1&#39; AS SIGNED)
    Int16_Parse = Int16.Parse(&quot;11&quot;),//CAST(N&#39;11&#39; AS SIGNED)
    Long_Parse = long.Parse(&quot;2&quot;),//CAST(N&#39;2&#39; AS SIGNED)
    //Double_Parse = double.Parse(&quot;3&quot;),//N&#39;3&#39; 不支持，否则可能会成为BUG
    //Float_Parse = float.Parse(&quot;4&quot;),//N&#39;4&#39; 不支持，否则可能会成为BUG
    //Decimal_Parse = decimal.Parse(&quot;5&quot;),//不支持
    Guid_Parse = Guid.Parse(&quot;D544BC4C-739E-4CD3-A3D3-7BF803FCE179&quot;),//N&#39;D544BC4C-739E-4CD3-A3D3-7BF803FCE179&#39;

    Bool_Parse = bool.Parse(&quot;1&quot;),//CAST(N&#39;1&#39; AS SIGNED)
    DateTime_Parse = DateTime.Parse(&quot;2014-1-1&quot;),//CAST(N&#39;2014-1-1&#39; AS DATETIME)
}).ToList();
</code></pre>
<p>上述的函数可以用于 Select 方法，亦可用在 Where 或其它方法的 lambda 表达式树中，最终都会翻译成数据库函数。</p>
', TO_DATE('2016-12-02 15:45:41', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-02 19:27:18', 'YYYY-MM-DD HH24:MI:SS'), '0', null, null);
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325146391176544256', 'MySql-更新数据', 'MySql-更新数据', 'MySql-更新数据', '<h1 id="h1-u66F4u65B0u6570u636E"><a name="更新数据" class="reference-link"></a><span class="header-link octicon octicon-link"></span>更新数据</h1><p>Chloe 支持两种数据更新方式。<br><strong>1.实体更新：</strong></p>
<pre><code class="lang-csharp">User user = new User();
user.Id = 1;
user.Name = &quot;lu&quot;;
user.Age = 28;
user.Gender = Gender.Man;
user.OpTime = DateTime.Now;

/* 更新所有映射的字段 */
context.Update(user);
/*
 * String ?P_0 = &#39;lu&#39;;
   Gender ?P_1 = Man;
   Int32 ?P_2 = 28;
   Nullable&lt;Int32&gt; ?P_3 = NULL;
   DateTime ?P_4 = &#39;2016/8/26 18:18:36&#39;;
   Int32 ?P_5 = 1;
   UPDATE `Users` SET `Name`=?P_0,`Gender`=?P_1,`Age`=?P_2,`CityId`=?P_3,`OpTime`=?P_4 
   WHERE `Users`.`Id` = ?P_5
 */
</code></pre>
<p>由于 user 对象未被上下文跟踪，这会使所有的映射列都会被更新。Chloe 也支持类似 EF 一样只更新被修改过的属性。</p>
<pre><code class="lang-csharp">/*
 * 支持只更新属性值已变的属性
 */

/* 在修改实体属性前让上下文跟踪实体 */
context.TrackEntity(user);

/* 然后再修改实体属性 */
user.Name = user.Name + &quot;1&quot;;

/* 然后调用 Update 方法，这时只会更新被修改过的属性 */
context.Update(user);
/*
 * String ?P_0 = &#39;lu1&#39;;
   Int32 ?P_1 = 1;
   UPDATE `Users` SET `Name`=?P_0 WHERE `Users`.`Id` = ?P_1
 */
</code></pre>
<p><strong>2.lambda 方式更新：</strong><br>该方式解决的问题是：1.指定列更新；2.批量更新；3.支持类似 Age=Age + 100 这样更新字段。用法如下：</p>
<pre><code class="lang-csharp">context.Update&lt;User&gt;(a =&gt; a.Age &gt; 18, a =&gt; new User()
{
    Name = a.Name,
    Age = a.Age + 100,
    Gender = Gender.Man,
    OpTime = DateTime.Now
});
/*
 * UPDATE `Users` SET `Name`=`Users`.`Name`,`Age`=(`Users`.`Age` + 100),`Gender`=1,`OpTime`=NOW() 
   WHERE `Users`.`Age` &gt; 18
 */
</code></pre>
', TO_DATE('2016-12-02 15:44:38', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-02 19:21:37', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 更新数据
Chloe 支持两种数据更新方式。
**1.实体更新：**
```csharp
User user = new User();
user.Id = 1;
user.Name = "lu";
user.Age = 28;
user.Gender = Gender.Man;
user.OpTime = DateTime.Now;

/* 更新所有映射的字段 */
context.Update(user);
/*
 * String ?P_0 = ''lu'';
   Gender ?P_1 = Man;
   Int32 ?P_2 = 28;
   Nullable<Int32> ?P_3 = NULL;
   DateTime ?P_4 = ''2016/8/26 18:18:36'';
   Int32 ?P_5 = 1;
   UPDATE `Users` SET `Name`=?P_0,`Gender`=?P_1,`Age`=?P_2,`CityId`=?P_3,`OpTime`=?P_4 
   WHERE `Users`.`Id` = ?P_5
 */
```
由于 user 对象未被上下文跟踪，这会使所有的映射列都会被更新。Chloe 也支持类似 EF 一样只更新被修改过的属性。
```csharp
/*
 * 支持只更新属性值已变的属性
 */

/* 在修改实体属性前让上下文跟踪实体 */
context.TrackEntity(user);

/* 然后再修改实体属性 */
user.Name = user.Name + "1";

/* 然后调用 Update 方法，这时只会更新被修改过的属性 */
context.Update(user);
/*
 * String ?P_0 = ''lu1'';
   Int32 ?P_1 = 1;
   UPDATE `Users` SET `Name`=?P_0 WHERE `Users`.`Id` = ?P_1
 */
```
**2.lambda 方式更新：**
该方式解决的问题是：1.指定列更新；2.批量更新；3.支持类似 Age=Age + 100 这样更新字段。用法如下：
```csharp
context.Update<User>(a => a.Age > 18, a => new User()
{
    Name = a.Name,
    Age = a.Age + 100,
    Gender = Gender.Man,
    OpTime = DateTime.Now
});
/*
 * UPDATE `Users` SET `Name`=`Users`.`Name`,`Age`=(`Users`.`Age` + 100),`Gender`=1,`OpTime`=NOW() 
   WHERE `Users`.`Age` > 18
 */
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325146449968103424', 'MySql-删除数据', 'MySql-删除数据', 'MySql-删除数据', '<h1 id="h1-u5220u9664u6570u636E"><a name="删除数据" class="reference-link"></a><span class="header-link octicon octicon-link"></span>删除数据</h1><p>Chloe 支持两种数据删除方式。<br><strong>1.实体删除：</strong><br>该方式删除必须要求实体拥有一个主键，否则会报异常提示。</p>
<pre><code class="lang-csharp">User user = new User();
user.Id = 1;
context.Delete(user);
/*
 * Int32 ?P_0 = 1;
   DELETE `Users` FROM `Users` WHERE `Users`.`Id` = ?P_0
 */
</code></pre>
<p><strong>2.lambda 方式删除：</strong><br>使用该方式可以删除单条数据，也可以删除多条数据。</p>
<pre><code class="lang-csharp">/* 删除单条数据 */
context.Delete&lt;User&gt;(a =&gt; a.Id == 1);
/*
 * DELETE `Users` FROM `Users` WHERE `Users`.`Id` = 1
 */

/* 批量删除满足条件的数据 */
context.Delete&lt;User&gt;(a =&gt; a.Age &gt; 18);
/*
 * DELETE `Users` FROM `Users` WHERE `Users`.`Age` &gt; 18
 */
</code></pre>
', TO_DATE('2016-12-02 15:44:52', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-02 19:24:17', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 删除数据
Chloe 支持两种数据删除方式。
**1.实体删除：**
该方式删除必须要求实体拥有一个主键，否则会报异常提示。
```csharp
User user = new User();
user.Id = 1;
context.Delete(user);
/*
 * Int32 ?P_0 = 1;
   DELETE `Users` FROM `Users` WHERE `Users`.`Id` = ?P_0
 */
```
**2.lambda 方式删除：**
使用该方式可以删除单条数据，也可以删除多条数据。
```csharp
/* 删除单条数据 */
context.Delete<User>(a => a.Id == 1);
/*
 * DELETE `Users` FROM `Users` WHERE `Users`.`Id` = 1
 */

/* 批量删除满足条件的数据 */
context.Delete<User>(a => a.Age > 18);
/*
 * DELETE `Users` FROM `Users` WHERE `Users`.`Age` > 18
 */
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325146327683170304', 'MySql-插入数据', 'MySql-插入数据', 'MySql-插入数据', '<h1 id="h1-u63D2u5165u6570u636E"><a name="插入数据" class="reference-link"></a><span class="header-link octicon octicon-link"></span>插入数据</h1><p>Chloe 具备两种插入数据的方式。<br><strong>1.实体插入：</strong><br>该方式插入，如果一个实体存在自增列，会自动将自增列设置到相应的属性上。</p>
<pre><code class="lang-csharp">User user = new User();
user.Name = &quot;lu&quot;;
user.Age = 18;
user.Gender = Gender.Man;
user.CityId = 1;
user.OpTime = DateTime.Now;

/* 会自动将自增 Id 设置到 user 的 Id 属性上 */
user = context.Insert(user);
/*
 * String ?P_0 = &#39;lu&#39;;
   Gender ?P_1 = Man;
   Int32 ?P_2 = 18;
   Int32 ?P_3 = 1;
   DateTime ?P_4 = &#39;2016/8/26 18:11:26&#39;;
   INSERT INTO `Users`(`Name`,`Gender`,`Age`,`CityId`,`OpTime`) 
   VALUES(?P_0,?P_1,?P_2,?P_3,?P_4);SELECT @@IDENTITY
 */
</code></pre>
<p><strong>2.lambda 方式插入：</strong><br>此种方式插入的好处是，可以指定列插入，就像写 sql 一样简单。<br>同时，该方式插入返回表主键值。如果实体主键是自增列，返回值就会是自增值。</p>
<pre><code class="lang-csharp">/* 返回主键 Id */
int id = (int)context.Insert&lt;User&gt;(() =&gt; new User()
{
    Name = &quot;lu&quot;,
    Age = 18,
    Gender = Gender.Man,
    CityId = 1,
    OpTime = DateTime.Now
});
/*
 * INSERT INTO `Users`(`Name`,`Age`,`Gender`,`CityId`,`OpTime`) 
   VALUES(N&#39;lu&#39;,18,1,1,NOW());SELECT @@IDENTITY
 */
</code></pre>
', TO_DATE('2016-12-02 15:44:23', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-03 15:12:00', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 插入数据
Chloe 具备两种插入数据的方式。
**1.实体插入：**
该方式插入，如果一个实体存在自增列，会自动将自增列设置到相应的属性上。
```csharp
User user = new User();
user.Name = "lu";
user.Age = 18;
user.Gender = Gender.Man;
user.CityId = 1;
user.OpTime = DateTime.Now;

/* 会自动将自增 Id 设置到 user 的 Id 属性上 */
user = context.Insert(user);
/*
 * String ?P_0 = ''lu'';
   Gender ?P_1 = Man;
   Int32 ?P_2 = 18;
   Int32 ?P_3 = 1;
   DateTime ?P_4 = ''2016/8/26 18:11:26'';
   INSERT INTO `Users`(`Name`,`Gender`,`Age`,`CityId`,`OpTime`) 
   VALUES(?P_0,?P_1,?P_2,?P_3,?P_4);SELECT @@IDENTITY
 */
```
**2.lambda 方式插入：**
此种方式插入的好处是，可以指定列插入，就像写 sql 一样简单。
同时，该方式插入返回表主键值。如果实体主键是自增列，返回值就会是自增值。
```csharp
/* 返回主键 Id */
int id = (int)context.Insert<User>(() => new User()
{
    Name = "lu",
    Age = 18,
    Gender = Gender.Man,
    CityId = 1,
    OpTime = DateTime.Now
});
/*
 * INSERT INTO `Users`(`Name`,`Age`,`Gender`,`CityId`,`OpTime`) 
   VALUES(N''lu'',18,1,1,NOW());SELECT @@IDENTITY
 */
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325146192995680256', 'MySql-聚合查询', 'MySql-聚合查询', 'MySql-聚合查询', '<h1 id="h1-u805Au5408u67E5u8BE2"><a name="聚合查询" class="reference-link"></a><span class="header-link octicon octicon-link"></span>聚合查询</h1><p>Chloe 可以像写 sql 一样实现聚合查询。</p>
<pre><code class="lang-csharp">IQuery&lt;User&gt; q = context.Query&lt;User&gt;();

q.Select(a =&gt; AggregateFunctions.Count()).First();
/*
 * SELECT COUNT(1) AS `C` FROM `Users` AS `Users` LIMIT 0,1
 */

/* 支持多个聚合函数 */
q.Select(a =&gt; new
{
    Count = AggregateFunctions.Count(),
    LongCount = AggregateFunctions.LongCount(),
    Sum = AggregateFunctions.Sum(a.Age),
    Max = AggregateFunctions.Max(a.Age),
    Min = AggregateFunctions.Min(a.Age),
    Average = AggregateFunctions.Average(a.Age)
}).First();
/*
 * SELECT COUNT(1) AS `Count`,COUNT(1) AS `LongCount`,CAST(SUM(`Users`.`Age`) AS SIGNED) AS `Sum`,MAX(`Users`.`Age`) AS `Max`,MIN(`Users`.`Age`) AS `Min`,AVG(`Users`.`Age`) AS `Average` 
   FROM `Users` AS `Users` LIMIT 0,1
 */

var count = q.Count();
/*
 * SELECT COUNT(1) AS `C` FROM `Users` AS `Users`
 */

var longCount = q.LongCount();
/*
 * SELECT COUNT(1) AS `C` FROM `Users` AS `Users`
 */

var sum = q.Sum(a =&gt; a.Age);
/*
 * SELECT CAST(SUM(`Users`.`Age`) AS SIGNED) AS `C` FROM `Users` AS `Users`
 */

var max = q.Max(a =&gt; a.Age);
/*
 * SELECT MAX(`Users`.`Age`) AS `C` FROM `Users` AS `Users`
 */

var min = q.Min(a =&gt; a.Age);
/*
 * SELECT MIN(`Users`.`Age`) AS `C` FROM `Users` AS `Users`
 */

var avg = q.Average(a =&gt; a.Age);
/*
 * SELECT AVG(`Users`.`Age`) AS `C` FROM `Users` AS `Users`
 */
</code></pre>
', TO_DATE('2016-12-02 15:43:51', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-02 19:12:42', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 聚合查询
Chloe 可以像写 sql 一样实现聚合查询。
```csharp
IQuery<User> q = context.Query<User>();

q.Select(a => AggregateFunctions.Count()).First();
/*
 * SELECT COUNT(1) AS `C` FROM `Users` AS `Users` LIMIT 0,1
 */

/* 支持多个聚合函数 */
q.Select(a => new
{
    Count = AggregateFunctions.Count(),
    LongCount = AggregateFunctions.LongCount(),
    Sum = AggregateFunctions.Sum(a.Age),
    Max = AggregateFunctions.Max(a.Age),
    Min = AggregateFunctions.Min(a.Age),
    Average = AggregateFunctions.Average(a.Age)
}).First();
/*
 * SELECT COUNT(1) AS `Count`,COUNT(1) AS `LongCount`,CAST(SUM(`Users`.`Age`) AS SIGNED) AS `Sum`,MAX(`Users`.`Age`) AS `Max`,MIN(`Users`.`Age`) AS `Min`,AVG(`Users`.`Age`) AS `Average` 
   FROM `Users` AS `Users` LIMIT 0,1
 */

var count = q.Count();
/*
 * SELECT COUNT(1) AS `C` FROM `Users` AS `Users`
 */

var longCount = q.LongCount();
/*
 * SELECT COUNT(1) AS `C` FROM `Users` AS `Users`
 */

var sum = q.Sum(a => a.Age);
/*
 * SELECT CAST(SUM(`Users`.`Age`) AS SIGNED) AS `C` FROM `Users` AS `Users`
 */

var max = q.Max(a => a.Age);
/*
 * SELECT MAX(`Users`.`Age`) AS `C` FROM `Users` AS `Users`
 */

var min = q.Min(a => a.Age);
/*
 * SELECT MIN(`Users`.`Age`) AS `C` FROM `Users` AS `Users`
 */

var avg = q.Average(a => a.Age);
/*
 * SELECT AVG(`Users`.`Age`) AS `C` FROM `Users` AS `Users`
 */
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325146263711645696', 'MySql-Sql查询', 'MySql-Sql查询', 'MySql-Sql查询', '<h1 id="h1-sql-"><a name="Sql查询" class="reference-link"></a><span class="header-link octicon octicon-link"></span>Sql查询</h1><p>对于一些极其复杂的 sql 查询，还是得依赖原生 sql，因此，Chloe 提供了原生 sql 查询接口。<br><strong>获取满足条件的用户信息，将结果映射到 User 类上：</strong></p>
<pre><code class="lang-csharp">context.SqlQuery&lt;User&gt;(&quot;select * from Users where Age&gt;?age&quot;, new DbParam(&quot;?age&quot;, 18)).ToList();
</code></pre>
<p><strong>获取满足条件的用户 Id：</strong></p>
<pre><code class="lang-csharp">context.SqlQuery&lt;int&gt;(&quot;select Id from Users where Age&gt;?age&quot;, new DbParam(&quot;?age&quot;, 18)).ToList();
</code></pre>
<p><strong>支持存储过程：</strong></p>
<pre><code class="lang-csharp">context.SqlQuery&lt;User&gt;(&quot;Proc_Test&quot;, CommandType.StoredProcedure, new DbParam(&quot;?age&quot;, 18)).ToList();
</code></pre>
', TO_DATE('2016-12-02 15:44:08', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-02 19:13:57', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# Sql查询
对于一些极其复杂的 sql 查询，还是得依赖原生 sql，因此，Chloe 提供了原生 sql 查询接口。
**获取满足条件的用户信息，将结果映射到 User 类上：**
```csharp
context.SqlQuery<User>("select * from Users where Age>?age", new DbParam("?age", 18)).ToList();
```
**获取满足条件的用户 Id：**
```csharp
context.SqlQuery<int>("select Id from Users where Age>?age", new DbParam("?age", 18)).ToList();
```
**支持存储过程：**
```csharp
context.SqlQuery<User>("Proc_Test", CommandType.StoredProcedure, new DbParam("?age", 18)).ToList();
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325146061768491008', 'MySql-连接查询', 'MySql-连接查询', 'MySql-连接查询', '<h1 id="h1-u8FDEu63A5u67E5u8BE2"><a name="连接查询" class="reference-link"></a><span class="header-link octicon octicon-link"></span>连接查询</h1><p>Chloe 友好支持多表连接查询，一切都可以用 lambda 表达式操作，返回类型可以是自定义类型，也可以是匿名类型。强类型开发，编译可见错误，容错率高。<br><strong>1.创建相关的 IQuery 对象：</strong></p>
<pre><code class="lang-csharp">IQuery&lt;User&gt; users = context.Query&lt;User&gt;();
IQuery&lt;City&gt; cities = context.Query&lt;City&gt;();
IQuery&lt;Province&gt; provinces = context.Query&lt;Province&gt;();
</code></pre>
<p><strong>2.建立连接：</strong></p>
<pre><code class="lang-csharp">/* User 表和 City 表 inner join，得到 IJoiningQuery&lt;User, City&gt; 对象 */
IJoiningQuery&lt;User, City&gt; user_city = users.InnerJoin(cities, (user, city) =&gt; user.CityId == city.Id);

/* City 表和 Province 表 inner join，得到 IJoiningQuery&lt;User, City, Province&gt; 对象 */
IJoiningQuery&lt;User, City, Province&gt; user_city_province = user_city.InnerJoin(provinces, (user, city, province) =&gt; city.ProvinceId == province.Id);
</code></pre>
<p><strong>3.得到最终的 IJoiningQuery 对象，就可以 Select 所需要的数据返回一个 IQuery 对象，然后就可以进行 Where、OrderBy、GroupBy、分页、聚合查询等操作：</strong><br>查出一个用户及其隶属的城市和省份的所有信息：</p>
<pre><code class="lang-csharp">/* 调用 Select 方法返回一个泛型为包含 User、City、Province 匿名类型的 IQuery 对象。
 * Select 方法也可以返回自定义类型 。
 */
var qq = user_city_province.Select((user, city, province) =&gt; new
{
    User = user,
    City = city,
    Province = province
});

/* 根据条件筛选，然后调用 ToList 就会返回一个泛型为 new { User = user, City = city, Province = province } 的 List 集合 */
var result = qq.Where(a =&gt; a.User.Id == 1).ToList();

/*
 * 生成的 sql：
 * SELECT `Users`.`Id` AS `Id`,`Users`.`Name` AS `Name`,`Users`.`Gender` AS `Gender`,`Users`.`Age` AS `Age`,`Users`.`CityId` AS `CityId`,`Users`.`OpTime` AS `OpTime`,`City`.`Id` AS `Id0`,`City`.`Name` AS `Name0`,`City`.`ProvinceId` AS `ProvinceId`,`Province`.`Id` AS `Id1`,`Province`.`Name` AS `Name1` 
   FROM `Users` AS `Users` 
   INNER JOIN `City` AS `City` ON `Users`.`CityId` = `City`.`Id` 
   INNER JOIN `Province` AS `Province` ON `City`.`ProvinceId` = `Province`.`Id` 
   WHERE `Users`.`Id` = 1
 */
</code></pre>
<p>可以只获取指定的字段信息：</p>
<pre><code class="lang-csharp">user_city_province.Select((user, city, province) =&gt; new
{
    UserId = user.Id,
    UserName = user.Name,
    CityName = city.Name,
    ProvinceName = province.Name
}).Where(a =&gt; a.UserId == 1).ToList();

/*
 * 生成的 sql 只会包含 UserId、UserName、CityName、ProvinceName 四个字段
 * SELECT `Users`.`Id` AS `UserId`,`Users`.`Name` AS `UserName`,`City`.`Name` AS `CityName`,`Province`.`Name` AS `ProvinceName` 
   FROM `Users` AS `Users` 
   INNER JOIN `City` AS `City` ON `Users`.`CityId` = `City`.`Id` 
   INNER JOIN `Province` AS `Province` ON `City`.`ProvinceId` = `Province`.`Id` 
   WHERE `Users`.`Id` = 1
 */
</code></pre>
<p>框架亦支持左连接、右连接查询，用法和内连接相同。</p>
', TO_DATE('2016-12-02 15:43:20', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-03 14:20:33', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 连接查询
Chloe 友好支持多表连接查询，一切都可以用 lambda 表达式操作，返回类型可以是自定义类型，也可以是匿名类型。强类型开发，编译可见错误，容错率高。
**1.创建相关的 IQuery 对象：**
```csharp
IQuery<User> users = context.Query<User>();
IQuery<City> cities = context.Query<City>();
IQuery<Province> provinces = context.Query<Province>();
```
**2.建立连接：**
```csharp
/* User 表和 City 表 inner join，得到 IJoiningQuery<User, City> 对象 */
IJoiningQuery<User, City> user_city = users.InnerJoin(cities, (user, city) => user.CityId == city.Id);

/* City 表和 Province 表 inner join，得到 IJoiningQuery<User, City, Province> 对象 */
IJoiningQuery<User, City, Province> user_city_province = user_city.InnerJoin(provinces, (user, city, province) => city.ProvinceId == province.Id);
```
**3.得到最终的 IJoiningQuery 对象，就可以 Select 所需要的数据返回一个 IQuery 对象，然后就可以进行 Where、OrderBy、GroupBy、分页、聚合查询等操作：**
查出一个用户及其隶属的城市和省份的所有信息：
```csharp
/* 调用 Select 方法返回一个泛型为包含 User、City、Province 匿名类型的 IQuery 对象。
 * Select 方法也可以返回自定义类型 。
 */
var qq = user_city_province.Select((user, city, province) => new
{
    User = user,
    City = city,
    Province = province
});

/* 根据条件筛选，然后调用 ToList 就会返回一个泛型为 new { User = user, City = city, Province = province } 的 List 集合 */
var result = qq.Where(a => a.User.Id == 1).ToList();

/*
 * 生成的 sql：
 * SELECT `Users`.`Id` AS `Id`,`Users`.`Name` AS `Name`,`Users`.`Gender` AS `Gender`,`Users`.`Age` AS `Age`,`Users`.`CityId` AS `CityId`,`Users`.`OpTime` AS `OpTime`,`City`.`Id` AS `Id0`,`City`.`Name` AS `Name0`,`City`.`ProvinceId` AS `ProvinceId`,`Province`.`Id` AS `Id1`,`Province`.`Name` AS `Name1` 
   FROM `Users` AS `Users` 
   INNER JOIN `City` AS `City` ON `Users`.`CityId` = `City`.`Id` 
   INNER JOIN `Province` AS `Province` ON `City`.`ProvinceId` = `Province`.`Id` 
   WHERE `Users`.`Id` = 1
 */
```
可以只获取指定的字段信息：
```csharp
user_city_province.Select((user, city, province) => new
{
    UserId = user.Id,
    UserName = user.Name,
    CityName = city.Name,
    ProvinceName = province.Name
}).Where(a => a.UserId == 1).ToList();

/*
 * 生成的 sql 只会包含 UserId、UserName、CityName、ProvinceName 四个字段
 * SELECT `Users`.`Id` AS `UserId`,`Users`.`Name` AS `UserName`,`City`.`Name` AS `CityName`,`Province`.`Name` AS `ProvinceName` 
   FROM `Users` AS `Users` 
   INNER JOIN `City` AS `City` ON `Users`.`CityId` = `City`.`Id` 
   INNER JOIN `Province` AS `Province` ON `City`.`ProvinceId` = `Province`.`Id` 
   WHERE `Users`.`Id` = 1
 */
```
框架亦支持左连接、右连接查询，用法和内连接相同。');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325146123546394624', 'MySql-分组查询', 'MySql-分组查询', 'MySql-分组查询', '<h1 id="h1-u5206u7EC4u67E5u8BE2"><a name="分组查询" class="reference-link"></a><span class="header-link octicon octicon-link"></span>分组查询</h1><p>Chloe 支持分组查询以及分组后 Having 过滤和聚合查询。</p>
<pre><code class="lang-csharp">IQuery&lt;User&gt; q = context.Query&lt;User&gt;();

IGroupingQuery&lt;User&gt; g = q.Where(a =&gt; a.Id &gt; 0).GroupBy(a =&gt; a.Age);
g = g.Having(a =&gt; a.Age &gt; 1 &amp;&amp; AggregateFunctions.Count() &gt; 0);

g.Select(a =&gt; new
{
    a.Age,
    Count = AggregateFunctions.Count(),
    Sum = AggregateFunctions.Sum(a.Age),
    Max = AggregateFunctions.Max(a.Age),
    Min = AggregateFunctions.Min(a.Age),
    Avg = AggregateFunctions.Average(a.Age)
}).ToList();
/*
 * SELECT `Users`.`Age` AS `Age`,COUNT(1) AS `Count`,CAST(SUM(`Users`.`Age`) AS SIGNED) AS `Sum`,MAX(`Users`.`Age`) AS `Max`,MIN(`Users`.`Age`) AS `Min`,AVG(`Users`.`Age`) AS `Avg` 
   FROM `Users` AS `Users` 
   WHERE `Users`.`Id` &gt; 0 
   GROUP BY `Users`.`Age` 
   HAVING (`Users`.`Age` &gt; 1 AND COUNT(1) &gt; 0)
 */
</code></pre>
', TO_DATE('2016-12-02 15:43:35', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-02 19:11:01', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 分组查询
Chloe 支持分组查询以及分组后 Having 过滤和聚合查询。
```csharp
IQuery<User> q = context.Query<User>();

IGroupingQuery<User> g = q.Where(a => a.Id > 0).GroupBy(a => a.Age);
g = g.Having(a => a.Age > 1 && AggregateFunctions.Count() > 0);

g.Select(a => new
{
    a.Age,
    Count = AggregateFunctions.Count(),
    Sum = AggregateFunctions.Sum(a.Age),
    Max = AggregateFunctions.Max(a.Age),
    Min = AggregateFunctions.Min(a.Age),
    Avg = AggregateFunctions.Average(a.Age)
}).ToList();
/*
 * SELECT `Users`.`Age` AS `Age`,COUNT(1) AS `Count`,CAST(SUM(`Users`.`Age`) AS SIGNED) AS `Sum`,MAX(`Users`.`Age`) AS `Max`,MIN(`Users`.`Age`) AS `Min`,AVG(`Users`.`Age`) AS `Avg` 
   FROM `Users` AS `Users` 
   WHERE `Users`.`Id` > 0 
   GROUP BY `Users`.`Age` 
   HAVING (`Users`.`Age` > 1 AND COUNT(1) > 0)
 */
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325145866628497408', 'MySql-创建DbContext', 'MySql-创建DbContext', 'MySql-创建DbContext', '<h1 id="h1--dbcontext"><a name="创建 DbContext" class="reference-link"></a><span class="header-link octicon octicon-link"></span>创建 DbContext</h1><p>对于 MySql 数据库，需要引用程序集 Chloe.dll 和 Chloe.MySql.dll，然后使用 Chloe.MySql.MySqlContext 创建上下文实例。<br>因为框架本身需要与具体的数据库驱动解耦，所以 MySqlContext 构造函数需要一个 IDbConnectionFactory 的参数，IDbConnectionFactory 接口只有一个 CreateConnection() 方法，必须先建个类，实现 CreateConnection 方法。</p>
<pre><code class="lang-csharp">public class MySqlConnectionFactory : IDbConnectionFactory
{
    string _connString = null;
    public MySqlConnectionFactory(string connString)
    {
        this._connString = connString;
    }
    public IDbConnection CreateConnection()
    {
        MySqlConnection conn = new MySqlConnection(this._connString);
        return conn;
    }
}
</code></pre>
<p>接下来就可以创建 MySqlContext：</p>
<pre><code class="lang-csharp">string connString = &quot;Your connection string&quot;;
MySqlContext context = new MySqlContext(new MySqlConnectionFactory(connString));
</code></pre>
', TO_DATE('2016-12-02 15:42:33', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-02 19:00:13', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 创建 DbContext
对于 MySql 数据库，需要引用程序集 Chloe.dll 和 Chloe.MySql.dll，然后使用 Chloe.MySql.MySqlContext 创建上下文实例。
因为框架本身需要与具体的数据库驱动解耦，所以 MySqlContext 构造函数需要一个 IDbConnectionFactory 的参数，IDbConnectionFactory 接口只有一个 CreateConnection() 方法，必须先建个类，实现 CreateConnection 方法。
```csharp
public class MySqlConnectionFactory : IDbConnectionFactory
{
    string _connString = null;
    public MySqlConnectionFactory(string connString)
    {
        this._connString = connString;
    }
    public IDbConnection CreateConnection()
    {
        MySqlConnection conn = new MySqlConnection(this._connString);
        return conn;
    }
}
```
接下来就可以创建 MySqlContext：
```csharp
string connString = "Your connection string";
MySqlContext context = new MySqlContext(new MySqlConnectionFactory(connString));
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325145930688102400', 'MySql-基本查询', 'MySql-基本查询', 'MySql-基本查询', '<h1 id="h1-u57FAu672Cu67E5u8BE2"><a name="基本查询" class="reference-link"></a><span class="header-link octicon octicon-link"></span>基本查询</h1><p><strong>根据 Id 查询出一个 User 对象：</strong></p>
<pre><code class="lang-csharp">string connString = &quot;Your connection string&quot;;
MySqlContext context = new MySqlContext(new MySqlConnectionFactory(connString));
IQuery&lt;User&gt; q = context.Query&lt;User&gt;();

q.Where(a =&gt; a.Id == 1).FirstOrDefault();
/*
 *生成的 sql：
 * SELECT `Users`.`Id` AS `Id`,`Users`.`Name` AS `Name`,`Users`.`Gender` AS `Gender`,`Users`.`Age` AS `Age`,`Users`.`CityId` AS `CityId`,`Users`.`OpTime` AS `OpTime` 
   FROM `Users` AS `Users` 
   WHERE `Users`.`Id` = 1 
   LIMIT 0,1
 */
</code></pre>
<p><strong>in 查询：</strong></p>
<pre><code class="lang-csharp">List&lt;int&gt; ids = new List&lt;int&gt;() { 1, 2, 3 };
q.Where(a =&gt; ids.Contains(a.Id)).ToList();
/*
 * Int32 ?P_0 = 1;
   Int32 ?P_1 = 2;
   Int32 ?P_2 = 3;
   SELECT `Users`.`Id` AS `Id`,`Users`.`Name` AS `Name`,`Users`.`Gender` AS `Gender`,`Users`.`Age` AS `Age`,`Users`.`CityId` AS `CityId`,`Users`.`OpTime` AS `OpTime` 
   FROM `Users` AS `Users` 
   WHERE `Users`.`Id` IN (?P_0,?P_1,?P_2)
 */
</code></pre>
<p><strong>可以选取指定的字段，返回一个匿名类型：</strong></p>
<pre><code class="lang-csharp">q.Where(a =&gt; a.Id == 1).Select(a =&gt; new { a.Id, a.Name }).FirstOrDefault();
/*
 * 只会生成包含 Id 和 Name 两个字段的 sql 语句：
 * SELECT `Users`.`Id` AS `Id`,`Users`.`Name` AS `Name` 
   FROM `Users` AS `Users` 
   WHERE `Users`.`Id` = 1 
   LIMIT 0,1
 */
</code></pre>
<p><strong>排序：</strong></p>
<pre><code class="lang-csharp">q.Where(a =&gt; a.Id &gt; 0).OrderBy(a =&gt; a.Age).ThenBy(a =&gt; a.Id).ToList();
/*
 * SELECT `Users`.`Id` AS `Id`,`Users`.`Name` AS `Name`,`Users`.`Gender` AS `Gender`,`Users`.`Age` AS `Age`,`Users`.`CityId` AS `CityId`,`Users`.`OpTime` AS `OpTime` 
   FROM `Users` AS `Users` 
   WHERE `Users`.`Id` &gt; 0 
   ORDER BY `Users`.`Age` ASC，`Id` ASC
 */
</code></pre>
<p><strong>分页：</strong></p>
<pre><code class="lang-csharp">q.Where(a =&gt; a.Id &gt; 0).OrderBy(a =&gt; a.Age).TakePage(1, 20).ToList();
/*
 * SELECT `Users`.`Id` AS `Id`,`Users`.`Name` AS `Name`,`Users`.`Gender` AS `Gender`,`Users`.`Age` AS `Age`,`Users`.`CityId` AS `CityId`,`Users`.`OpTime` AS `OpTime`
   FROM `Users` AS `Users` 
   WHERE `Users`.`Id` &gt; 0 
   ORDER BY `Users`.`Age` ASC 
   LIMIT 0,20
 */
</code></pre>
', TO_DATE('2016-12-02 15:42:49', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-08 11:40:33', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 基本查询
**根据 Id 查询出一个 User 对象：**
```csharp
string connString = "Your connection string";
MySqlContext context = new MySqlContext(new MySqlConnectionFactory(connString));
IQuery<User> q = context.Query<User>();

q.Where(a => a.Id == 1).FirstOrDefault();
/*
 *生成的 sql：
 * SELECT `Users`.`Id` AS `Id`,`Users`.`Name` AS `Name`,`Users`.`Gender` AS `Gender`,`Users`.`Age` AS `Age`,`Users`.`CityId` AS `CityId`,`Users`.`OpTime` AS `OpTime` 
   FROM `Users` AS `Users` 
   WHERE `Users`.`Id` = 1 
   LIMIT 0,1
 */
```
**in 查询：**
```csharp
List<int> ids = new List<int>() { 1, 2, 3 };
q.Where(a => ids.Contains(a.Id)).ToList();
/*
 * Int32 ?P_0 = 1;
   Int32 ?P_1 = 2;
   Int32 ?P_2 = 3;
   SELECT `Users`.`Id` AS `Id`,`Users`.`Name` AS `Name`,`Users`.`Gender` AS `Gender`,`Users`.`Age` AS `Age`,`Users`.`CityId` AS `CityId`,`Users`.`OpTime` AS `OpTime` 
   FROM `Users` AS `Users` 
   WHERE `Users`.`Id` IN (?P_0,?P_1,?P_2)
 */
```
**可以选取指定的字段，返回一个匿名类型：**
```csharp
q.Where(a => a.Id == 1).Select(a => new { a.Id, a.Name }).FirstOrDefault();
/*
 * 只会生成包含 Id 和 Name 两个字段的 sql 语句：
 * SELECT `Users`.`Id` AS `Id`,`Users`.`Name` AS `Name` 
   FROM `Users` AS `Users` 
   WHERE `Users`.`Id` = 1 
   LIMIT 0,1
 */
```
**排序：**
```csharp
q.Where(a => a.Id > 0).OrderBy(a => a.Age).ThenBy(a => a.Id).ToList();
/*
 * SELECT `Users`.`Id` AS `Id`,`Users`.`Name` AS `Name`,`Users`.`Gender` AS `Gender`,`Users`.`Age` AS `Age`,`Users`.`CityId` AS `CityId`,`Users`.`OpTime` AS `OpTime` 
   FROM `Users` AS `Users` 
   WHERE `Users`.`Id` > 0 
   ORDER BY `Users`.`Age` ASC，`Id` ASC
 */
```
**分页：**
```csharp
q.Where(a => a.Id > 0).OrderBy(a => a.Age).TakePage(1, 20).ToList();
/*
 * SELECT `Users`.`Id` AS `Id`,`Users`.`Name` AS `Name`,`Users`.`Gender` AS `Gender`,`Users`.`Age` AS `Age`,`Users`.`CityId` AS `CityId`,`Users`.`OpTime` AS `OpTime`
   FROM `Users` AS `Users` 
   WHERE `Users`.`Id` > 0 
   ORDER BY `Users`.`Age` ASC 
   LIMIT 0,20
 */
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325145692988506112', 'MySql-实体特性', 'MySql-实体特性', 'MySql-实体特性', '<h1 id="h1-u5B9Eu4F53u7279u6027"><a name="实体特性" class="reference-link"></a><span class="header-link octicon octicon-link"></span>实体特性</h1><p>实体特性位于命名空间 Chloe.Entity 下。<br><strong>TableAttribute：</strong><br>Name：映射的表名。<br>实体对应的表默认是实体类名，如实体类型名与表名不一致，可通过该特性指定映射的表名。</p>
<pre><code class="lang-csharp">public class TableAttribute : Attribute
{
    public TableAttribute() { }
    public TableAttribute(string name)
    {
        Name = name;
    }
    public string Name { get; set; }
}
</code></pre>
<p><strong>ColumnAttribute：</strong><br>Name：映射的列名，如不指定，则默认使用属性名。<br>IsPrimaryKey：指示列是否为主键，默认为 false。<br>当一个实体没显示指定主键的时候，Chloe 默认选择名为 Id 的属性（如果存在）作为主键列，与此同时，如果该实体也没有显示指定任何自增列并且 Id 属性为 Int16、Int32 或者 Int64 类型，则也会默认其为自增列。</p>
<pre><code class="lang-csharp">public class ColumnAttribute : Attribute
{
    public ColumnAttribute() { }
    public ColumnAttribute(string name)
    {
        this.Name = name;
    }
    public string Name { get; set; }
    public bool IsPrimaryKey { get; set; }
}
</code></pre>
<p><strong>AutoIncrementAttribute：</strong><br>标记属性为自增列。在 SqlServer 中，一个实体不能指定多个自增列，否则会报异常提示。</p>
<pre><code class="lang-csharp">public class AutoIncrementAttribute : Attribute
{
}
</code></pre>
<p><strong>NonAutoIncrementAttribute：</strong><br>标记属性为非自增列。</p>
<pre><code class="lang-csharp">public class NonAutoIncrementAttribute : Attribute
{
}
</code></pre>
<p><strong>NotMappedAttribute：</strong><br>指示属性不映射任何列。</p>
<pre><code class="lang-csharp">public class NotMappedAttribute : Attribute
{
}
</code></pre>
', TO_DATE('2016-12-02 15:41:52', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-02 19:32:28', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 实体特性
实体特性位于命名空间 Chloe.Entity 下。
**TableAttribute：**
Name：映射的表名。
实体对应的表默认是实体类名，如实体类型名与表名不一致，可通过该特性指定映射的表名。
```csharp
public class TableAttribute : Attribute
{
    public TableAttribute() { }
    public TableAttribute(string name)
    {
        Name = name;
    }
    public string Name { get; set; }
}
```
**ColumnAttribute：**
Name：映射的列名，如不指定，则默认使用属性名。
IsPrimaryKey：指示列是否为主键，默认为 false。
当一个实体没显示指定主键的时候，Chloe 默认选择名为 Id 的属性（如果存在）作为主键列，与此同时，如果该实体也没有显示指定任何自增列并且 Id 属性为 Int16、Int32 或者 Int64 类型，则也会默认其为自增列。
```csharp
public class ColumnAttribute : Attribute
{
    public ColumnAttribute() { }
    public ColumnAttribute(string name)
    {
        this.Name = name;
    }
    public string Name { get; set; }
    public bool IsPrimaryKey { get; set; }
}
```
**AutoIncrementAttribute：**
标记属性为自增列。在 SqlServer 中，一个实体不能指定多个自增列，否则会报异常提示。
```csharp
public class AutoIncrementAttribute : Attribute
{
}
```
**NonAutoIncrementAttribute：**
标记属性为非自增列。
```csharp
public class NonAutoIncrementAttribute : Attribute
{
}
```
**NotMappedAttribute：**
指示属性不映射任何列。
```csharp
public class NotMappedAttribute : Attribute
{
}
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325145777671503872', 'MySql-实体定义', 'MySql-实体定义', 'MySql-实体定义', '<h1 id="h1-u5B9Eu4F53u5B9Au4E49"><a name="实体定义" class="reference-link"></a><span class="header-link octicon octicon-link"></span>实体定义</h1><p>实体为纯 POCO，支持可空类型以及枚举类型映射。</p>
<pre><code class="lang-csharp">public enum Gender
{
    Man = 1,
    Woman
}
</code></pre>
<pre><code class="lang-csharp">[TableAttribute(&quot;Users&quot;)]
public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public Gender? Gender { get; set; }
    public int? Age { get; set; }
    public int? CityId { get; set; }
    public DateTime? OpTime { get; set; }
}
</code></pre>
<pre><code class="lang-csharp">public class City
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int ProvinceId { get; set; }
}
</code></pre>
<pre><code class="lang-csharp">public class Province
{
    public int Id { get; set; }
    public string Name { get; set; }
}
</code></pre>
', TO_DATE('2016-12-02 15:42:12', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-02 16:33:40', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 实体定义
实体为纯 POCO，支持可空类型以及枚举类型映射。
```csharp
public enum Gender
{
    Man = 1,
    Woman
}
```
```csharp
[TableAttribute("Users")]
public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public Gender? Gender { get; set; }
    public int? Age { get; set; }
    public int? CityId { get; set; }
    public DateTime? OpTime { get; set; }
}
```
```csharp
public class City
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int ProvinceId { get; set; }
}
```
```csharp
public class Province
{
    public int Id { get; set; }
    public string Name { get; set; }
}
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3324837619082199040', 'SqlServer-插入数据', 'SqlServer-插入数据', 'SqlServer-插入数据', '<h1 id="h1-u63D2u5165u6570u636E"><a name="插入数据" class="reference-link"></a><span class="header-link octicon octicon-link"></span>插入数据</h1><p>Chloe 具备两种插入数据的方式。<br><strong>1.实体插入：</strong><br>该方式插入，如果一个实体存在自增列，会自动将自增列设置到相应的属性上。</p>
<pre><code class="lang-csharp">User user = new User();
user.Name = &quot;lu&quot;;
user.Age = 18;
user.Gender = Gender.Man;
user.CityId = 1;
user.OpTime = DateTime.Now;

/* 会自动将自增 Id 设置到 user 的 Id 属性上 */
user = context.Insert(user);
/*
 * String @P_0 = &#39;lu&#39;;
   Gender @P_1 = Man;
   Int32 @P_2 = 18;
   Int32 @P_3 = 1;
   DateTime @P_4 = &#39;2016/8/26 18:41:08&#39;;
   INSERT INTO [Users]([Name],[Gender],[Age],[CityId],[OpTime]) 
   VALUES(@P_0,@P_1,@P_2,@P_3,@P_4);SELECT @@IDENTITY
 */
</code></pre>
<p><strong>2.lambda 方式插入：</strong><br>此种方式插入的好处是，可以指定列插入，就像写 sql 一样简单。<br>同时，该方式插入返回表主键值。如果实体主键是自增列，返回值就会是自增值。</p>
<pre><code class="lang-csharp">/* 返回主键 Id */
int id = (int)context.Insert&lt;User&gt;(() =&gt; new User()
{
    Name = &quot;lu&quot;,
    Age = 18,
    Gender = Gender.Man,
    CityId = 1,
    OpTime = DateTime.Now
});
/*
 * INSERT INTO [Users]([Name],[Age],[Gender],[CityId],[OpTime]) 
   VALUES(N&#39;lu&#39;,18,1,1,GETDATE());SELECT @@IDENTITY
 */
</code></pre>
', TO_DATE('2016-12-01 19:17:41', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-04 11:55:02', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 插入数据
Chloe 具备两种插入数据的方式。
**1.实体插入：**
该方式插入，如果一个实体存在自增列，会自动将自增列设置到相应的属性上。
```csharp
User user = new User();
user.Name = "lu";
user.Age = 18;
user.Gender = Gender.Man;
user.CityId = 1;
user.OpTime = DateTime.Now;

/* 会自动将自增 Id 设置到 user 的 Id 属性上 */
user = context.Insert(user);
/*
 * String @P_0 = ''lu'';
   Gender @P_1 = Man;
   Int32 @P_2 = 18;
   Int32 @P_3 = 1;
   DateTime @P_4 = ''2016/8/26 18:41:08'';
   INSERT INTO [Users]([Name],[Gender],[Age],[CityId],[OpTime]) 
   VALUES(@P_0,@P_1,@P_2,@P_3,@P_4);SELECT @@IDENTITY
 */
```
**2.lambda 方式插入：**
此种方式插入的好处是，可以指定列插入，就像写 sql 一样简单。
同时，该方式插入返回表主键值。如果实体主键是自增列，返回值就会是自增值。
```csharp
/* 返回主键 Id */
int id = (int)context.Insert<User>(() => new User()
{
    Name = "lu",
    Age = 18,
    Gender = Gender.Man,
    CityId = 1,
    OpTime = DateTime.Now
});
/*
 * INSERT INTO [Users]([Name],[Age],[Gender],[CityId],[OpTime]) 
   VALUES(N''lu'',18,1,1,GETDATE());SELECT @@IDENTITY
 */
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325149327977873408', 'Oracle-基本查询', 'Oracle-基本查询', 'Oracle-基本查询', '<h1 id="h1-u57FAu672Cu67E5u8BE2"><a name="基本查询" class="reference-link"></a><span class="header-link octicon octicon-link"></span>基本查询</h1><p><strong>根据 Id 查询出一个 User 对象：</strong></p>
<pre><code class="lang-csharp">string connString = &quot;Your connection string&quot;;
OracleContext context = new OracleContext(new OracleConnectionFactory(connString));
IQuery&lt;User&gt; q = context.Query&lt;User&gt;();

q.Where(a =&gt; a.Id == 1).FirstOrDefault();
/*
 *生成的 sql：
 * SELECT &quot;USERS&quot;.&quot;ID&quot; AS &quot;ID&quot;,&quot;USERS&quot;.&quot;NAME&quot; AS &quot;NAME&quot;,&quot;USERS&quot;.&quot;GENDER&quot; AS &quot;GENDER&quot;,&quot;USERS&quot;.&quot;AGE&quot; AS &quot;AGE&quot;,&quot;USERS&quot;.&quot;CITYID&quot; AS &quot;CITYID&quot;,&quot;USERS&quot;.&quot;OPTIME&quot; AS &quot;OPTIME&quot; 
   FROM &quot;USERS&quot; &quot;USERS&quot; 
   WHERE (&quot;USERS&quot;.&quot;ID&quot; = 1 AND ROWNUM &lt; 2)
 */
</code></pre>
<p><strong>in 查询：</strong></p>
<pre><code class="lang-csharp">List&lt;int&gt; ids = new List&lt;int&gt;() { 1, 2, 3 };
q.Where(a =&gt; ids.Contains(a.Id)).ToList();
/*
 * Int32 :P_0 = 1;
   Int32 :P_1 = 2;
   Int32 :P_2 = 3;
   SELECT &quot;USERS&quot;.&quot;ID&quot; AS &quot;ID&quot;,&quot;USERS&quot;.&quot;NAME&quot; AS &quot;NAME&quot;,&quot;USERS&quot;.&quot;GENDER&quot; AS &quot;GENDER&quot;,&quot;USERS&quot;.&quot;AGE&quot; AS &quot;AGE&quot;,&quot;USERS&quot;.&quot;CITYID&quot; AS &quot;CITYID&quot;,&quot;USERS&quot;.&quot;OPTIME&quot; AS &quot;OPTIME&quot; 
   FROM &quot;USERS&quot; &quot;USERS&quot; 
   WHERE &quot;USERS&quot;.&quot;ID&quot; IN (:P_0,:P_1,:P_2)
 */
</code></pre>
<p><strong>可以选取指定的字段，返回一个匿名类型：</strong></p>
<pre><code class="lang-csharp">q.Where(a =&gt; a.Id == 1).Select(a =&gt; new { a.Id, a.Name }).FirstOrDefault();
/*
 * 只会生成包含 Id 和 Name 两个字段的 sql 语句：
 * SELECT &quot;USERS&quot;.&quot;ID&quot; AS &quot;ID&quot;,&quot;USERS&quot;.&quot;NAME&quot; AS &quot;NAME&quot; 
   FROM &quot;USERS&quot; &quot;USERS&quot; 
   WHERE (&quot;USERS&quot;.&quot;ID&quot; = 1 AND ROWNUM &lt; 2)
 */
</code></pre>
<p><strong>排序：</strong></p>
<pre><code class="lang-csharp">q.Where(a =&gt; a.Id &gt; 0).OrderBy(a =&gt; a.Age).ThenBy(a =&gt; a.Id).ToList();
/*
 * SELECT &quot;USERS&quot;.&quot;ID&quot; AS &quot;ID&quot;,&quot;USERS&quot;.&quot;NAME&quot; AS &quot;NAME&quot;,&quot;USERS&quot;.&quot;GENDER&quot; AS &quot;GENDER&quot;,&quot;USERS&quot;.&quot;AGE&quot; AS &quot;AGE&quot;,&quot;USERS&quot;.&quot;CITYID&quot; AS &quot;CITYID&quot;,&quot;USERS&quot;.&quot;OPTIME&quot; AS &quot;OPTIME&quot; 
   FROM &quot;USERS&quot; &quot;USERS&quot; 
   WHERE &quot;USERS&quot;.&quot;ID&quot; &gt; 0 
   ORDER BY &quot;USERS&quot;.&quot;AGE&quot; ASC,&quot;USERS&quot;.&quot;ID&quot; ASC
 */
</code></pre>
<p><strong>分页：</strong></p>
<pre><code class="lang-csharp">q.Where(a =&gt; a.Id &gt; 0).OrderBy(a =&gt; a.Age).TakePage(1, 20).ToList();
/*
 * SELECT &quot;T&quot;.&quot;ID&quot; AS &quot;ID&quot;,&quot;T&quot;.&quot;NAME&quot; AS &quot;NAME&quot;,&quot;T&quot;.&quot;GENDER&quot; AS &quot;GENDER&quot;,&quot;T&quot;.&quot;AGE&quot; AS &quot;AGE&quot;,&quot;T&quot;.&quot;CITYID&quot; AS &quot;CITYID&quot;,&quot;T&quot;.&quot;OPTIME&quot; AS &quot;OPTIME&quot; FROM (SELECT &quot;TTAKE&quot;.&quot;ID&quot; AS &quot;ID&quot;,&quot;TTAKE&quot;.&quot;NAME&quot; AS &quot;NAME&quot;,&quot;TTAKE&quot;.&quot;GENDER&quot; AS &quot;GENDER&quot;,&quot;TTAKE&quot;.&quot;AGE&quot; AS &quot;AGE&quot;,&quot;TTAKE&quot;.&quot;CITYID&quot; AS &quot;CITYID&quot;,&quot;TTAKE&quot;.&quot;OPTIME&quot; AS &quot;OPTIME&quot;,ROWNUM AS &quot;ROW_NUMBER_0&quot; FROM (SELECT &quot;USERS&quot;.&quot;ID&quot; AS &quot;ID&quot;,&quot;USERS&quot;.&quot;NAME&quot; AS &quot;NAME&quot;,&quot;USERS&quot;.&quot;GENDER&quot; AS &quot;GENDER&quot;,&quot;USERS&quot;.&quot;AGE&quot; AS &quot;AGE&quot;,&quot;USERS&quot;.&quot;CITYID&quot; AS &quot;CITYID&quot;,&quot;USERS&quot;.&quot;OPTIME&quot; AS &quot;OPTIME&quot; FROM &quot;USERS&quot; &quot;USERS&quot; WHERE &quot;USERS&quot;.&quot;ID&quot; &gt; 0 ORDER BY &quot;USERS&quot;.&quot;AGE&quot; ASC) &quot;TTAKE&quot; WHERE ROWNUM &lt; 21) &quot;T&quot; WHERE &quot;T&quot;.&quot;ROW_NUMBER_0&quot; &gt; 0
 */
</code></pre>
', TO_DATE('2016-12-02 15:56:19', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-08 11:33:52', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 基本查询
**根据 Id 查询出一个 User 对象：**
```csharp
string connString = "Your connection string";
OracleContext context = new OracleContext(new OracleConnectionFactory(connString));
IQuery<User> q = context.Query<User>();

q.Where(a => a.Id == 1).FirstOrDefault();
/*
 *生成的 sql：
 * SELECT "USERS"."ID" AS "ID","USERS"."NAME" AS "NAME","USERS"."GENDER" AS "GENDER","USERS"."AGE" AS "AGE","USERS"."CITYID" AS "CITYID","USERS"."OPTIME" AS "OPTIME" 
   FROM "USERS" "USERS" 
   WHERE ("USERS"."ID" = 1 AND ROWNUM < 2)
 */
```
**in 查询：**
```csharp
List<int> ids = new List<int>() { 1, 2, 3 };
q.Where(a => ids.Contains(a.Id)).ToList();
/*
 * Int32 :P_0 = 1;
   Int32 :P_1 = 2;
   Int32 :P_2 = 3;
   SELECT "USERS"."ID" AS "ID","USERS"."NAME" AS "NAME","USERS"."GENDER" AS "GENDER","USERS"."AGE" AS "AGE","USERS"."CITYID" AS "CITYID","USERS"."OPTIME" AS "OPTIME" 
   FROM "USERS" "USERS" 
   WHERE "USERS"."ID" IN (:P_0,:P_1,:P_2)
 */
```
**可以选取指定的字段，返回一个匿名类型：**
```csharp
q.Where(a => a.Id == 1).Select(a => new { a.Id, a.Name }).FirstOrDefault();
/*
 * 只会生成包含 Id 和 Name 两个字段的 sql 语句：
 * SELECT "USERS"."ID" AS "ID","USERS"."NAME" AS "NAME" 
   FROM "USERS" "USERS" 
   WHERE ("USERS"."ID" = 1 AND ROWNUM < 2)
 */
```
**排序：**
```csharp
q.Where(a => a.Id > 0).OrderBy(a => a.Age).ThenBy(a => a.Id).ToList();
/*
 * SELECT "USERS"."ID" AS "ID","USERS"."NAME" AS "NAME","USERS"."GENDER" AS "GENDER","USERS"."AGE" AS "AGE","USERS"."CITYID" AS "CITYID","USERS"."OPTIME" AS "OPTIME" 
   FROM "USERS" "USERS" 
   WHERE "USERS"."ID" > 0 
   ORDER BY "USERS"."AGE" ASC,"USERS"."ID" ASC
 */
```
**分页：**
```csharp
q.Where(a => a.Id > 0).OrderBy(a => a.Age).TakePage(1, 20).ToList();
/*
 * SELECT "T"."ID" AS "ID","T"."NAME" AS "NAME","T"."GENDER" AS "GENDER","T"."AGE" AS "AGE","T"."CITYID" AS "CITYID","T"."OPTIME" AS "OPTIME" FROM (SELECT "TTAKE"."ID" AS "ID","TTAKE"."NAME" AS "NAME","TTAKE"."GENDER" AS "GENDER","TTAKE"."AGE" AS "AGE","TTAKE"."CITYID" AS "CITYID","TTAKE"."OPTIME" AS "OPTIME",ROWNUM AS "ROW_NUMBER_0" FROM (SELECT "USERS"."ID" AS "ID","USERS"."NAME" AS "NAME","USERS"."GENDER" AS "GENDER","USERS"."AGE" AS "AGE","USERS"."CITYID" AS "CITYID","USERS"."OPTIME" AS "OPTIME" FROM "USERS" "USERS" WHERE "USERS"."ID" > 0 ORDER BY "USERS"."AGE" ASC) "TTAKE" WHERE ROWNUM < 21) "T" WHERE "T"."ROW_NUMBER_0" > 0
 */
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325149375134433280', 'Oracle-连接查询', 'Oracle-连接查询', 'Oracle-连接查询', '<h1 id="h1-u8FDEu63A5u67E5u8BE2"><a name="连接查询" class="reference-link"></a><span class="header-link octicon octicon-link"></span>连接查询</h1><p>Chloe 友好支持多表连接查询，一切都可以用 lambda 表达式操作，返回类型可以是自定义类型，也可以是匿名类型。强类型开发，编译可见错误，容错率高。<br><strong>1.创建相关的 IQuery 对象：</strong></p>
<pre><code class="lang-csharp">IQuery&lt;User&gt; users = context.Query&lt;User&gt;();
IQuery&lt;City&gt; cities = context.Query&lt;City&gt;();
IQuery&lt;Province&gt; provinces = context.Query&lt;Province&gt;();
</code></pre>
<p><strong>2.建立连接：</strong></p>
<pre><code class="lang-csharp">/* User 表和 City 表 inner join，得到 IJoiningQuery&lt;User, City&gt; 对象 */
IJoiningQuery&lt;User, City&gt; user_city = users.InnerJoin(cities, (user, city) =&gt; user.CityId == city.Id);

/* City 表和 Province 表 inner join，得到 IJoiningQuery&lt;User, City, Province&gt; 对象 */
IJoiningQuery&lt;User, City, Province&gt; user_city_province = user_city.InnerJoin(provinces, (user, city, province) =&gt; city.ProvinceId == province.Id);
</code></pre>
<p><strong>3.得到最终的 IJoiningQuery 对象，就可以 Select 所需要的数据返回一个 IQuery 对象，然后就可以进行 Where、OrderBy、GroupBy、分页、聚合查询等操作：</strong><br>查出一个用户及其隶属的城市和省份的所有信息：</p>
<pre><code class="lang-csharp">/* 调用 Select 方法返回一个泛型为包含 User、City、Province 匿名类型的 IQuery 对象。
 * Select 方法也可以返回自定义类型 。
 */
var qq = user_city_province.Select((user, city, province) =&gt; new
{
    User = user,
    City = city,
    Province = province
});

/* 根据条件筛选，然后调用 ToList 就会返回一个泛型为 new { User = user, City = city, Province = province } 的 List 集合 */
var result = qq.Where(a =&gt; a.User.Id == 1).ToList();

/*
 * 生成的 sql：
 * SELECT &quot;USERS&quot;.&quot;ID&quot; AS &quot;ID&quot;,&quot;USERS&quot;.&quot;NAME&quot; AS &quot;NAME&quot;,&quot;USERS&quot;.&quot;GENDER&quot; AS &quot;GENDER&quot;,&quot;USERS&quot;.&quot;AGE&quot; AS &quot;AGE&quot;,&quot;USERS&quot;.&quot;CITYID&quot; AS &quot;CITYID&quot;,&quot;USERS&quot;.&quot;OPTIME&quot; AS &quot;OPTIME&quot;,&quot;CITY&quot;.&quot;ID&quot; AS &quot;ID0&quot;,&quot;CITY&quot;.&quot;NAME&quot; AS &quot;NAME0&quot;,&quot;CITY&quot;.&quot;PROVINCEID&quot; AS &quot;PROVINCEID&quot;,&quot;PROVINCE&quot;.&quot;ID&quot; AS &quot;ID1&quot;,&quot;PROVINCE&quot;.&quot;NAME&quot; AS &quot;NAME1&quot; 
   FROM &quot;USERS&quot; &quot;USERS&quot; 
   INNER JOIN &quot;CITY&quot; &quot;CITY&quot; ON &quot;USERS&quot;.&quot;CITYID&quot; = &quot;CITY&quot;.&quot;ID&quot; 
   INNER JOIN &quot;PROVINCE&quot; &quot;PROVINCE&quot; ON &quot;CITY&quot;.&quot;PROVINCEID&quot; = &quot;PROVINCE&quot;.&quot;ID&quot; 
   WHERE &quot;USERS&quot;.&quot;ID&quot; = 1
 */
</code></pre>
<p>可以只获取指定的字段信息：</p>
<pre><code class="lang-csharp">user_city_province.Select((user, city, province) =&gt; new
{
    UserId = user.Id,
    UserName = user.Name,
    CityName = city.Name,
    ProvinceName = province.Name
}).Where(a =&gt; a.UserId == 1).ToList();

/*
 * 生成的 sql 只会包含 UserId、UserName、CityName、ProvinceName 四个字段
 * SELECT &quot;USERS&quot;.&quot;ID&quot; AS &quot;USERID&quot;,&quot;USERS&quot;.&quot;NAME&quot; AS &quot;USERNAME&quot;,&quot;CITY&quot;.&quot;NAME&quot; AS &quot;CITYNAME&quot;,&quot;PROVINCE&quot;.&quot;NAME&quot; AS &quot;PROVINCENAME&quot; 
   FROM &quot;USERS&quot; &quot;USERS&quot; 
   INNER JOIN &quot;CITY&quot; &quot;CITY&quot; ON &quot;USERS&quot;.&quot;CITYID&quot; = &quot;CITY&quot;.&quot;ID&quot; 
   INNER JOIN &quot;PROVINCE&quot; &quot;PROVINCE&quot; ON &quot;CITY&quot;.&quot;PROVINCEID&quot; = &quot;PROVINCE&quot;.&quot;ID&quot; 
   WHERE &quot;USERS&quot;.&quot;ID&quot; = 1
 */
</code></pre>
<p>框架亦支持左连接、右连接和Full连接查询，用法和内连接相同。</p>
', TO_DATE('2016-12-02 15:56:30', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-03 14:20:37', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 连接查询
Chloe 友好支持多表连接查询，一切都可以用 lambda 表达式操作，返回类型可以是自定义类型，也可以是匿名类型。强类型开发，编译可见错误，容错率高。
**1.创建相关的 IQuery 对象：**
```csharp
IQuery<User> users = context.Query<User>();
IQuery<City> cities = context.Query<City>();
IQuery<Province> provinces = context.Query<Province>();
```
**2.建立连接：**
```csharp
/* User 表和 City 表 inner join，得到 IJoiningQuery<User, City> 对象 */
IJoiningQuery<User, City> user_city = users.InnerJoin(cities, (user, city) => user.CityId == city.Id);

/* City 表和 Province 表 inner join，得到 IJoiningQuery<User, City, Province> 对象 */
IJoiningQuery<User, City, Province> user_city_province = user_city.InnerJoin(provinces, (user, city, province) => city.ProvinceId == province.Id);
```
**3.得到最终的 IJoiningQuery 对象，就可以 Select 所需要的数据返回一个 IQuery 对象，然后就可以进行 Where、OrderBy、GroupBy、分页、聚合查询等操作：**
查出一个用户及其隶属的城市和省份的所有信息：
```csharp
/* 调用 Select 方法返回一个泛型为包含 User、City、Province 匿名类型的 IQuery 对象。
 * Select 方法也可以返回自定义类型 。
 */
var qq = user_city_province.Select((user, city, province) => new
{
    User = user,
    City = city,
    Province = province
});

/* 根据条件筛选，然后调用 ToList 就会返回一个泛型为 new { User = user, City = city, Province = province } 的 List 集合 */
var result = qq.Where(a => a.User.Id == 1).ToList();

/*
 * 生成的 sql：
 * SELECT "USERS"."ID" AS "ID","USERS"."NAME" AS "NAME","USERS"."GENDER" AS "GENDER","USERS"."AGE" AS "AGE","USERS"."CITYID" AS "CITYID","USERS"."OPTIME" AS "OPTIME","CITY"."ID" AS "ID0","CITY"."NAME" AS "NAME0","CITY"."PROVINCEID" AS "PROVINCEID","PROVINCE"."ID" AS "ID1","PROVINCE"."NAME" AS "NAME1" 
   FROM "USERS" "USERS" 
   INNER JOIN "CITY" "CITY" ON "USERS"."CITYID" = "CITY"."ID" 
   INNER JOIN "PROVINCE" "PROVINCE" ON "CITY"."PROVINCEID" = "PROVINCE"."ID" 
   WHERE "USERS"."ID" = 1
 */
```
可以只获取指定的字段信息：
```csharp
user_city_province.Select((user, city, province) => new
{
    UserId = user.Id,
    UserName = user.Name,
    CityName = city.Name,
    ProvinceName = province.Name
}).Where(a => a.UserId == 1).ToList();

/*
 * 生成的 sql 只会包含 UserId、UserName、CityName、ProvinceName 四个字段
 * SELECT "USERS"."ID" AS "USERID","USERS"."NAME" AS "USERNAME","CITY"."NAME" AS "CITYNAME","PROVINCE"."NAME" AS "PROVINCENAME" 
   FROM "USERS" "USERS" 
   INNER JOIN "CITY" "CITY" ON "USERS"."CITYID" = "CITY"."ID" 
   INNER JOIN "PROVINCE" "PROVINCE" ON "CITY"."PROVINCEID" = "PROVINCE"."ID" 
   WHERE "USERS"."ID" = 1
 */
```
框架亦支持左连接、右连接和Full连接查询，用法和内连接相同。');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3324837696316112896', 'SqlServer-更新数据', 'SqlServer-更新数据', 'SqlServer-更新数据', '<h1 id="h1-u66F4u65B0u6570u636E"><a name="更新数据" class="reference-link"></a><span class="header-link octicon octicon-link"></span>更新数据</h1><p>Chloe 支持两种数据更新方式。<br><strong>1.实体更新：</strong></p>
<pre><code class="lang-csharp">User user = new User();
user.Id = 1;
user.Name = &quot;lu&quot;;
user.Age = 28;
user.Gender = Gender.Man;
user.OpTime = DateTime.Now;

/* 更新所有映射的字段 */
context.Update(user);
/*
 * String @P_0 = &#39;lu&#39;;
   Gender @P_1 = Man;
   Int32 @P_2 = 28;
   Nullable&lt;Int32&gt; @P_3 = NULL;
   DateTime @P_4 = &#39;2016/8/26 18:18:36&#39;;
   Int32 @P_5 = 1;
   UPDATE [Users] SET [Name]=@P_0,[Gender]=@P_1,[Age]=@P_2,[CityId]=@P_3,[OpTime]=@P_4 
   WHERE [Users].[Id] = @P_5
 */
</code></pre>
<p>由于 user 对象未被上下文跟踪，这会使所有的映射列都会被更新。Chloe 也支持类似 EF 一样只更新被修改过的属性。</p>
<pre><code class="lang-csharp">/*
 * 支持只更新属性值已变的属性
 */

/* 在修改实体属性前让上下文跟踪实体 */
context.TrackEntity(user);

/* 然后再修改实体属性 */
user.Name = user.Name + &quot;1&quot;;

/* 然后调用 Update 方法，这时只会更新被修改过的属性 */
context.Update(user);
/*
 * String @P_0 = &#39;lu1&#39;;
   Int32 @P_1 = 1;
   UPDATE [Users] SET [Name]=@P_0 WHERE [Users].[Id] = @P_1
 */
</code></pre>
<p><strong>2.lambda 方式更新：</strong><br>该方式解决的问题是：1.指定列更新；2.批量更新；3.支持类似 Age=Age + 100 这样更新字段。用法如下：</p>
<pre><code class="lang-csharp">context.Update&lt;User&gt;(a =&gt; a.Age &gt; 18, a =&gt; new User()
{
    Name = a.Name,
    Age = a.Age + 100,
    Gender = Gender.Man,
    OpTime = DateTime.Now
});
/*
 * UPDATE [Users] SET [Name]=[Users].[Name],[Age]=([Users].[Age] + 100),[Gender]=1,[OpTime]=GETDATE() 
   WHERE [Users].[Age] &gt; 18
 */
</code></pre>
', TO_DATE('2016-12-01 19:18:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-02 19:20:01', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 更新数据
Chloe 支持两种数据更新方式。
**1.实体更新：**
```csharp
User user = new User();
user.Id = 1;
user.Name = "lu";
user.Age = 28;
user.Gender = Gender.Man;
user.OpTime = DateTime.Now;

/* 更新所有映射的字段 */
context.Update(user);
/*
 * String @P_0 = ''lu'';
   Gender @P_1 = Man;
   Int32 @P_2 = 28;
   Nullable<Int32> @P_3 = NULL;
   DateTime @P_4 = ''2016/8/26 18:18:36'';
   Int32 @P_5 = 1;
   UPDATE [Users] SET [Name]=@P_0,[Gender]=@P_1,[Age]=@P_2,[CityId]=@P_3,[OpTime]=@P_4 
   WHERE [Users].[Id] = @P_5
 */
```
由于 user 对象未被上下文跟踪，这会使所有的映射列都会被更新。Chloe 也支持类似 EF 一样只更新被修改过的属性。
```csharp
/*
 * 支持只更新属性值已变的属性
 */

/* 在修改实体属性前让上下文跟踪实体 */
context.TrackEntity(user);

/* 然后再修改实体属性 */
user.Name = user.Name + "1";

/* 然后调用 Update 方法，这时只会更新被修改过的属性 */
context.Update(user);
/*
 * String @P_0 = ''lu1'';
   Int32 @P_1 = 1;
   UPDATE [Users] SET [Name]=@P_0 WHERE [Users].[Id] = @P_1
 */
```
**2.lambda 方式更新：**
该方式解决的问题是：1.指定列更新；2.批量更新；3.支持类似 Age=Age + 100 这样更新字段。用法如下：
```csharp
context.Update<User>(a => a.Age > 18, a => new User()
{
    Name = a.Name,
    Age = a.Age + 100,
    Gender = Gender.Man,
    OpTime = DateTime.Now
});
/*
 * UPDATE [Users] SET [Name]=[Users].[Name],[Age]=([Users].[Age] + 100),[Gender]=1,[OpTime]=GETDATE() 
   WHERE [Users].[Age] > 18
 */
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3324837762527395840', 'SqlServer-删除数据', 'SqlServer-删除数据', 'SqlServer-删除数据', '<h1 id="h1-u5220u9664u6570u636E"><a name="删除数据" class="reference-link"></a><span class="header-link octicon octicon-link"></span>删除数据</h1><p>Chloe 支持两种数据删除方式。<br><strong>1.实体删除：</strong><br>该方式删除必须要求实体拥有一个主键，否则会报异常提示。</p>
<pre><code class="lang-csharp">User user = new User();
user.Id = 1;
context.Delete(user);
/*
 * Int32 @P_0 = 1;
   DELETE [Users] WHERE [Users].[Id] = @P_0
 */
</code></pre>
<p><strong>2.lambda 方式删除：</strong><br>使用该方式可以删除单条数据，也可以删除多条数据。</p>
<pre><code class="lang-csharp">/* 删除单条数据 */
context.Delete&lt;User&gt;(a =&gt; a.Id == 1);
/*
 * DELETE [Users] WHERE [Users].[Id] = 1
 */

/* 批量删除满足条件的数据 */
context.Delete&lt;User&gt;(a =&gt; a.Age &gt; 18);
/*
 * DELETE [Users] WHERE [Users].[Age] &gt; 18
 */
</code></pre>
', TO_DATE('2016-12-01 19:18:16', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-02 11:19:15', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 删除数据
Chloe 支持两种数据删除方式。
**1.实体删除：**
该方式删除必须要求实体拥有一个主键，否则会报异常提示。
```csharp
User user = new User();
user.Id = 1;
context.Delete(user);
/*
 * Int32 @P_0 = 1;
   DELETE [Users] WHERE [Users].[Id] = @P_0
 */
```
**2.lambda 方式删除：**
使用该方式可以删除单条数据，也可以删除多条数据。
```csharp
/* 删除单条数据 */
context.Delete<User>(a => a.Id == 1);
/*
 * DELETE [Users] WHERE [Users].[Id] = 1
 */

/* 批量删除满足条件的数据 */
context.Delete<User>(a => a.Age > 18);
/*
 * DELETE [Users] WHERE [Users].[Age] > 18
 */
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3324837828717707264', 'SqlServer-存储过程', 'SqlServer-存储过程', 'SqlServer-存储过程', '<h1 id="h1-u5B58u50A8u8FC7u7A0B"><a name="存储过程" class="reference-link"></a><span class="header-link octicon octicon-link"></span>存储过程</h1><p>Chloe 支持存储过程以及 output 参数。<br><strong>通过存储过程获取一个 User 信息：</strong></p>
<pre><code class="lang-csharp">DbParam id = new DbParam(&quot;@id&quot;, 1);
User user = context.SqlQuery&lt;User&gt;(&quot;Proc_GetUser&quot;, CommandType.StoredProcedure, id).FirstOrDefault();
</code></pre>
<p><strong>通过存储过程的 output 参数获取一个用户的 name：</strong></p>
<pre><code class="lang-csharp">DbParam id = new DbParam(&quot;@id&quot;, 1);
DbParam outputName = new DbParam(&quot;@name&quot;, null, typeof(string)) { Direction = ParamDirection.Output };
context.Session.ExecuteNonQuery(&quot;Proc_GetUserName&quot;, CommandType.StoredProcedure, id, outputName);
</code></pre>
', TO_DATE('2016-12-01 19:18:31', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-02 14:19:29', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 存储过程
Chloe 支持存储过程以及 output 参数。
**通过存储过程获取一个 User 信息：**
```csharp
DbParam id = new DbParam("@id", 1);
User user = context.SqlQuery<User>("Proc_GetUser", CommandType.StoredProcedure, id).FirstOrDefault();
```
**通过存储过程的 output 参数获取一个用户的 name：**
```csharp
DbParam id = new DbParam("@id", 1);
DbParam outputName = new DbParam("@name", null, typeof(string)) { Direction = ParamDirection.Output };
context.Session.ExecuteNonQuery("Proc_GetUserName", CommandType.StoredProcedure, id, outputName);
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3324837890621440000', 'SqlServer-事务', 'SqlServer-事务', 'SqlServer-事务', '<h1 id="h1-u4E8Bu52A1u652Fu6301"><a name="事务支持" class="reference-link"></a><span class="header-link octicon octicon-link"></span>事务支持</h1><p><strong>基本用法：</strong></p>
<pre><code class="lang-csharp">using (MsSqlContext context = new MsSqlContext(DbHelper.ConnectionString))
{
    try
    {
        context.Session.BeginTransaction();

        /* do some things here */
        context.Update(user);
        context.Delete&lt;User&gt;(a =&gt; a.Gender == null);

        context.Session.CommitTransaction();
    }
    catch
    {
        if (context.Session.IsInTransaction)
            context.Session.RollbackTransaction();
        throw;
    }
}
</code></pre>
', TO_DATE('2016-12-01 19:18:46', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-02 14:24:54', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 事务支持
**基本用法：**
```csharp
using (MsSqlContext context = new MsSqlContext(DbHelper.ConnectionString))
{
    try
    {
        context.Session.BeginTransaction();

        /* do some things here */
        context.Update(user);
        context.Delete<User>(a => a.Gender == null);

        context.Session.CommitTransaction();
    }
    catch
    {
        if (context.Session.IsInTransaction)
            context.Session.RollbackTransaction();
        throw;
    }
}
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325141727961939968', 'SqlServer-常用函数', 'SqlServer-常用函数', 'SqlServer-常用函数', '<h1 id="h1-u5E38u7528u51FDu6570"><a name="常用函数" class="reference-link"></a><span class="header-link octicon octicon-link"></span>常用函数</h1><p><strong>Chloe 对很多数据库函数支持很丰富，具体用法如下：</strong></p>
<pre><code class="lang-csharp">IQuery&lt;User&gt; q = context.Query&lt;User&gt;();

var space = new char[] { &#39; &#39; };

DateTime startTime = DateTime.Now;
DateTime endTime = DateTime.Now.AddDays(1);
q.Select(a =&gt; new
{
    Id = a.Id,

    String_Length = (int?)a.Name.Length,//LEN([Users].[Name])
    Substring = a.Name.Substring(0),//SUBSTRING([Users].[Name],0 + 1,LEN([Users].[Name]))
    Substring1 = a.Name.Substring(1),//SUBSTRING([Users].[Name],1 + 1,LEN([Users].[Name]))
    Substring1_2 = a.Name.Substring(1, 2),//SUBSTRING([Users].[Name],1 + 1,2)
    ToLower = a.Name.ToLower(),//LOWER([Users].[Name])
    ToUpper = a.Name.ToUpper(),//UPPER([Users].[Name])
    IsNullOrEmpty = string.IsNullOrEmpty(a.Name),//too long
    Contains = (bool?)a.Name.Contains(&quot;s&quot;),//
    Trim = a.Name.Trim(),//RTRIM(LTRIM([Users].[Name]))
    TrimStart = a.Name.TrimStart(space),//LTRIM([Users].[Name])
    TrimEnd = a.Name.TrimEnd(space),//RTRIM([Users].[Name])
    StartsWith = (bool?)a.Name.StartsWith(&quot;s&quot;),//
    EndsWith = (bool?)a.Name.EndsWith(&quot;s&quot;),//

    DiffYears = DbFunctions.DiffYears(startTime, endTime),//DATEDIFF(YEAR,@P_0,@P_1)
    DiffMonths = DbFunctions.DiffMonths(startTime, endTime),//DATEDIFF(MONTH,@P_0,@P_1)
    DiffDays = DbFunctions.DiffDays(startTime, endTime),//DATEDIFF(DAY,@P_0,@P_1)
    DiffHours = DbFunctions.DiffHours(startTime, endTime),//DATEDIFF(HOUR,@P_0,@P_1)
    DiffMinutes = DbFunctions.DiffMinutes(startTime, endTime),//DATEDIFF(MINUTE,@P_0,@P_1)
    DiffSeconds = DbFunctions.DiffSeconds(startTime, endTime),//DATEDIFF(SECOND,@P_0,@P_1)
    DiffMilliseconds = DbFunctions.DiffMilliseconds(startTime, endTime),//DATEDIFF(MILLISECOND,@P_0,@P_1)
    //DiffMicroseconds = DbFunctions.DiffMicroseconds(startTime, endTime),//DATEDIFF(MICROSECOND,@P_0,@P_1)  Exception

    AddYears = startTime.AddYears(1),//DATEADD(YEAR,1,@P_0)
    AddMonths = startTime.AddMonths(1),//DATEADD(MONTH,1,@P_0)
    AddDays = startTime.AddDays(1),//DATEADD(DAY,1,@P_0)
    AddHours = startTime.AddHours(1),//DATEADD(HOUR,1,@P_0)
    AddMinutes = startTime.AddMinutes(2),//DATEADD(MINUTE,2,@P_0)
    AddSeconds = startTime.AddSeconds(120),//DATEADD(SECOND,120,@P_0)
    AddMilliseconds = startTime.AddMilliseconds(20000),//DATEADD(MILLISECOND,20000,@P_0)

    Now = DateTime.Now,//GETDATE()
    UtcNow = DateTime.UtcNow,//GETUTCDATE()
    Today = DateTime.Today,//CAST(GETDATE() AS DATE)
    Date = DateTime.Now.Date,//CAST(GETDATE() AS DATE)
    Year = DateTime.Now.Year,//DATEPART(YEAR,GETDATE())
    Month = DateTime.Now.Month,//DATEPART(MONTH,GETDATE())
    Day = DateTime.Now.Day,//DATEPART(DAY,GETDATE())
    Hour = DateTime.Now.Hour,//DATEPART(HOUR,GETDATE())
    Minute = DateTime.Now.Minute,//DATEPART(MINUTE,GETDATE())
    Second = DateTime.Now.Second,//DATEPART(SECOND,GETDATE())
    Millisecond = DateTime.Now.Millisecond,//DATEPART(MILLISECOND,GETDATE())
    DayOfWeek = DateTime.Now.DayOfWeek,//(DATEPART(WEEKDAY,GETDATE()) - 1)

    Int_Parse = int.Parse(&quot;1&quot;),//CAST(N&#39;1&#39; AS INT)
    Int16_Parse = Int16.Parse(&quot;11&quot;),//CAST(N&#39;11&#39; AS SMALLINT)
    Long_Parse = long.Parse(&quot;2&quot;),//CAST(N&#39;2&#39; AS BIGINT)
    Double_Parse = double.Parse(&quot;3&quot;),//CAST(N&#39;3&#39; AS FLOAT)
    Float_Parse = float.Parse(&quot;4&quot;),//CAST(N&#39;4&#39; AS REAL)
    //Decimal_Parse = decimal.Parse(&quot;5&quot;),//CAST(N&#39;5&#39; AS DECIMAL)  ps: &#39;Decimal.Parse(string s)&#39; is not supported now,because we don&#39;t know the precision and scale information.
    Guid_Parse = Guid.Parse(&quot;D544BC4C-739E-4CD3-A3D3-7BF803FCE179&quot;),//CAST(N&#39;D544BC4C-739E-4CD3-A3D3-7BF803FCE179&#39; AS UNIQUEIDENTIFIER) AS [Guid_Parse]

    Bool_Parse = bool.Parse(&quot;1&quot;),//CASE WHEN CAST(N&#39;1&#39; AS BIT) = CAST(1 AS BIT) THEN CAST(1 AS BIT) WHEN NOT (CAST(N&#39;1&#39; AS BIT) = CAST(1 AS BIT)) THEN CAST(0 AS BIT) ELSE NULL END AS [Bool_Parse]
    DateTime_Parse = DateTime.Parse(&quot;1992-1-16&quot;),//CAST(N&#39;1992-1-16&#39; AS DATETIME) AS [DateTime_Parse]

    B = a.Age == null ? false : a.Age &gt; 1,
}).ToList();
</code></pre>
<p>上述的函数可以用于 Select 方法，亦可用在 Where 或其它方法的 lambda 表达式树中，最终都会翻译成数据库函数。</p>
', TO_DATE('2016-12-02 15:26:07', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-02 15:26:20', 'YYYY-MM-DD HH24:MI:SS'), '0', null, null);
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3324833832581988352', 'SqlServer-聚合查询', 'SqlServer-聚合查询', 'SqlServer-聚合查询', '<h1 id="h1-u805Au5408u67E5u8BE2"><a name="聚合查询" class="reference-link"></a><span class="header-link octicon octicon-link"></span>聚合查询</h1><p>Chloe 可以像写 sql 一样实现聚合查询。</p>
<pre><code class="lang-csharp">IQuery&lt;User&gt; q = context.Query&lt;User&gt;();

q.Select(a =&gt; AggregateFunctions.Count()).First();
/*
 * SELECT TOP (1) COUNT(1) AS [C] FROM [Users] AS [Users]
 */

/* 支持多个聚合函数 */
q.Select(a =&gt; new
{
    Count = AggregateFunctions.Count(),
    LongCount = AggregateFunctions.LongCount(),
    Sum = AggregateFunctions.Sum(a.Age),
    Max = AggregateFunctions.Max(a.Age),
    Min = AggregateFunctions.Min(a.Age),
    Average = AggregateFunctions.Average(a.Age)
}).First();
/*
 * SELECT TOP (1) COUNT(1) AS [Count],COUNT_BIG(1) AS [LongCount],CAST(SUM([Users].[Age]) AS INT) AS [Sum],MAX([Users].[Age]) AS [Max],MIN([Users].[Age]) AS [Min],CAST(AVG([Users].[Age]) AS FLOAT) AS [Average] 
   FROM [Users] AS [Users]
 */

var count = q.Count();
/*
 * SELECT COUNT(1) AS [C] FROM [Users] AS [Users]
 */

var longCount = q.LongCount();
/*
 * SELECT COUNT_BIG(1) AS [C] FROM [Users] AS [Users]
 */

var sum = q.Sum(a =&gt; a.Age);
/*
 * SELECT CAST(SUM([Users].[Age]) AS INT) AS [C] FROM [Users] AS [Users]
 */

var max = q.Max(a =&gt; a.Age);
/*
 * SELECT MAX([Users].[Age]) AS [C] FROM [Users] AS [Users]
 */

var min = q.Min(a =&gt; a.Age);
/*
 * SELECT MIN([Users].[Age]) AS [C] FROM [Users] AS [Users]
 */

var avg = q.Average(a =&gt; a.Age);
/*
 * SELECT CAST(AVG([Users].[Age]) AS FLOAT) AS [C] FROM [Users] AS [Users]
 */
</code></pre>
', TO_DATE('2016-12-01 19:02:39', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-01 19:05:32', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 聚合查询
Chloe 可以像写 sql 一样实现聚合查询。
```csharp
IQuery<User> q = context.Query<User>();

q.Select(a => AggregateFunctions.Count()).First();
/*
 * SELECT TOP (1) COUNT(1) AS [C] FROM [Users] AS [Users]
 */

/* 支持多个聚合函数 */
q.Select(a => new
{
    Count = AggregateFunctions.Count(),
    LongCount = AggregateFunctions.LongCount(),
    Sum = AggregateFunctions.Sum(a.Age),
    Max = AggregateFunctions.Max(a.Age),
    Min = AggregateFunctions.Min(a.Age),
    Average = AggregateFunctions.Average(a.Age)
}).First();
/*
 * SELECT TOP (1) COUNT(1) AS [Count],COUNT_BIG(1) AS [LongCount],CAST(SUM([Users].[Age]) AS INT) AS [Sum],MAX([Users].[Age]) AS [Max],MIN([Users].[Age]) AS [Min],CAST(AVG([Users].[Age]) AS FLOAT) AS [Average] 
   FROM [Users] AS [Users]
 */

var count = q.Count();
/*
 * SELECT COUNT(1) AS [C] FROM [Users] AS [Users]
 */

var longCount = q.LongCount();
/*
 * SELECT COUNT_BIG(1) AS [C] FROM [Users] AS [Users]
 */

var sum = q.Sum(a => a.Age);
/*
 * SELECT CAST(SUM([Users].[Age]) AS INT) AS [C] FROM [Users] AS [Users]
 */

var max = q.Max(a => a.Age);
/*
 * SELECT MAX([Users].[Age]) AS [C] FROM [Users] AS [Users]
 */

var min = q.Min(a => a.Age);
/*
 * SELECT MIN([Users].[Age]) AS [C] FROM [Users] AS [Users]
 */

var avg = q.Average(a => a.Age);
/*
 * SELECT CAST(AVG([Users].[Age]) AS FLOAT) AS [C] FROM [Users] AS [Users]
 */
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3324834901575860224', 'SqlServer-Sql查询', 'SqlServer-Sql查询', 'SqlServer-Sql查询', '<h1 id="h1-sql-"><a name="Sql查询" class="reference-link"></a><span class="header-link octicon octicon-link"></span>Sql查询</h1><p>对于一些极其复杂的 sql 查询，还是得依赖原生 sql，因此，Chloe 提供了原生 sql 查询接口。<br><strong>获取满足条件的用户信息，将结果映射到 User 类上：</strong></p>
<pre><code class="lang-csharp">context.SqlQuery&lt;User&gt;(&quot;select * from Users where Age&gt;@age&quot;, new DbParam(&quot;@age&quot;, 18)).ToList();
</code></pre>
<p><strong>获取满足条件的用户 Id：</strong></p>
<pre><code class="lang-csharp">context.SqlQuery&lt;int&gt;(&quot;select Id from Users where Age&gt;@age&quot;, new DbParam(&quot;@age&quot;, 18)).ToList();
</code></pre>
<p><strong>支持存储过程：</strong></p>
<pre><code class="lang-csharp">context.SqlQuery&lt;User&gt;(&quot;Proc_Test&quot;, CommandType.StoredProcedure, new DbParam(&quot;@age&quot;, 18)).ToList();
</code></pre>
', TO_DATE('2016-12-01 19:06:54', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-01 19:16:32', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# Sql查询
对于一些极其复杂的 sql 查询，还是得依赖原生 sql，因此，Chloe 提供了原生 sql 查询接口。
**获取满足条件的用户信息，将结果映射到 User 类上：**
```csharp
context.SqlQuery<User>("select * from Users where Age>@age", new DbParam("@age", 18)).ToList();
```
**获取满足条件的用户 Id：**
```csharp
context.SqlQuery<int>("select Id from Users where Age>@age", new DbParam("@age", 18)).ToList();
```
**支持存储过程：**
```csharp
context.SqlQuery<User>("Proc_Test", CommandType.StoredProcedure, new DbParam("@age", 18)).ToList();
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3324832206215446528', 'SqlServer-分组查询', 'SqlServer-分组查询', 'SqlServer-分组查询', '<h1 id="h1-u5206u7EC4u67E5u8BE2"><a name="分组查询" class="reference-link"></a><span class="header-link octicon octicon-link"></span>分组查询</h1><p>Chloe 支持分组查询以及分组后 Having 过滤和聚合查询。</p>
<pre><code class="lang-csharp">IQuery&lt;User&gt; q = context.Query&lt;User&gt;();

IGroupingQuery&lt;User&gt; g = q.Where(a =&gt; a.Id &gt; 0).GroupBy(a =&gt; a.Age);
g = g.Having(a =&gt; a.Age &gt; 1 &amp;&amp; AggregateFunctions.Count() &gt; 0);

g.Select(a =&gt; new
{
    a.Age,
    Count = AggregateFunctions.Count(),
    Sum = AggregateFunctions.Sum(a.Age),
    Max = AggregateFunctions.Max(a.Age),
    Min = AggregateFunctions.Min(a.Age),
    Avg = AggregateFunctions.Average(a.Age)
}).ToList();
/*
 * SELECT [Users].[Age] AS [Age],COUNT(1) AS [Count],CAST(SUM([Users].[Age]) AS INT) AS [Sum],MAX([Users].[Age]) AS [Max],MIN([Users].[Age]) AS [Min],CAST(AVG([Users].[Age]) AS FLOAT) AS [Avg] 
   FROM [Users] AS [Users] 
   WHERE [Users].[Id] &gt; 0 
   GROUP BY [Users].[Age] 
   HAVING ([Users].[Age] &gt; 1 AND COUNT(1) &gt; 0)
 */
</code></pre>
', TO_DATE('2016-12-01 18:56:11', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-02 19:11:06', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 分组查询
Chloe 支持分组查询以及分组后 Having 过滤和聚合查询。
```csharp
IQuery<User> q = context.Query<User>();

IGroupingQuery<User> g = q.Where(a => a.Id > 0).GroupBy(a => a.Age);
g = g.Having(a => a.Age > 1 && AggregateFunctions.Count() > 0);

g.Select(a => new
{
    a.Age,
    Count = AggregateFunctions.Count(),
    Sum = AggregateFunctions.Sum(a.Age),
    Max = AggregateFunctions.Max(a.Age),
    Min = AggregateFunctions.Min(a.Age),
    Avg = AggregateFunctions.Average(a.Age)
}).ToList();
/*
 * SELECT [Users].[Age] AS [Age],COUNT(1) AS [Count],CAST(SUM([Users].[Age]) AS INT) AS [Sum],MAX([Users].[Age]) AS [Max],MIN([Users].[Age]) AS [Min],CAST(AVG([Users].[Age]) AS FLOAT) AS [Avg] 
   FROM [Users] AS [Users] 
   WHERE [Users].[Id] > 0 
   GROUP BY [Users].[Age] 
   HAVING ([Users].[Age] > 1 AND COUNT(1) > 0)
 */
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3324809512287731712', 'SqlServer-连接查询', 'SqlServer-连接查询', 'SqlServer-连接查询', '<h1 id="h1-u8FDEu63A5u67E5u8BE2"><a name="连接查询" class="reference-link"></a><span class="header-link octicon octicon-link"></span>连接查询</h1><p>Chloe 友好支持多表连接查询，一切都可以用 lambda 表达式操作，返回类型可以是自定义类型，也可以是匿名类型。强类型开发，编译可见错误，容错率高。<br><strong>1.创建相关的 IQuery 对象：</strong></p>
<pre><code class="lang-csharp">IQuery&lt;User&gt; users = context.Query&lt;User&gt;();
IQuery&lt;City&gt; cities = context.Query&lt;City&gt;();
IQuery&lt;Province&gt; provinces = context.Query&lt;Province&gt;();
</code></pre>
<p><strong>2.建立连接：</strong></p>
<pre><code class="lang-csharp">/* User 表和 City 表 inner join，得到 IJoiningQuery&lt;User, City&gt; 对象 */
IJoiningQuery&lt;User, City&gt; user_city = users.InnerJoin(cities, (user, city) =&gt; user.CityId == city.Id);

/* City 表和 Province 表 inner join，得到 IJoiningQuery&lt;User, City, Province&gt; 对象 */
IJoiningQuery&lt;User, City, Province&gt; user_city_province = user_city.InnerJoin(provinces, (user, city, province) =&gt; city.ProvinceId == province.Id);
</code></pre>
<p><strong>3.得到最终的 IJoiningQuery 对象，就可以 Select 所需要的数据返回一个 IQuery 对象，然后就可以进行 Where、OrderBy、GroupBy、分页、聚合查询等操作：</strong><br>查出一个用户及其隶属的城市和省份的所有信息：</p>
<pre><code class="lang-csharp">/* 调用 Select 方法返回一个泛型为包含 User、City、Province 匿名类型的 IQuery 对象。
 * Select 方法也可以返回自定义类型 。
 */
var qq = user_city_province.Select((user, city, province) =&gt; new
{
    User = user,
    City = city,
    Province = province
});

/* 根据条件筛选，然后调用 ToList 就会返回一个泛型为 new { User = user, City = city, Province = province } 的 List 集合 */
var result = qq.Where(a =&gt; a.User.Id == 1).ToList();

/*
 * 生成的 sql：
 * SELECT [Users].[Id] AS [Id],[Users].[Name] AS [Name],[Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime],[City].[Id] AS [Id0],[City].[Name] AS [Name0],[City].[ProvinceId] AS [ProvinceId],[Province].[Id] AS [Id1],[Province].[Name] AS [Name1] 
   FROM [Users] AS [Users] 
   INNER JOIN [City] AS [City] ON [Users].[CityId] = [City].[Id] 
   INNER JOIN [Province] AS [Province] ON [City].[ProvinceId] = [Province].[Id] 
   WHERE [Users].[Id] = 1
 */
</code></pre>
<p>可以只获取指定的字段信息：</p>
<pre><code class="lang-csharp">user_city_province.Select((user, city, province) =&gt; new
{
    UserId = user.Id,
    UserName = user.Name,
    CityName = city.Name,
    ProvinceName = province.Name
}).Where(a =&gt; a.UserId == 1).ToList();

/*
 * 生成的 sql 只会包含 UserId、UserName、CityName、ProvinceName 四个字段
 * SELECT [Users].[Id] AS [UserId],[Users].[Name] AS [UserName],[City].[Name] AS [CityName],[Province].[Name] AS [ProvinceName] 
   FROM [Users] AS [Users] 
   INNER JOIN [City] AS [City] ON [Users].[CityId] = [City].[Id] 
   INNER JOIN [Province] AS [Province] ON [City].[ProvinceId] = [Province].[Id] 
   WHERE [Users].[Id] = 1
 */
</code></pre>
<p>框架亦支持左连接、右连接和Full连接查询，用法和内连接相同。</p>
', TO_DATE('2016-12-01 17:26:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-01 18:13:07', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 连接查询
Chloe 友好支持多表连接查询，一切都可以用 lambda 表达式操作，返回类型可以是自定义类型，也可以是匿名类型。强类型开发，编译可见错误，容错率高。
**1.创建相关的 IQuery 对象：**
```csharp
IQuery<User> users = context.Query<User>();
IQuery<City> cities = context.Query<City>();
IQuery<Province> provinces = context.Query<Province>();
```
**2.建立连接：**
```csharp
/* User 表和 City 表 inner join，得到 IJoiningQuery<User, City> 对象 */
IJoiningQuery<User, City> user_city = users.InnerJoin(cities, (user, city) => user.CityId == city.Id);

/* City 表和 Province 表 inner join，得到 IJoiningQuery<User, City, Province> 对象 */
IJoiningQuery<User, City, Province> user_city_province = user_city.InnerJoin(provinces, (user, city, province) => city.ProvinceId == province.Id);
```
**3.得到最终的 IJoiningQuery 对象，就可以 Select 所需要的数据返回一个 IQuery 对象，然后就可以进行 Where、OrderBy、GroupBy、分页、聚合查询等操作：**
查出一个用户及其隶属的城市和省份的所有信息：
```csharp
/* 调用 Select 方法返回一个泛型为包含 User、City、Province 匿名类型的 IQuery 对象。
 * Select 方法也可以返回自定义类型 。
 */
var qq = user_city_province.Select((user, city, province) => new
{
    User = user,
    City = city,
    Province = province
});

/* 根据条件筛选，然后调用 ToList 就会返回一个泛型为 new { User = user, City = city, Province = province } 的 List 集合 */
var result = qq.Where(a => a.User.Id == 1).ToList();

/*
 * 生成的 sql：
 * SELECT [Users].[Id] AS [Id],[Users].[Name] AS [Name],[Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime],[City].[Id] AS [Id0],[City].[Name] AS [Name0],[City].[ProvinceId] AS [ProvinceId],[Province].[Id] AS [Id1],[Province].[Name] AS [Name1] 
   FROM [Users] AS [Users] 
   INNER JOIN [City] AS [City] ON [Users].[CityId] = [City].[Id] 
   INNER JOIN [Province] AS [Province] ON [City].[ProvinceId] = [Province].[Id] 
   WHERE [Users].[Id] = 1
 */
```
可以只获取指定的字段信息：
```csharp
user_city_province.Select((user, city, province) => new
{
    UserId = user.Id,
    UserName = user.Name,
    CityName = city.Name,
    ProvinceName = province.Name
}).Where(a => a.UserId == 1).ToList();

/*
 * 生成的 sql 只会包含 UserId、UserName、CityName、ProvinceName 四个字段
 * SELECT [Users].[Id] AS [UserId],[Users].[Name] AS [UserName],[City].[Name] AS [CityName],[Province].[Name] AS [ProvinceName] 
   FROM [Users] AS [Users] 
   INNER JOIN [City] AS [City] ON [Users].[CityId] = [City].[Id] 
   INNER JOIN [Province] AS [Province] ON [City].[ProvinceId] = [Province].[Id] 
   WHERE [Users].[Id] = 1
 */
```
框架亦支持左连接、右连接和Full连接查询，用法和内连接相同。');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3324798423210655744', 'SqlServer-创建DbContext', 'SqlServer-创建DbContext', 'SqlServer-创建DbContext', '<h1 id="h1--dbcontext"><a name="创建 DbContext" class="reference-link"></a><span class="header-link octicon octicon-link"></span>创建 DbContext</h1><p>对于 SqlServer 数据库，需要引用程序集 Chloe.dll 和 Chloe.SqlServer.dll，然后使用 Chloe.SqlServer.MsSqlContext 创建上下文实例。</p>
<pre><code class="lang-csharp">string connString = &quot;Your connection string&quot;;
MsSqlContext context = new MsSqlContext(connString);
</code></pre>
<p>MsSqlContext 对象默认使用 ROWNUMBER 的分页方式，如果您的数据库是 SqlServer2012 或更高版本，可以切换使用 OFFSET FETCH 分页方式。</p>
<pre><code class="lang-csharp">context.PagingMode = PagingMode.OFFSET_FETCH;
</code></pre>
', TO_DATE('2016-12-01 16:41:56', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-01 19:39:45', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 创建 DbContext
对于 SqlServer 数据库，需要引用程序集 Chloe.dll 和 Chloe.SqlServer.dll，然后使用 Chloe.SqlServer.MsSqlContext 创建上下文实例。
```csharp
string connString = "Your connection string";
MsSqlContext context = new MsSqlContext(connString);
```
MsSqlContext 对象默认使用 ROWNUMBER 的分页方式，如果您的数据库是 SqlServer2012 或更高版本，可以切换使用 OFFSET FETCH 分页方式。
```csharp
context.PagingMode = PagingMode.OFFSET_FETCH;
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3324802610879266816', 'SqlServer-基本查询', 'SqlServer-基本查询', 'SqlServer-基本查询', '<h1 id="h1-u57FAu672Cu67E5u8BE2"><a name="基本查询" class="reference-link"></a><span class="header-link octicon octicon-link"></span>基本查询</h1><p><strong>根据 Id 查询出一个 User 对象：</strong></p>
<pre><code class="lang-csharp">string connString = &quot;Your connection string&quot;;
MsSqlContext context = new MsSqlContext(connString);
context.PagingMode = PagingMode.OFFSET_FETCH;
IQuery&lt;User&gt; q = context.Query&lt;User&gt;();

q.Where(a =&gt; a.Id == 1).FirstOrDefault();
/*
 *生成的 sql：
 * SELECT TOP (1) [Users].[Id] AS [Id],[Users].[Name] AS [Name],[Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime] 
   FROM [Users] AS [Users] 
   WHERE [Users].[Id] = 1
 */
</code></pre>
<p><strong>in 查询：</strong></p>
<pre><code class="lang-csharp">List&lt;int&gt; ids = new List&lt;int&gt;() { 1, 2, 3 };
q.Where(a =&gt; ids.Contains(a.Id)).ToList();
/*
 * Int32 @P_0 = 1;
   Int32 @P_1 = 2;
   Int32 @P_2 = 3;
   SELECT [Users].[Id] AS [Id],[Users].[Name] AS [Name],[Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime] 
   FROM [Users] AS [Users] 
   WHERE [Users].[Id] IN (@P_0,@P_1,@P_2)
 */
</code></pre>
<p><strong>可以选取指定的字段，返回一个匿名类型：</strong></p>
<pre><code class="lang-csharp">q.Where(a =&gt; a.Id == 1).Select(a =&gt; new { a.Id, a.Name }).FirstOrDefault();
/*
 * 只会生成包含 Id 和 Name 两个字段的 sql 语句：
 * SELECT TOP (1) [Users].[Id] AS [Id],[Users].[Name] AS [Name] 
   FROM [Users] AS [Users] 
   WHERE [Users].[Id] = 1
 */
</code></pre>
<p><strong>排序：</strong></p>
<pre><code class="lang-csharp">q.Where(a =&gt; a.Id &gt; 0).OrderBy(a =&gt; a.Age).ThenBy(a =&gt; a.Id).ToList();
/*
 * SELECT TOP (1) [Users].[Id] AS [Id],[Users].[Name] AS [Name],[Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime] 
   FROM [Users] AS [Users] 
   WHERE [Users].[Id] &gt; 0 
   ORDER BY [Age] ASC,[Id] ASC
 */
</code></pre>
<p><strong>分页：</strong></p>
<pre><code class="lang-csharp">q.Where(a =&gt; a.Id &gt; 0).OrderBy(a =&gt; a.Age).TakePage(1, 20).ToList();
/*
 * SELECT [Users].[Id] AS [Id],[Users].[Name] AS [Name],[Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime] 
   FROM [Users] AS [Users] WHERE [Users].[Id] &gt; 0 
   ORDER BY [Users].[Age] ASC 
   OFFSET 0 ROWS FETCH NEXT 20 ROWS ONLY
 */
</code></pre>
', TO_DATE('2016-12-01 16:58:35', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-08 11:39:19', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 基本查询
**根据 Id 查询出一个 User 对象：**
```csharp
string connString = "Your connection string";
MsSqlContext context = new MsSqlContext(connString);
context.PagingMode = PagingMode.OFFSET_FETCH;
IQuery<User> q = context.Query<User>();

q.Where(a => a.Id == 1).FirstOrDefault();
/*
 *生成的 sql：
 * SELECT TOP (1) [Users].[Id] AS [Id],[Users].[Name] AS [Name],[Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime] 
   FROM [Users] AS [Users] 
   WHERE [Users].[Id] = 1
 */
```
**in 查询：**
```csharp
List<int> ids = new List<int>() { 1, 2, 3 };
q.Where(a => ids.Contains(a.Id)).ToList();
/*
 * Int32 @P_0 = 1;
   Int32 @P_1 = 2;
   Int32 @P_2 = 3;
   SELECT [Users].[Id] AS [Id],[Users].[Name] AS [Name],[Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime] 
   FROM [Users] AS [Users] 
   WHERE [Users].[Id] IN (@P_0,@P_1,@P_2)
 */
```
**可以选取指定的字段，返回一个匿名类型：**
```csharp
q.Where(a => a.Id == 1).Select(a => new { a.Id, a.Name }).FirstOrDefault();
/*
 * 只会生成包含 Id 和 Name 两个字段的 sql 语句：
 * SELECT TOP (1) [Users].[Id] AS [Id],[Users].[Name] AS [Name] 
   FROM [Users] AS [Users] 
   WHERE [Users].[Id] = 1
 */
```
**排序：**
```csharp
q.Where(a => a.Id > 0).OrderBy(a => a.Age).ThenBy(a => a.Id).ToList();
/*
 * SELECT TOP (1) [Users].[Id] AS [Id],[Users].[Name] AS [Name],[Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime] 
   FROM [Users] AS [Users] 
   WHERE [Users].[Id] > 0 
   ORDER BY [Age] ASC,[Id] ASC
 */
```
**分页：**
```csharp
q.Where(a => a.Id > 0).OrderBy(a => a.Age).TakePage(1, 20).ToList();
/*
 * SELECT [Users].[Id] AS [Id],[Users].[Name] AS [Name],[Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime] 
   FROM [Users] AS [Users] WHERE [Users].[Id] > 0 
   ORDER BY [Users].[Age] ASC 
   OFFSET 0 ROWS FETCH NEXT 20 ROWS ONLY
 */
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3324793835434803200', 'SqlServer-实体特性', 'SqlServer-实体特性', 'SqlServer-实体特性', '<h1 id="h1-u5B9Eu4F53u7279u6027"><a name="实体特性" class="reference-link"></a><span class="header-link octicon octicon-link"></span>实体特性</h1><p>实体特性位于命名空间 Chloe.Entity 下。<br><strong>TableAttribute：</strong><br>Name：映射的表名。<br>实体对应的表默认是实体类名，如实体类型名与表名不一致，可通过该特性指定映射的表名。</p>
<pre><code class="lang-csharp">public class TableAttribute : Attribute
{
    public TableAttribute() { }
    public TableAttribute(string name)
    {
        Name = name;
    }
    public string Name { get; set; }
}
</code></pre>
<p><strong>ColumnAttribute：</strong><br>Name：映射的列名，如不指定，则默认使用属性名。<br>IsPrimaryKey：指示列是否为主键，默认为 false。<br>当一个实体没显示指定主键的时候，Chloe 默认选择名为 Id 的属性（如果存在）作为主键列，与此同时，如果该实体也没有显示指定任何自增列并且 Id 属性为 Int16、Int32 或者 Int64 类型，则也会默认其为自增列。</p>
<pre><code class="lang-csharp">public class ColumnAttribute : Attribute
{
    public ColumnAttribute() { }
    public ColumnAttribute(string name)
    {
        this.Name = name;
    }
    public string Name { get; set; }
    public bool IsPrimaryKey { get; set; }
}
</code></pre>
<p><strong>AutoIncrementAttribute：</strong><br>标记属性为自增列。在 SqlServer 中，一个实体不能指定多个自增列，否则会报异常提示。</p>
<pre><code class="lang-csharp">public class AutoIncrementAttribute : Attribute
{
}
</code></pre>
<p><strong>NonAutoIncrementAttribute：</strong><br>标记属性为非自增列。</p>
<pre><code class="lang-csharp">public class NonAutoIncrementAttribute : Attribute
{
}
</code></pre>
<p><strong>NotMappedAttribute：</strong><br>指示属性不映射任何列。</p>
<pre><code class="lang-csharp">public class NotMappedAttribute : Attribute
{
}
</code></pre>
', TO_DATE('2016-12-01 16:23:43', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-02 19:32:09', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 实体特性
实体特性位于命名空间 Chloe.Entity 下。
**TableAttribute：**
Name：映射的表名。
实体对应的表默认是实体类名，如实体类型名与表名不一致，可通过该特性指定映射的表名。
```csharp
public class TableAttribute : Attribute
{
    public TableAttribute() { }
    public TableAttribute(string name)
    {
        Name = name;
    }
    public string Name { get; set; }
}
```
**ColumnAttribute：**
Name：映射的列名，如不指定，则默认使用属性名。
IsPrimaryKey：指示列是否为主键，默认为 false。
当一个实体没显示指定主键的时候，Chloe 默认选择名为 Id 的属性（如果存在）作为主键列，与此同时，如果该实体也没有显示指定任何自增列并且 Id 属性为 Int16、Int32 或者 Int64 类型，则也会默认其为自增列。
```csharp
public class ColumnAttribute : Attribute
{
    public ColumnAttribute() { }
    public ColumnAttribute(string name)
    {
        this.Name = name;
    }
    public string Name { get; set; }
    public bool IsPrimaryKey { get; set; }
}
```
**AutoIncrementAttribute：**
标记属性为自增列。在 SqlServer 中，一个实体不能指定多个自增列，否则会报异常提示。
```csharp
public class AutoIncrementAttribute : Attribute
{
}
```
**NonAutoIncrementAttribute：**
标记属性为非自增列。
```csharp
public class NonAutoIncrementAttribute : Attribute
{
}
```
**NotMappedAttribute：**
指示属性不映射任何列。
```csharp
public class NotMappedAttribute : Attribute
{
}
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3324795934096752640', 'SqlServer-实体定义', 'SqlServer-实体定义', 'SqlServer-实体定义', '<h1 id="h1-u5B9Eu4F53u5B9Au4E49"><a name="实体定义" class="reference-link"></a><span class="header-link octicon octicon-link"></span>实体定义</h1><p>实体为纯 POCO，支持可空类型以及枚举类型映射。</p>
<pre><code class="lang-csharp">public enum Gender
{
    Man = 1,
    Woman
}
</code></pre>
<pre><code class="lang-csharp">[TableAttribute(&quot;Users&quot;)]
public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public Gender? Gender { get; set; }
    public int? Age { get; set; }
    public int? CityId { get; set; }
    public DateTime? OpTime { get; set; }
}
</code></pre>
<pre><code class="lang-csharp">public class City
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int ProvinceId { get; set; }
}
</code></pre>
<pre><code class="lang-csharp">public class Province
{
    public int Id { get; set; }
    public string Name { get; set; }
}
</code></pre>
', TO_DATE('2016-12-01 16:32:03', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-01 16:39:30', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 实体定义
实体为纯 POCO，支持可空类型以及枚举类型映射。
```csharp
public enum Gender
{
    Man = 1,
    Woman
}
```
```csharp
[TableAttribute("Users")]
public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public Gender? Gender { get; set; }
    public int? Age { get; set; }
    public int? CityId { get; set; }
    public DateTime? OpTime { get; set; }
}
```
```csharp
public class City
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int ProvinceId { get; set; }
}
```
```csharp
public class Province
{
    public int Id { get; set; }
    public string Name { get; set; }
}
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3324788085501198336', 'DbFunctions', 'DbFunctions 接口介绍', 'DbFunctions', '<h1 id="h1-dbfunctions"><a name="DbFunctions" class="reference-link"></a><span class="header-link octicon octicon-link"></span>DbFunctions</h1><p>表示与数据库对应函数的一系列方法，可用在 Where、Select 等方法的表达式树中。</p>
<pre><code class="lang-csharp">public static class DbFunctions
{
    /* 求两个时间的年差，对应 SqlServer 的 DATEDIFF(YEAR,dateTime1,dateTime2) */
    public static int? DiffYears(DateTime? dateTime1, DateTime? dateTime2)
    {
        throw new NotSupportedException();
    }

    /* 求两个时间的月差，对应 SqlServer 的 DATEDIFF(MONTH,dateTime1,dateTime2) */
    public static int? DiffMonths(DateTime? dateTime1, DateTime? dateTime2)
    {
        throw new NotSupportedException();
    }

    /* 求两个时间的日差，对应 SqlServer 的 DATEDIFF(DAY,dateTime1,dateTime2) */
    public static int? DiffDays(DateTime? dateTime1, DateTime? ddateTime2)
    {
        throw new NotSupportedException();
    }

    /* 求两个时间的时差，对应 SqlServer 的 DATEDIFF(HOUR,dateTime1,dateTime2) */
    public static int? DiffHours(DateTime? dateTime1, DateTime? dateTime2)
    {
        throw new NotSupportedException();
    }

    /* 求两个时间的分钟差，对应 SqlServer 的 DATEDIFF(MINUTE,dateTime1,dateTime2) */
    public static int? DiffMinutes(DateTime? dateTime1, DateTime? dateTime2)
    {
        throw new NotSupportedException();
    }

    /* 求两个时间的秒差，对应 SqlServer 的 DATEDIFF(SECOND,dateTime1,dateTime2) */
    public static int? DiffSeconds(DateTime? dateTime1, DateTime? dateTime2)
    {
        throw new NotSupportedException();
    }

    /* 求两个时间的毫秒差，对应 SqlServer 的 DATEDIFF(DATEDIFF,dateTime1,dateTime2) */
    public static int? DiffMilliseconds(DateTime? dateTime1, DateTime? dateTime2)
    {
        throw new NotSupportedException();
    }

    /* 求两个时间的微毫秒差，对应 SqlServer 的 DATEDIFF(MICROSECOND,dateTime1,dateTime2) */
    public static int? DiffMicroseconds(DateTime? dateTime1, DateTime? dateTime2)
    {
        throw new NotSupportedException();
    }
}
</code></pre>
', TO_DATE('2016-12-01 16:00:52', 'YYYY-MM-DD HH24:MI:SS'), null, '0', null, '# DbFunctions
表示与数据库对应函数的一系列方法，可用在 Where、Select 等方法的表达式树中。
```csharp
public static class DbFunctions
{
    /* 求两个时间的年差，对应 SqlServer 的 DATEDIFF(YEAR,dateTime1,dateTime2) */
    public static int? DiffYears(DateTime? dateTime1, DateTime? dateTime2)
    {
        throw new NotSupportedException();
    }

    /* 求两个时间的月差，对应 SqlServer 的 DATEDIFF(MONTH,dateTime1,dateTime2) */
    public static int? DiffMonths(DateTime? dateTime1, DateTime? dateTime2)
    {
        throw new NotSupportedException();
    }

    /* 求两个时间的日差，对应 SqlServer 的 DATEDIFF(DAY,dateTime1,dateTime2) */
    public static int? DiffDays(DateTime? dateTime1, DateTime? ddateTime2)
    {
        throw new NotSupportedException();
    }

    /* 求两个时间的时差，对应 SqlServer 的 DATEDIFF(HOUR,dateTime1,dateTime2) */
    public static int? DiffHours(DateTime? dateTime1, DateTime? dateTime2)
    {
        throw new NotSupportedException();
    }

    /* 求两个时间的分钟差，对应 SqlServer 的 DATEDIFF(MINUTE,dateTime1,dateTime2) */
    public static int? DiffMinutes(DateTime? dateTime1, DateTime? dateTime2)
    {
        throw new NotSupportedException();
    }

    /* 求两个时间的秒差，对应 SqlServer 的 DATEDIFF(SECOND,dateTime1,dateTime2) */
    public static int? DiffSeconds(DateTime? dateTime1, DateTime? dateTime2)
    {
        throw new NotSupportedException();
    }

    /* 求两个时间的毫秒差，对应 SqlServer 的 DATEDIFF(DATEDIFF,dateTime1,dateTime2) */
    public static int? DiffMilliseconds(DateTime? dateTime1, DateTime? dateTime2)
    {
        throw new NotSupportedException();
    }

    /* 求两个时间的微毫秒差，对应 SqlServer 的 DATEDIFF(MICROSECOND,dateTime1,dateTime2) */
    public static int? DiffMicroseconds(DateTime? dateTime1, DateTime? dateTime2)
    {
        throw new NotSupportedException();
    }
}
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3324773693170647040', 'IDbSession', 'IDbSession 接口介绍', 'IDbSession', '<h1 id="h1-idbsession"><a name="IDbSession" class="reference-link"></a><span class="header-link octicon octicon-link"></span>IDbSession</h1><p>DbContext 上下文会话接口，包含基本的 ado.net 操作（支持存储过程及 output 参数）。</p>
<pre><code class="lang-csharp">public interface IDbSession : IDisposable
{
    /* 获取关联的上下文 */
    IDbContext DbContext { get; }

    /* 判断当前会话是否开启了事务 */
    bool IsInTransaction { get; }
    /* 获取或设置在终止执行命令的尝试并生成错误之前的等待时间（以秒为单位）。默认值为 30 秒 */
    int CommandTimeout { get; set; }

    /* 下面这些方法，你懂的... */
    int ExecuteNonQuery(string cmdText, params DbParam[] parameters);
    int ExecuteNonQuery(string cmdText, CommandType cmdType, params DbParam[] parameters);

    object ExecuteScalar(string cmdText, params DbParam[] parameters);
    object ExecuteScalar(string cmdText, CommandType cmdType, params DbParam[] parameters);

    IDataReader ExecuteReader(string cmdText, params DbParam[] parameters);
    IDataReader ExecuteReader(string cmdText, CommandType cmdType, params DbParam[] parameters);

    void BeginTransaction();
    void BeginTransaction(IsolationLevel il);
    void CommitTransaction();
    void RollbackTransaction();
}
</code></pre>
', TO_DATE('2016-12-01 15:03:40', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-01 15:04:59', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# IDbSession
DbContext 上下文会话接口，包含基本的 ado.net 操作（支持存储过程及 output 参数）。
```csharp
public interface IDbSession : IDisposable
{
    /* 获取关联的上下文 */
    IDbContext DbContext { get; }

    /* 判断当前会话是否开启了事务 */
    bool IsInTransaction { get; }
    /* 获取或设置在终止执行命令的尝试并生成错误之前的等待时间（以秒为单位）。默认值为 30 秒 */
    int CommandTimeout { get; set; }

    /* 下面这些方法，你懂的... */
    int ExecuteNonQuery(string cmdText, params DbParam[] parameters);
    int ExecuteNonQuery(string cmdText, CommandType cmdType, params DbParam[] parameters);

    object ExecuteScalar(string cmdText, params DbParam[] parameters);
    object ExecuteScalar(string cmdText, CommandType cmdType, params DbParam[] parameters);

    IDataReader ExecuteReader(string cmdText, params DbParam[] parameters);
    IDataReader ExecuteReader(string cmdText, CommandType cmdType, params DbParam[] parameters);

    void BeginTransaction();
    void BeginTransaction(IsolationLevel il);
    void CommitTransaction();
    void RollbackTransaction();
}
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3324786622028840960', 'AggregateFunctions', 'AggregateFunctions 接口介绍', 'AggregateFunctions', '<h1 id="h1-aggregatefunctions"><a name="AggregateFunctions" class="reference-link"></a><span class="header-link octicon octicon-link"></span>AggregateFunctions</h1><p>该系列方法用在 Where、Select、Having 等方法的表达式树中，用于表示数据库对应的聚合函数。</p>
<pre><code class="lang-csharp">public static class AggregateFunctions
{
    /* 对应数据库中的 COUNT() 函数 */
    public static int Count()
    {
        return 0;
    }
    public static long LongCount()
    {
        return 0;
    }

    /* 对应数据库中的 MAX(exp) 函数 */
    public static TResult Max&lt;TResult&gt;(TResult p)
    {
        return p;
    }
    /* 对应数据库中的 MIN(exp) 函数 */
    public static TResult Min&lt;TResult&gt;(TResult p)
    {
        return p;
    }

    /* 对应数据库中的 SUM(exp) 函数 */
    public static int Sum(int p)
    {
        return p;
    }
    public static int? Sum(int? p)
    {
        return p;
    }
    public static long Sum(long p)
    {
        return p;
    }
    public static long? Sum(long? p)
    {
        return p;
    }
    public static decimal Sum(decimal p)
    {
        return p;
    }
    public static decimal? Sum(decimal? p)
    {
        return p;
    }
    public static double Sum(double p)
    {
        return p;
    }
    public static double? Sum(double? p)
    {
        return p;
    }
    public static float Sum(float p)
    {
        return p;
    }
    public static float? Sum(float? p)
    {
        return p;
    }

    /* 对应数据库中的 AVG(exp) 函数 */
    public static double Average(int p)
    {
        return p;
    }
    public static double? Average(int? p)
    {
        return p;
    }
    public static double Average(long p)
    {
        return p;
    }
    public static double? Average(long? p)
    {
        return p;
    }
    public static decimal Average(decimal p)
    {
        return p;
    }
    public static decimal? Average(decimal? p)
    {
        return p;
    }
    public static double Average(double p)
    {
        return p;
    }
    public static double? Average(double? p)
    {
        return p;
    }
    public static float Average(float p)
    {
        return p;
    }
    public static float? Average(float? p)
    {
        return p;
    }
}
</code></pre>
', TO_DATE('2016-12-01 15:55:03', 'YYYY-MM-DD HH24:MI:SS'), null, '0', null, '# AggregateFunctions
该系列方法用在 Where、Select、Having 等方法的表达式树中，用于表示数据库对应的聚合函数。
```csharp
public static class AggregateFunctions
{
    /* 对应数据库中的 COUNT() 函数 */
    public static int Count()
    {
        return 0;
    }
    public static long LongCount()
    {
        return 0;
    }

    /* 对应数据库中的 MAX(exp) 函数 */
    public static TResult Max<TResult>(TResult p)
    {
        return p;
    }
    /* 对应数据库中的 MIN(exp) 函数 */
    public static TResult Min<TResult>(TResult p)
    {
        return p;
    }

    /* 对应数据库中的 SUM(exp) 函数 */
    public static int Sum(int p)
    {
        return p;
    }
    public static int? Sum(int? p)
    {
        return p;
    }
    public static long Sum(long p)
    {
        return p;
    }
    public static long? Sum(long? p)
    {
        return p;
    }
    public static decimal Sum(decimal p)
    {
        return p;
    }
    public static decimal? Sum(decimal? p)
    {
        return p;
    }
    public static double Sum(double p)
    {
        return p;
    }
    public static double? Sum(double? p)
    {
        return p;
    }
    public static float Sum(float p)
    {
        return p;
    }
    public static float? Sum(float? p)
    {
        return p;
    }

    /* 对应数据库中的 AVG(exp) 函数 */
    public static double Average(int p)
    {
        return p;
    }
    public static double? Average(int? p)
    {
        return p;
    }
    public static double Average(long p)
    {
        return p;
    }
    public static double? Average(long? p)
    {
        return p;
    }
    public static decimal Average(decimal p)
    {
        return p;
    }
    public static decimal? Average(decimal? p)
    {
        return p;
    }
    public static double Average(double p)
    {
        return p;
    }
    public static double? Average(double? p)
    {
        return p;
    }
    public static float Average(float p)
    {
        return p;
    }
    public static float? Average(float? p)
    {
        return p;
    }
}
```
');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3324756912431431680', 'IDbContext', 'IDbContext接口介绍', 'IDbContext', '<h1 id="h1-idbcontext"><a name="IDbContext" class="reference-link"></a><span class="header-link octicon octicon-link"></span>IDbContext</h1><p>数据库上下文接口，包含创建查询对象（IQuery）、插入数据、更新数据和删除数据等基本操作。</p>
<pre><code class="lang-csharp">public interface IDbContext : IDisposable
{
    /* 获取关联的会话，通过该对象可以执行基本的 ado.net 操作（包括事务） */
    IDbSession Session { get; }

    /* 获取 IQuery 对象。主要数据查询的入口 */
    IQuery&lt;TEntity&gt; Query&lt;TEntity&gt;() where TEntity : new();

    /* 原生 sql 查询，支持存储过程 */
    IEnumerable&lt;T&gt; SqlQuery&lt;T&gt;(string sql, params DbParam[] parameters) where T : new();
    IEnumerable&lt;T&gt; SqlQuery&lt;T&gt;(string sql, CommandType cmdType, params DbParam[] parameters) where T : new();

    /* 传入一个实体对象，插入数据。返回传入的实体对象（如果实体拥有自增列，会自动将自增值设置到实体相应的属性上） */
    TEntity Insert&lt;TEntity&gt;(TEntity entity);

    /* 传入一个 lambda 表达式树，向表插入指定的字段数据，返回主键值（如果主键是自增，则返回的就是自增值） */
    object Insert&lt;TEntity&gt;(Expression&lt;Func&lt;TEntity&gt;&gt; body);

    /* 传入一个实体，更新单条数据。返回受影响的行数 */
    int Update&lt;TEntity&gt;(TEntity entity);

    /* 传入 condition 条件和 body 表达式树，更新满足 condition 条件的指定的字段。返回受影响的行数 */
    int Update&lt;TEntity&gt;(Expression&lt;Func&lt;TEntity, bool&gt;&gt; condition, Expression&lt;Func&lt;TEntity, TEntity&gt;&gt; body);

    /* 传入一个实体，删除单条数据。返回受影响的行数 */
    int Delete&lt;TEntity&gt;(TEntity entity);
    /* 传入 condition 条件表达式树，删除满足 condition 条件的数据。返回受影响的行数 */
    int Delete&lt;TEntity&gt;(Expression&lt;Func&lt;TEntity, bool&gt;&gt; condition);

    /* 传入一个实体，让当前上下文跟踪该实体的属性变化。调用 &#39;int Update&lt;TEntity&gt;(TEntity entity)&#39; 方法更新数据时，只会更新实体被修改过的属性。 */
    void TrackEntity(object entity);
}
</code></pre>
', TO_DATE('2016-12-01 13:56:59', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-03 23:04:11', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# IDbContext
数据库上下文接口，包含创建查询对象（IQuery）、插入数据、更新数据和删除数据等基本操作。
```csharp
public interface IDbContext : IDisposable
{
    /* 获取关联的会话，通过该对象可以执行基本的 ado.net 操作（包括事务） */
    IDbSession Session { get; }

    /* 获取 IQuery 对象。主要数据查询的入口 */
    IQuery<TEntity> Query<TEntity>() where TEntity : new();

    /* 原生 sql 查询，支持存储过程 */
    IEnumerable<T> SqlQuery<T>(string sql, params DbParam[] parameters) where T : new();
    IEnumerable<T> SqlQuery<T>(string sql, CommandType cmdType, params DbParam[] parameters) where T : new();

    /* 传入一个实体对象，插入数据。返回传入的实体对象（如果实体拥有自增列，会自动将自增值设置到实体相应的属性上） */
    TEntity Insert<TEntity>(TEntity entity);

    /* 传入一个 lambda 表达式树，向表插入指定的字段数据，返回主键值（如果主键是自增，则返回的就是自增值） */
    object Insert<TEntity>(Expression<Func<TEntity>> body);

    /* 传入一个实体，更新单条数据。返回受影响的行数 */
    int Update<TEntity>(TEntity entity);

    /* 传入 condition 条件和 body 表达式树，更新满足 condition 条件的指定的字段。返回受影响的行数 */
    int Update<TEntity>(Expression<Func<TEntity, bool>> condition, Expression<Func<TEntity, TEntity>> body);

    /* 传入一个实体，删除单条数据。返回受影响的行数 */
    int Delete<TEntity>(TEntity entity);
    /* 传入 condition 条件表达式树，删除满足 condition 条件的数据。返回受影响的行数 */
    int Delete<TEntity>(Expression<Func<TEntity, bool>> condition);

    /* 传入一个实体，让当前上下文跟踪该实体的属性变化。调用 ''int Update<TEntity>(TEntity entity)'' 方法更新数据时，只会更新实体被修改过的属性。 */
    void TrackEntity(object entity);
}
```
');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3324760360224817152', 'IQuery', 'IQuery 接口介绍', 'IQuery', '<h1 id="h1-iquery"><a name="IQuery" class="reference-link"></a><span class="header-link octicon octicon-link"></span>IQuery</h1><p>强类型对象化查询接口，包含条件筛选、排序、分组查询、聚合查询、多表连接查询和分页等功能。</p>
<pre><code class="lang-csharp">public interface IQuery&lt;T&gt;
{
    /* 在上下文中跟踪实体 */
    IQuery&lt;T&gt; AsTracking();
    IEnumerable&lt;T&gt; AsEnumerable();
    /* 投影选择数据（支持匿名类型） */
    IQuery&lt;TResult&gt; Select&lt;TResult&gt;(Expression&lt;Func&lt;T, TResult&gt;&gt; selector);

    /* 筛选条件，和 linq 一样的用法 */
    IQuery&lt;T&gt; Where(Expression&lt;Func&lt;T, bool&gt;&gt; predicate);

    /* 排序，和 linq 一样的用法 */
    IOrderedQuery&lt;T&gt; OrderBy&lt;K&gt;(Expression&lt;Func&lt;T, K&gt;&gt; keySelector);
    IOrderedQuery&lt;T&gt; OrderByDesc&lt;K&gt;(Expression&lt;Func&lt;T, K&gt;&gt; keySelector);

    IQuery&lt;T&gt; Skip(int count);
    IQuery&lt;T&gt; Take(int count);
    /* 分页 */
    IQuery&lt;T&gt; TakePage(int pageNumber, int pageSize);

    /* 获取分组查询对象 */
    IGroupingQuery&lt;T&gt; GroupBy&lt;K&gt;(Expression&lt;Func&lt;T, K&gt;&gt; keySelector);

    /* 多表内连接 */
    IJoiningQuery&lt;T, TSource&gt; InnerJoin&lt;TSource&gt;(IQuery&lt;TSource&gt; q, Expression&lt;Func&lt;T, TSource, bool&gt;&gt; on);
    /* 多表左连接 */
    IJoiningQuery&lt;T, TSource&gt; LeftJoin&lt;TSource&gt;(IQuery&lt;TSource&gt; q, Expression&lt;Func&lt;T, TSource, bool&gt;&gt; on);
    /* 多表右连接 */
    IJoiningQuery&lt;T, TSource&gt; RightJoin&lt;TSource&gt;(IQuery&lt;TSource&gt; q, Expression&lt;Func&lt;T, TSource, bool&gt;&gt; on);
    /* 多表全连接 */
    IJoiningQuery&lt;T, TSource&gt; FullJoin&lt;TSource&gt;(IQuery&lt;TSource&gt; q, Expression&lt;Func&lt;T, TSource, bool&gt;&gt; on);

    T First();
    T First(Expression&lt;Func&lt;T, bool&gt;&gt; predicate);
    T FirstOrDefault();
    T FirstOrDefault(Expression&lt;Func&lt;T, bool&gt;&gt; predicate);

    /* 查询数据，返回 List 集合 */
    List&lt;T&gt; ToList();

    /* 判断满足条件的数据是否存在 */
    bool Any();
    bool Any(Expression&lt;Func&lt;T, bool&gt;&gt; predicate);

    /* 获取总条数 */
    int Count();
    long LongCount();

    /* 求最大值和最小值 */
    TResult Max&lt;TResult&gt;(Expression&lt;Func&lt;T, TResult&gt;&gt; selector);
    TResult Min&lt;TResult&gt;(Expression&lt;Func&lt;T, TResult&gt;&gt; selector);

    /* 求和 */
    int Sum(Expression&lt;Func&lt;T, int&gt;&gt; selector);
    int? Sum(Expression&lt;Func&lt;T, int?&gt;&gt; selector);
    long Sum(Expression&lt;Func&lt;T, long&gt;&gt; selector);
    long? Sum(Expression&lt;Func&lt;T, long?&gt;&gt; selector);
    decimal Sum(Expression&lt;Func&lt;T, decimal&gt;&gt; selector);
    decimal? Sum(Expression&lt;Func&lt;T, decimal?&gt;&gt; selector);
    double Sum(Expression&lt;Func&lt;T, double&gt;&gt; selector);
    double? Sum(Expression&lt;Func&lt;T, double?&gt;&gt; selector);
    float Sum(Expression&lt;Func&lt;T, float&gt;&gt; selector);
    float? Sum(Expression&lt;Func&lt;T, float?&gt;&gt; selector);

    /* 求平均值 */
    double Average(Expression&lt;Func&lt;T, int&gt;&gt; selector);
    double? Average(Expression&lt;Func&lt;T, int?&gt;&gt; selector);
    double Average(Expression&lt;Func&lt;T, long&gt;&gt; selector);
    double? Average(Expression&lt;Func&lt;T, long?&gt;&gt; selector);
    decimal Average(Expression&lt;Func&lt;T, decimal&gt;&gt; selector);
    decimal? Average(Expression&lt;Func&lt;T, decimal?&gt;&gt; selector);
    double Average(Expression&lt;Func&lt;T, double&gt;&gt; selector);
    double? Average(Expression&lt;Func&lt;T, double?&gt;&gt; selector);
    float Average(Expression&lt;Func&lt;T, float&gt;&gt; selector);
    float? Average(Expression&lt;Func&lt;T, float?&gt;&gt; selector);
}
</code></pre>
', TO_DATE('2016-12-01 14:10:41', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-09 14:09:02', 'YYYY-MM-DD HH24:MI:SS'), '0', null, null);
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3324761124187930624', 'IOrderedQuery', 'IOrderedQuery 接口介绍', 'IOrderedQuery', '<h1 id="h1-iorderedquery"><a name="IOrderedQuery" class="reference-link"></a><span class="header-link octicon octicon-link"></span>IOrderedQuery</h1><p>支持多个排序字段接口。</p>
<pre><code class="lang-csharp">public interface IOrderedQuery&lt;T&gt; : IQuery&lt;T&gt;
{
    IOrderedQuery&lt;T&gt; ThenBy&lt;K&gt;(Expression&lt;Func&lt;T, K&gt;&gt; keySelector);
    IOrderedQuery&lt;T&gt; ThenByDesc&lt;K&gt;(Expression&lt;Func&lt;T, K&gt;&gt; keySelector);
}
</code></pre>
', TO_DATE('2016-12-01 14:13:44', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-09 14:09:11', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# IOrderedQuery
支持多个排序字段接口。
```csharp
public interface IOrderedQuery<T> : IQuery<T>
{
    IOrderedQuery<T> ThenBy<K>(Expression<Func<T, K>> keySelector);
    IOrderedQuery<T> ThenByDesc<K>(Expression<Func<T, K>> keySelector);
}
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3324765409034371072', 'IGroupingQuery', 'IGroupingQuery 接口介绍', 'IGroupingQuery', '<h1 id="h1-igroupingquery"><a name="IGroupingQuery" class="reference-link"></a><span class="header-link octicon octicon-link"></span>IGroupingQuery</h1><p>分组查询接口。</p>
<pre><code class="lang-csharp">public interface IGroupingQuery&lt;T&gt;
{
    /* 支持多个字段分组，即 group by Age，Id... */
    IGroupingQuery&lt;T&gt; ThenBy&lt;K&gt;(Expression&lt;Func&lt;T, K&gt;&gt; keySelector);

    /* 增加 having 条件： select Age from Users group by Age having count(Age)&gt;1  */
    IGroupingQuery&lt;T&gt; Having(Expression&lt;Func&lt;T, bool&gt;&gt; predicate);

    /* select 数据：g.Select(a =&gt; new { a.Age, Count = AggregateFunctions.Count() }) --&gt; select Age,COUNT(1) from Users group by Age having count(Age)&gt;1  */
    IQuery&lt;TResult&gt; Select&lt;TResult&gt;(Expression&lt;Func&lt;T, TResult&gt;&gt; selector);
}
</code></pre>
', TO_DATE('2016-12-01 14:30:45', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-09 14:09:18', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# IGroupingQuery
分组查询接口。
```csharp
public interface IGroupingQuery<T>
{
    /* 支持多个字段分组，即 group by Age，Id... */
    IGroupingQuery<T> ThenBy<K>(Expression<Func<T, K>> keySelector);

    /* 增加 having 条件： select Age from Users group by Age having count(Age)>1  */
    IGroupingQuery<T> Having(Expression<Func<T, bool>> predicate);

    /* select 数据：g.Select(a => new { a.Age, Count = AggregateFunctions.Count() }) --> select Age,COUNT(1) from Users group by Age having count(Age)>1  */
    IQuery<TResult> Select<TResult>(Expression<Func<T, TResult>> selector);
}
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3324766621741875200', 'IJoiningQuery', 'IJoiningQuery 接口介绍', 'IJoiningQuery', '<h1 id="h1-ijoiningquery"><a name="IJoiningQuery" class="reference-link"></a><span class="header-link octicon octicon-link"></span>IJoiningQuery</h1><p>该接口用于基本的多表连接操作。</p>
<pre><code class="lang-csharp">public interface IJoiningQuery&lt;T1, T2&gt;
{
    /* 多表内连接 */
    IJoiningQuery&lt;T1, T2, T3&gt; InnerJoin&lt;T3&gt;(IQuery&lt;T3&gt; q, Expression&lt;Func&lt;T1, T2, T3, bool&gt;&gt; on);
    /* 多表左连接 */
    IJoiningQuery&lt;T1, T2, T3&gt; LeftJoin&lt;T3&gt;(IQuery&lt;T3&gt; q, Expression&lt;Func&lt;T1, T2, T3, bool&gt;&gt; on);
    /* 多表右连接 */
    IJoiningQuery&lt;T1, T2, T3&gt; RightJoin&lt;T3&gt;(IQuery&lt;T3&gt; q, Expression&lt;Func&lt;T1, T2, T3, bool&gt;&gt; on);
    /* 多表全连接 */
    IJoiningQuery&lt;T1, T2, T3&gt; FullJoin&lt;T3&gt;(IQuery&lt;T3&gt; q, Expression&lt;Func&lt;T1, T2, T3, bool&gt;&gt; on);
    /* 投影选择数据（支持匿名类型） */
    IQuery&lt;TResult&gt; Select&lt;TResult&gt;(Expression&lt;Func&lt;T1, T2, TResult&gt;&gt; selector);
}

public interface IJoiningQuery&lt;T1, T2, T3&gt;
{
    IJoiningQuery&lt;T1, T2, T3, T4&gt; InnerJoin&lt;T4&gt;(IQuery&lt;T4&gt; q, Expression&lt;Func&lt;T1, T2, T3, T4, bool&gt;&gt; on);
    IJoiningQuery&lt;T1, T2, T3, T4&gt; LeftJoin&lt;T4&gt;(IQuery&lt;T4&gt; q, Expression&lt;Func&lt;T1, T2, T3, T4, bool&gt;&gt; on);
    IJoiningQuery&lt;T1, T2, T3, T4&gt; RightJoin&lt;T4&gt;(IQuery&lt;T4&gt; q, Expression&lt;Func&lt;T1, T2, T3, T4, bool&gt;&gt; on);
    IJoiningQuery&lt;T1, T2, T3, T4&gt; FullJoin&lt;T4&gt;(IQuery&lt;T4&gt; q, Expression&lt;Func&lt;T1, T2, T3, T4, bool&gt;&gt; on);
    IQuery&lt;TResult&gt; Select&lt;TResult&gt;(Expression&lt;Func&lt;T1, T2, T3, TResult&gt;&gt; selector);
}

public interface IJoiningQuery&lt;T1, T2, T3, T4&gt;
{
    IJoiningQuery&lt;T1, T2, T3, T4, T5&gt; InnerJoin&lt;T5&gt;(IQuery&lt;T5&gt; q, Expression&lt;Func&lt;T1, T2, T3, T4, T5, bool&gt;&gt; on);
    IJoiningQuery&lt;T1, T2, T3, T4, T5&gt; LeftJoin&lt;T5&gt;(IQuery&lt;T5&gt; q, Expression&lt;Func&lt;T1, T2, T3, T4, T5, bool&gt;&gt; on);
    IJoiningQuery&lt;T1, T2, T3, T4, T5&gt; RightJoin&lt;T5&gt;(IQuery&lt;T5&gt; q, Expression&lt;Func&lt;T1, T2, T3, T4, T5, bool&gt;&gt; on);
    IJoiningQuery&lt;T1, T2, T3, T4, T5&gt; FullJoin&lt;T5&gt;(IQuery&lt;T5&gt; q, Expression&lt;Func&lt;T1, T2, T3, T4, T5, bool&gt;&gt; on);
    IQuery&lt;TResult&gt; Select&lt;TResult&gt;(Expression&lt;Func&lt;T1, T2, T3, T4, TResult&gt;&gt; selector);
}

/* IJoiningQuery 接口最多支持 5 个泛型参数，如需连接更多表，可以调用 Select 方法得到 IQuery 对象后继续连接即可 */
public interface IJoiningQuery&lt;T1, T2, T3, T4, T5&gt;
{
    IQuery&lt;TResult&gt; Select&lt;TResult&gt;(Expression&lt;Func&lt;T1, T2, T3, T4, T5, TResult&gt;&gt; selector);
}
</code></pre>
', TO_DATE('2016-12-01 14:35:34', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-01 14:55:18', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# IJoiningQuery
该接口用于基本的多表连接操作。
```csharp
public interface IJoiningQuery<T1, T2>
{
    /* 多表内连接 */
    IJoiningQuery<T1, T2, T3> InnerJoin<T3>(IQuery<T3> q, Expression<Func<T1, T2, T3, bool>> on);
    /* 多表左连接 */
    IJoiningQuery<T1, T2, T3> LeftJoin<T3>(IQuery<T3> q, Expression<Func<T1, T2, T3, bool>> on);
    /* 多表右连接 */
    IJoiningQuery<T1, T2, T3> RightJoin<T3>(IQuery<T3> q, Expression<Func<T1, T2, T3, bool>> on);
    /* 多表全连接 */
    IJoiningQuery<T1, T2, T3> FullJoin<T3>(IQuery<T3> q, Expression<Func<T1, T2, T3, bool>> on);
    /* 投影选择数据（支持匿名类型） */
    IQuery<TResult> Select<TResult>(Expression<Func<T1, T2, TResult>> selector);
}

public interface IJoiningQuery<T1, T2, T3>
{
    IJoiningQuery<T1, T2, T3, T4> InnerJoin<T4>(IQuery<T4> q, Expression<Func<T1, T2, T3, T4, bool>> on);
    IJoiningQuery<T1, T2, T3, T4> LeftJoin<T4>(IQuery<T4> q, Expression<Func<T1, T2, T3, T4, bool>> on);
    IJoiningQuery<T1, T2, T3, T4> RightJoin<T4>(IQuery<T4> q, Expression<Func<T1, T2, T3, T4, bool>> on);
    IJoiningQuery<T1, T2, T3, T4> FullJoin<T4>(IQuery<T4> q, Expression<Func<T1, T2, T3, T4, bool>> on);
    IQuery<TResult> Select<TResult>(Expression<Func<T1, T2, T3, TResult>> selector);
}

public interface IJoiningQuery<T1, T2, T3, T4>
{
    IJoiningQuery<T1, T2, T3, T4, T5> InnerJoin<T5>(IQuery<T5> q, Expression<Func<T1, T2, T3, T4, T5, bool>> on);
    IJoiningQuery<T1, T2, T3, T4, T5> LeftJoin<T5>(IQuery<T5> q, Expression<Func<T1, T2, T3, T4, T5, bool>> on);
    IJoiningQuery<T1, T2, T3, T4, T5> RightJoin<T5>(IQuery<T5> q, Expression<Func<T1, T2, T3, T4, T5, bool>> on);
    IJoiningQuery<T1, T2, T3, T4, T5> FullJoin<T5>(IQuery<T5> q, Expression<Func<T1, T2, T3, T4, T5, bool>> on);
    IQuery<TResult> Select<TResult>(Expression<Func<T1, T2, T3, T4, TResult>> selector);
}

/* IJoiningQuery 接口最多支持 5 个泛型参数，如需连接更多表，可以调用 Select 方法得到 IQuery 对象后继续连接即可 */
public interface IJoiningQuery<T1, T2, T3, T4, T5>
{
    IQuery<TResult> Select<TResult>(Expression<Func<T1, T2, T3, T4, T5, TResult>> selector);
}
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325149712301948928', 'Oracle-更新数据', 'Oracle-更新数据', 'Oracle-更新数据', '<h1 id="h1-u66F4u65B0u6570u636E"><a name="更新数据" class="reference-link"></a><span class="header-link octicon octicon-link"></span>更新数据</h1><p>Chloe 支持两种数据更新方式。<br><strong>1.实体更新：</strong></p>
<pre><code class="lang-csharp">User user = new User();
user.Id = 1;
user.Name = &quot;lu&quot;;
user.Age = 28;
user.Gender = Gender.Man;
user.OpTime = DateTime.Now;

/* 更新所有映射的字段 */
context.Update(user);
/*
 * String :P_0 = &#39;lu&#39;;
   Int32 :P_1 = 1;
   Int32 :P_2 = 28;
   Nullable&lt;Int32&gt; :P_3 = NULL;
   DateTime :P_4 = &#39;2016/9/5 9:20:07&#39;;
   UPDATE &quot;USERS&quot; SET &quot;NAME&quot;=:P_0,&quot;GENDER&quot;=:P_1,&quot;AGE&quot;=:P_2,&quot;CITYID&quot;=:P_3,&quot;OPTIME&quot;=:P_4 
   WHERE &quot;USERS&quot;.&quot;ID&quot; = :P_1
 */
</code></pre>
<p>由于 user 对象未被上下文跟踪，这会使所有的映射列都会被更新。Chloe 也支持类似 EF 一样只更新被修改过的属性。</p>
<pre><code class="lang-csharp">/*
 * 支持只更新属性值已变的属性
 */

/* 在修改实体属性前让上下文跟踪实体 */
context.TrackEntity(user);

/* 然后再修改实体属性 */
user.Name = user.Name + &quot;1&quot;;

/* 然后调用 Update 方法，这时只会更新被修改过的属性 */
context.Update(user);
/*
 * String :P_0 = &#39;lu1&#39;;
   Int32 :P_1 = 1;
   UPDATE &quot;USERS&quot; SET &quot;NAME&quot;=:P_0 WHERE &quot;USERS&quot;.&quot;ID&quot; = :P_1
 */
</code></pre>
<p><strong>2.lambda 方式更新：</strong><br>该方式解决的问题是：1.指定列更新；2.批量更新；3.支持类似 Age=Age + 100 这样更新字段。用法如下：</p>
<pre><code class="lang-csharp">context.Update&lt;User&gt;(a =&gt; a.Age &gt; 18, a =&gt; new User()
{
    Name = a.Name,
    Age = a.Age + 100,
    Gender = Gender.Man,
    OpTime = DateTime.Now
});
/*
 * UPDATE &quot;USERS&quot; SET &quot;NAME&quot;=&quot;USERS&quot;.&quot;NAME&quot;,&quot;AGE&quot;=(&quot;USERS&quot;.&quot;AGE&quot; + 100),&quot;GENDER&quot;=1,&quot;OPTIME&quot;=SYSTIMESTAMP 
   WHERE &quot;USERS&quot;.&quot;AGE&quot; &gt; 18
 */
</code></pre>
', TO_DATE('2016-12-02 15:57:50', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-03 14:34:21', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 更新数据
Chloe 支持两种数据更新方式。
**1.实体更新：**
```csharp
User user = new User();
user.Id = 1;
user.Name = "lu";
user.Age = 28;
user.Gender = Gender.Man;
user.OpTime = DateTime.Now;

/* 更新所有映射的字段 */
context.Update(user);
/*
 * String :P_0 = ''lu'';
   Int32 :P_1 = 1;
   Int32 :P_2 = 28;
   Nullable<Int32> :P_3 = NULL;
   DateTime :P_4 = ''2016/9/5 9:20:07'';
   UPDATE "USERS" SET "NAME"=:P_0,"GENDER"=:P_1,"AGE"=:P_2,"CITYID"=:P_3,"OPTIME"=:P_4 
   WHERE "USERS"."ID" = :P_1
 */
```
由于 user 对象未被上下文跟踪，这会使所有的映射列都会被更新。Chloe 也支持类似 EF 一样只更新被修改过的属性。
```csharp
/*
 * 支持只更新属性值已变的属性
 */

/* 在修改实体属性前让上下文跟踪实体 */
context.TrackEntity(user);

/* 然后再修改实体属性 */
user.Name = user.Name + "1";

/* 然后调用 Update 方法，这时只会更新被修改过的属性 */
context.Update(user);
/*
 * String :P_0 = ''lu1'';
   Int32 :P_1 = 1;
   UPDATE "USERS" SET "NAME"=:P_0 WHERE "USERS"."ID" = :P_1
 */
```
**2.lambda 方式更新：**
该方式解决的问题是：1.指定列更新；2.批量更新；3.支持类似 Age=Age + 100 这样更新字段。用法如下：
```csharp
context.Update<User>(a => a.Age > 18, a => new User()
{
    Name = a.Name,
    Age = a.Age + 100,
    Gender = Gender.Man,
    OpTime = DateTime.Now
});
/*
 * UPDATE "USERS" SET "NAME"="USERS"."NAME","AGE"=("USERS"."AGE" + 100),"GENDER"=1,"OPTIME"=SYSTIMESTAMP 
   WHERE "USERS"."AGE" > 18
 */
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325149761299808256', 'Oracle-删除数据', 'Oracle-删除数据', 'Oracle-删除数据', '<h1 id="h1-u5220u9664u6570u636E"><a name="删除数据" class="reference-link"></a><span class="header-link octicon octicon-link"></span>删除数据</h1><p>Chloe 支持两种数据删除方式。<br><strong>1.实体删除：</strong><br>该方式删除必须要求实体拥有一个主键，否则会报异常提示。</p>
<pre><code class="lang-csharp">User user = new User();
user.Id = 1;
context.Delete(user);
/*
 * Int32 :P_0 = 1;
   DELETE FROM &quot;USERS&quot; WHERE &quot;USERS&quot;.&quot;ID&quot; = :P_0
 */
</code></pre>
<p><strong>2.lambda 方式删除：</strong><br>使用该方式可以删除单条数据，也可以删除多条数据。</p>
<pre><code class="lang-csharp">/* 删除单条数据 */
context.Delete&lt;User&gt;(a =&gt; a.Id == 1);
/*
 * DELETE FROM &quot;USERS&quot; WHERE &quot;USERS&quot;.&quot;ID&quot; = 1
 */

/* 批量删除满足条件的数据 */
context.Delete&lt;User&gt;(a =&gt; a.Age &gt; 18);
/*
 * DELETE FROM &quot;USERS&quot; WHERE &quot;USERS&quot;.&quot;AGE&quot; &gt; 18
 */
</code></pre>
', TO_DATE('2016-12-02 15:58:02', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-03 15:17:53', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 删除数据
Chloe 支持两种数据删除方式。
**1.实体删除：**
该方式删除必须要求实体拥有一个主键，否则会报异常提示。
```csharp
User user = new User();
user.Id = 1;
context.Delete(user);
/*
 * Int32 :P_0 = 1;
   DELETE FROM "USERS" WHERE "USERS"."ID" = :P_0
 */
```
**2.lambda 方式删除：**
使用该方式可以删除单条数据，也可以删除多条数据。
```csharp
/* 删除单条数据 */
context.Delete<User>(a => a.Id == 1);
/*
 * DELETE FROM "USERS" WHERE "USERS"."ID" = 1
 */

/* 批量删除满足条件的数据 */
context.Delete<User>(a => a.Age > 18);
/*
 * DELETE FROM "USERS" WHERE "USERS"."AGE" > 18
 */
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325150100572864512', 'Oracle-存储过程', 'Oracle-存储过程', 'Oracle-存储过程', '<h1 id="h1-u5B58u50A8u8FC7u7A0B"><a name="存储过程" class="reference-link"></a><span class="header-link octicon octicon-link"></span>存储过程</h1><p>Chloe 支持存储过程以及 output 参数。<br><strong>通过存储过程获取一个 User 信息：</strong><br>Oracle 数据库中，如果一个存储过程需要返回结果集，需要借助 RefCursor output 参数特性。用法如下：</p>
<pre><code class="lang-csharp">/* 必须先自定义 RefCursor 参数 */
OracleParameter p_cur = new OracleParameter();
p_cur.ParameterName = &quot;p_cur&quot;;
p_cur.OracleDbType = OracleDbType.RefCursor;
p_cur.Direction = ParameterDirection.Output;

DbParam refCursorParam = new DbParam();
/* 将自定义 RefCursor 参数设置到 DbParam 的 ExplicitParameter 属性 */
refCursorParam.ExplicitParameter = p_cur;

DbParam id = new DbParam(&quot;id&quot;, 1);
User user = context.SqlQuery&lt;User&gt;(&quot;Proc_GetUser&quot;, CommandType.StoredProcedure, id，refCursorParam).FirstOrDefault();
</code></pre>
<p><strong>通过存储过程的 output 参数获取一个用户的 name：</strong></p>
<pre><code class="lang-csharp">DbParam id = new DbParam(&quot;id&quot;, 1);
DbParam outputName = new DbParam(&quot;name&quot;, null, typeof(string)) { Direction = ParamDirection.Output };
context.Session.ExecuteNonQuery(&quot;Proc_GetUserName&quot;, CommandType.StoredProcedure, id, outputName);
</code></pre>
', TO_DATE('2016-12-02 15:59:23', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-05 23:11:55', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 存储过程
Chloe 支持存储过程以及 output 参数。
**通过存储过程获取一个 User 信息：**
Oracle 数据库中，如果一个存储过程需要返回结果集，需要借助 RefCursor output 参数特性。用法如下：
```csharp
/* 必须先自定义 RefCursor 参数 */
OracleParameter p_cur = new OracleParameter();
p_cur.ParameterName = "p_cur";
p_cur.OracleDbType = OracleDbType.RefCursor;
p_cur.Direction = ParameterDirection.Output;

DbParam refCursorParam = new DbParam();
/* 将自定义 RefCursor 参数设置到 DbParam 的 ExplicitParameter 属性 */
refCursorParam.ExplicitParameter = p_cur;

DbParam id = new DbParam("id", 1);
User user = context.SqlQuery<User>("Proc_GetUser", CommandType.StoredProcedure, id，refCursorParam).FirstOrDefault();
```
**通过存储过程的 output 参数获取一个用户的 name：**
```csharp
DbParam id = new DbParam("id", 1);
DbParam outputName = new DbParam("name", null, typeof(string)) { Direction = ParamDirection.Output };
context.Session.ExecuteNonQuery("Proc_GetUserName", CommandType.StoredProcedure, id, outputName);
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325150155606327296', 'Oracle-事务', 'Oracle-事务', 'Oracle-事务', '<h1 id="h1-u4E8Bu52A1u652Fu6301"><a name="事务支持" class="reference-link"></a><span class="header-link octicon octicon-link"></span>事务支持</h1><p><strong>基本用法：</strong></p>
<pre><code class="lang-csharp">string connString = &quot;Your connection string&quot;;
using (OracleContext context = new OracleContext(new OracleConnectionFactory(connString)))
{
    try
    {
        context.Session.BeginTransaction();

        /* do some things here */
        context.Update(user);
        context.Delete&lt;User&gt;(a =&gt; a.Gender == null);

        context.Session.CommitTransaction();
    }
    catch
    {
        if (context.Session.IsInTransaction)
            context.Session.RollbackTransaction();
        throw;
    }
}
</code></pre>
', TO_DATE('2016-12-02 15:59:36', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-03 14:56:42', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 事务支持
**基本用法：**
```csharp
string connString = "Your connection string";
using (OracleContext context = new OracleContext(new OracleConnectionFactory(connString)))
{
    try
    {
        context.Session.BeginTransaction();

        /* do some things here */
        context.Update(user);
        context.Delete<User>(a => a.Gender == null);

        context.Session.CommitTransaction();
    }
    catch
    {
        if (context.Session.IsInTransaction)
            context.Session.RollbackTransaction();
        throw;
    }
}
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325150214624378880', 'Oracle-常用函数', 'Oracle-常用函数', 'Oracle-常用函数', '<h1 id="h1-u5E38u7528u51FDu6570"><a name="常用函数" class="reference-link"></a><span class="header-link octicon octicon-link"></span>常用函数</h1><p><strong>Chloe 对很多数据库函数支持很丰富，具体用法如下：</strong></p>
<pre><code class="lang-csharp">IQuery&lt;User&gt; q = context.Query&lt;User&gt;();

var space = new char[] { &#39; &#39; };

DateTime startTime = DateTime.Now;
DateTime endTime = startTime.AddDays(1);
var ret = q.Select(a =&gt; new
     {
         Id = a.Id,

         String_Length = (int?)a.Name.Length,//LENGTH(&quot;USERS&quot;.&quot;NAME&quot;)
         Substring = a.Name.Substring(0),//SUBSTR(&quot;USERS&quot;.&quot;NAME&quot;,0 + 1,LENGTH(&quot;USERS&quot;.&quot;NAME&quot;))
         Substring1 = a.Name.Substring(1),//SUBSTR(&quot;USERS&quot;.&quot;NAME&quot;,1 + 1,LENGTH(&quot;USERS&quot;.&quot;NAME&quot;))
         Substring1_2 = a.Name.Substring(1, 2),//SUBSTR(&quot;USERS&quot;.&quot;NAME&quot;,1 + 1,2)
         ToLower = a.Name.ToLower(),//LOWER(&quot;USERS&quot;.&quot;NAME&quot;)
         ToUpper = a.Name.ToUpper(),//UPPER(&quot;USERS&quot;.&quot;NAME&quot;)
         IsNullOrEmpty = string.IsNullOrEmpty(a.Name),//too long
         Contains = (bool?)a.Name.Contains(&quot;s&quot;),//
         Trim = a.Name.Trim(),//TRIM(&quot;USERS&quot;.&quot;NAME&quot;)
         TrimStart = a.Name.TrimStart(space),//LTRIM(&quot;USERS&quot;.&quot;NAME&quot;)
         TrimEnd = a.Name.TrimEnd(space),//RTRIM(&quot;USERS&quot;.&quot;NAME&quot;)
         StartsWith = (bool?)a.Name.StartsWith(&quot;s&quot;),//
         EndsWith = (bool?)a.Name.EndsWith(&quot;s&quot;),//

         /* oracle is not supported DbFunctions.Diffxx. */
         //DiffYears = DbFunctions.DiffYears(startTime, endTime),//
         //DiffMonths = DbFunctions.DiffMonths(startTime, endTime),//
         //DiffDays = DbFunctions.DiffDays(startTime, endTime),//
         //DiffHours = DbFunctions.DiffHours(startTime, endTime),//
         //DiffMinutes = DbFunctions.DiffMinutes(startTime, endTime),//
         //DiffSeconds = DbFunctions.DiffSeconds(startTime, endTime),//
         //DiffMilliseconds = DbFunctions.DiffMilliseconds(startTime, endTime),//
         //DiffMicroseconds = DbFunctions.DiffMicroseconds(startTime, endTime),//

         /* ((CAST(:P_0 AS DATE)-CAST(:P_1 AS DATE)) * 86400000 + CAST(TO_CHAR(CAST(:P_0 AS TIMESTAMP),&#39;ff3&#39;) AS NUMBER) - CAST(TO_CHAR(CAST(:P_1 AS TIMESTAMP),&#39;ff3&#39;) AS NUMBER)) / 86400000 */
         SubtractTotalDays = endTime.Subtract(startTime).TotalDays,//
         SubtractTotalHours = endTime.Subtract(startTime).TotalHours,//...
         SubtractTotalMinutes = endTime.Subtract(startTime).TotalMinutes,//...
         SubtractTotalSeconds = endTime.Subtract(startTime).TotalSeconds,//...
         SubtractTotalMilliseconds = endTime.Subtract(startTime).TotalMilliseconds,//...

         AddYears = startTime.AddYears(1),//ADD_MONTHS(:P_0,12 * 1)
         AddMonths = startTime.AddMonths(1),//ADD_MONTHS(:P_0,1)
         AddDays = startTime.AddDays(1),//(:P_0 + 1)
         AddHours = startTime.AddHours(1),//(:P_0 + NUMTODSINTERVAL(1,&#39;HOUR&#39;))
         AddMinutes = startTime.AddMinutes(2),//(:P_0 + NUMTODSINTERVAL(2,&#39;MINUTE&#39;))
         AddSeconds = startTime.AddSeconds(120),//(:P_0 + NUMTODSINTERVAL(120,&#39;SECOND&#39;))
         //AddMilliseconds = startTime.AddMilliseconds(20000),//不支持

         Now = DateTime.Now,//SYSTIMESTAMP
         UtcNow = DateTime.UtcNow,//SYS_EXTRACT_UTC(SYSTIMESTAMP)
         Today = DateTime.Today,//TRUNC(SYSDATE,&#39;DD&#39;)
         Date = DateTime.Now.Date,//TRUNC(SYSTIMESTAMP,&#39;DD&#39;)
         Year = DateTime.Now.Year,//CAST(TO_CHAR(SYSTIMESTAMP,&#39;yyyy&#39;) AS NUMBER)
         Month = DateTime.Now.Month,//CAST(TO_CHAR(SYSTIMESTAMP,&#39;mm&#39;) AS NUMBER)
         Day = DateTime.Now.Day,//CAST(TO_CHAR(SYSTIMESTAMP,&#39;dd&#39;) AS NUMBER)
         Hour = DateTime.Now.Hour,//CAST(TO_CHAR(SYSTIMESTAMP,&#39;hh24&#39;) AS NUMBER)
         Minute = DateTime.Now.Minute,//CAST(TO_CHAR(SYSTIMESTAMP,&#39;mi&#39;) AS NUMBER)
         Second = DateTime.Now.Second,//CAST(TO_CHAR(SYSTIMESTAMP,&#39;ss&#39;) AS NUMBER)
         Millisecond = DateTime.Now.Millisecond,//CAST(TO_CHAR(SYSTIMESTAMP,&#39;ff3&#39;) AS NUMBER)
         DayOfWeek = DateTime.Now.DayOfWeek,//(CAST(TO_CHAR(SYSTIMESTAMP,&#39;D&#39;) AS NUMBER) - 1)

         Int_Parse = int.Parse(&quot;1&quot;),//CAST(N&#39;1&#39; AS NUMBER)
         Int16_Parse = Int16.Parse(&quot;11&quot;),//CAST(N&#39;11&#39; AS NUMBER)
         Long_Parse = long.Parse(&quot;2&quot;),//CAST(N&#39;2&#39; AS NUMBER)
         Double_Parse = double.Parse(&quot;3&quot;),//CAST(N&#39;3&#39; AS BINARY_DOUBLE)
         Float_Parse = float.Parse(&quot;4&quot;),//CAST(N&#39;4&#39; AS BINARY_FLOAT)
         Decimal_Parse = decimal.Parse(&quot;5&quot;),//CAST(N&#39;5&#39; AS NUMBER)
         //Guid_Parse = Guid.Parse(&quot;D544BC4C-739E-4CD3-A3D3-7BF803FCE179&quot;),//不支持

         Bool_Parse = bool.Parse(&quot;1&quot;),//
         DateTime_Parse = DateTime.Parse(&quot;1992-1-16&quot;),//TO_TIMESTAMP(N&#39;1992-1-16&#39;,&#39;yyyy-mm-dd hh24:mi:ssxff&#39;)

         B = a.Age == null ? false : a.Age &gt; 1,
     }).ToList();
</code></pre>
<p>上述的函数可以用于 Select 方法，亦可用在 Where 或其它方法的 lambda 表达式树中，最终都会翻译成数据库函数。</p>
', TO_DATE('2016-12-02 15:59:50', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-03 14:57:49', 'YYYY-MM-DD HH24:MI:SS'), '0', null, null);
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325155467776229376', 'SQLite-实体特性', 'SQLite-实体特性', 'SQLite-实体特性', '<h1 id="h1-u5B9Eu4F53u7279u6027"><a name="实体特性" class="reference-link"></a><span class="header-link octicon octicon-link"></span>实体特性</h1><p>实体特性位于命名空间 Chloe.Entity 下。<br><strong>TableAttribute：</strong><br>Name：映射的表名。<br>实体对应的表默认是实体类名，如实体类型名与表名不一致，可通过该特性指定映射的表名。</p>
<pre><code class="lang-csharp">public class TableAttribute : Attribute
{
    public TableAttribute() { }
    public TableAttribute(string name)
    {
        Name = name;
    }
    public string Name { get; set; }
}
</code></pre>
<p><strong>ColumnAttribute：</strong><br>Name：映射的列名，如不指定，则默认使用属性名。<br>IsPrimaryKey：指示列是否为主键，默认为 false。<br>当一个实体没显示指定主键的时候，Chloe 默认选择名为 Id 的属性（如果存在）作为主键列，与此同时，如果该实体也没有显示指定任何自增列并且 Id 属性为 Int16、Int32 或者 Int64 类型，则也会默认其为自增列。</p>
<pre><code class="lang-csharp">public class ColumnAttribute : Attribute
{
    public ColumnAttribute() { }
    public ColumnAttribute(string name)
    {
        this.Name = name;
    }
    public string Name { get; set; }
    public bool IsPrimaryKey { get; set; }
}
</code></pre>
<p><strong>AutoIncrementAttribute：</strong><br>标记属性为自增列。在 SqlServer 中，一个实体不能指定多个自增列，否则会报异常提示。</p>
<pre><code class="lang-csharp">public class AutoIncrementAttribute : Attribute
{
}
</code></pre>
<p><strong>NonAutoIncrementAttribute：</strong><br>标记属性为非自增列。</p>
<pre><code class="lang-csharp">public class NonAutoIncrementAttribute : Attribute
{
}
</code></pre>
<p><strong>NotMappedAttribute：</strong><br>指示属性不映射任何列。</p>
<pre><code class="lang-csharp">public class NotMappedAttribute : Attribute
{
}
</code></pre>
', TO_DATE('2016-12-02 16:20:42', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-03 15:00:07', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 实体特性
实体特性位于命名空间 Chloe.Entity 下。
**TableAttribute：**
Name：映射的表名。
实体对应的表默认是实体类名，如实体类型名与表名不一致，可通过该特性指定映射的表名。
```csharp
public class TableAttribute : Attribute
{
    public TableAttribute() { }
    public TableAttribute(string name)
    {
        Name = name;
    }
    public string Name { get; set; }
}
```
**ColumnAttribute：**
Name：映射的列名，如不指定，则默认使用属性名。
IsPrimaryKey：指示列是否为主键，默认为 false。
当一个实体没显示指定主键的时候，Chloe 默认选择名为 Id 的属性（如果存在）作为主键列，与此同时，如果该实体也没有显示指定任何自增列并且 Id 属性为 Int16、Int32 或者 Int64 类型，则也会默认其为自增列。
```csharp
public class ColumnAttribute : Attribute
{
    public ColumnAttribute() { }
    public ColumnAttribute(string name)
    {
        this.Name = name;
    }
    public string Name { get; set; }
    public bool IsPrimaryKey { get; set; }
}
```
**AutoIncrementAttribute：**
标记属性为自增列。在 SqlServer 中，一个实体不能指定多个自增列，否则会报异常提示。
```csharp
public class AutoIncrementAttribute : Attribute
{
}
```
**NonAutoIncrementAttribute：**
标记属性为非自增列。
```csharp
public class NonAutoIncrementAttribute : Attribute
{
}
```
**NotMappedAttribute：**
指示属性不映射任何列。
```csharp
public class NotMappedAttribute : Attribute
{
}
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325155511531208704', 'SQLite-实体定义', 'SQLite-实体定义', 'SQLite-实体定义', '<h1 id="h1-u5B9Eu4F53u5B9Au4E49"><a name="实体定义" class="reference-link"></a><span class="header-link octicon octicon-link"></span>实体定义</h1><p>实体为纯 POCO，支持可空类型以及枚举类型映射。</p>
<pre><code class="lang-csharp">public enum Gender
{
    Man = 1,
    Woman
}
</code></pre>
<pre><code class="lang-csharp">[TableAttribute(&quot;Users&quot;)]
public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public Gender? Gender { get; set; }
    public int? Age { get; set; }
    public int? CityId { get; set; }
    public DateTime? OpTime { get; set; }
}
</code></pre>
<pre><code class="lang-csharp">public class City
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int ProvinceId { get; set; }
}
</code></pre>
<pre><code class="lang-csharp">public class Province
{
    public int Id { get; set; }
    public string Name { get; set; }
}
</code></pre>
', TO_DATE('2016-12-02 16:20:53', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-03 15:00:24', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 实体定义
实体为纯 POCO，支持可空类型以及枚举类型映射。
```csharp
public enum Gender
{
    Man = 1,
    Woman
}
```
```csharp
[TableAttribute("Users")]
public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public Gender? Gender { get; set; }
    public int? Age { get; set; }
    public int? CityId { get; set; }
    public DateTime? OpTime { get; set; }
}
```
```csharp
public class City
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int ProvinceId { get; set; }
}
```
```csharp
public class Province
{
    public int Id { get; set; }
    public string Name { get; set; }
}
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325155568988979200', 'SQLite-创建DbContext', 'SQLite-创建DbContext', 'SQLite-创建DbContext', '<h1 id="h1--dbcontext"><a name="创建 DbContext" class="reference-link"></a><span class="header-link octicon octicon-link"></span>创建 DbContext</h1><p>对于 SQLite 数据库，需要引用程序集 Chloe.dll 和 Chloe.SQLite.dll，然后使用 Chloe.SQLite.SQLiteContext 创建上下文实例。<br>因为框架本身需要与具体的数据库驱动解耦，所以 SQLiteContext 构造函数需要一个 IDbConnectionFactory 的参数，IDbConnectionFactory 接口只有一个 CreateConnection() 方法，必须先建个类，实现 CreateConnection 方法。</p>
<pre><code class="lang-csharp">public class SQLiteConnectionFactory : IDbConnectionFactory
{
    string _connString = null;
    public SQLiteConnectionFactory(string connString)
    {
        this._connString = connString;
    }
    public IDbConnection CreateConnection()
    {
        SQLiteConnection conn = new SQLiteConnection(this._connString);
        return conn;
    }
}
</code></pre>
<p>接下来就可以创建 SQLiteContext：</p>
<pre><code class="lang-csharp">string connString = &quot;Your connection string&quot;;
SQLiteContext context = new SQLiteContext(new SQLiteConnectionFactory(connString));
</code></pre>
', TO_DATE('2016-12-02 16:21:07', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-03 15:01:53', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 创建 DbContext
对于 SQLite 数据库，需要引用程序集 Chloe.dll 和 Chloe.SQLite.dll，然后使用 Chloe.SQLite.SQLiteContext 创建上下文实例。
因为框架本身需要与具体的数据库驱动解耦，所以 SQLiteContext 构造函数需要一个 IDbConnectionFactory 的参数，IDbConnectionFactory 接口只有一个 CreateConnection() 方法，必须先建个类，实现 CreateConnection 方法。
```csharp
public class SQLiteConnectionFactory : IDbConnectionFactory
{
    string _connString = null;
    public SQLiteConnectionFactory(string connString)
    {
        this._connString = connString;
    }
    public IDbConnection CreateConnection()
    {
        SQLiteConnection conn = new SQLiteConnection(this._connString);
        return conn;
    }
}
```
接下来就可以创建 SQLiteContext：
```csharp
string connString = "Your connection string";
SQLiteContext context = new SQLiteContext(new SQLiteConnectionFactory(connString));
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325155613347938304', 'SQLite-基本查询', 'SQLite-基本查询', 'SQLite-基本查询', '<h1 id="h1-u57FAu672Cu67E5u8BE2"><a name="基本查询" class="reference-link"></a><span class="header-link octicon octicon-link"></span>基本查询</h1><p><strong>根据 Id 查询出一个 User 对象：</strong></p>
<pre><code class="lang-csharp">string connString = &quot;Your connection string&quot;;
SQLiteContext context = new SQLiteContext(new SQLiteConnectionFactory(connString));
IQuery&lt;User&gt; q = context.Query&lt;User&gt;();

q.Where(a =&gt; a.Id == 1).FirstOrDefault();
/*
 *生成的 sql：
 * SELECT [Users].[Id] AS [Id],[Users].[Name] AS [Name],[Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime] 
   FROM [Users] AS [Users] 
   WHERE [Users].[Id] = 1 
   LIMIT 1 OFFSET 0
 */
</code></pre>
<p><strong>in 查询：</strong></p>
<pre><code class="lang-csharp">List&lt;int&gt; ids = new List&lt;int&gt;() { 1, 2, 3 };
q.Where(a =&gt; ids.Contains(a.Id)).ToList();
/*
 * Int32 @P_0 = 1;
   Int32 @P_1 = 2;
   Int32 @P_2 = 3;
   SELECT [Users].[Id] AS [Id],[Users].[Name] AS [Name],[Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime] 
   FROM [Users] AS [Users] 
   WHERE [Users].[Id] IN (@P_0,@P_1,@P_2)
 */
</code></pre>
<p><strong>可以选取指定的字段，返回一个匿名类型：</strong></p>
<pre><code class="lang-csharp">q.Where(a =&gt; a.Id == 1).Select(a =&gt; new { a.Id, a.Name }).FirstOrDefault();
/*
 * 只会生成包含 Id 和 Name 两个字段的 sql 语句：
 * SELECT [Users].[Id] AS [Id],[Users].[Name] AS [Name] 
   FROM [Users] AS [Users] 
   WHERE [Users].[Id] = 1 
   LIMIT 1 OFFSET 0
 */
</code></pre>
<p><strong>排序：</strong></p>
<pre><code class="lang-csharp">q.Where(a =&gt; a.Id &gt; 0).OrderBy(a =&gt; a.Age).ThenBy(a =&gt; a.Id).ToList();
/*
 * SELECT [Users].[Id] AS [Id],[Users].[Name] AS [Name],[Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime] 
   FROM [Users] AS [Users] 
   WHERE [Users].[Id] &gt; 0 
   ORDER BY [Users].[Age] ASC,[Users].[Id] ASC
 */
</code></pre>
<p><strong>分页：</strong></p>
<pre><code class="lang-csharp">q.Where(a =&gt; a.Id &gt; 0).OrderBy(a =&gt; a.Age).TakePage(1, 20).ToList();
/*
 * SELECT [Users].[Id] AS [Id],[Users].[Name] AS [Name],[Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime] 
   FROM [Users] AS [Users] 
   WHERE [Users].[Id] &gt; 0 
   ORDER BY [Users].[Age] ASC 
   LIMIT 20 OFFSET 0
 */
</code></pre>
', TO_DATE('2016-12-02 16:21:17', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-08 11:32:48', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 基本查询
**根据 Id 查询出一个 User 对象：**
```csharp
string connString = "Your connection string";
SQLiteContext context = new SQLiteContext(new SQLiteConnectionFactory(connString));
IQuery<User> q = context.Query<User>();

q.Where(a => a.Id == 1).FirstOrDefault();
/*
 *生成的 sql：
 * SELECT [Users].[Id] AS [Id],[Users].[Name] AS [Name],[Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime] 
   FROM [Users] AS [Users] 
   WHERE [Users].[Id] = 1 
   LIMIT 1 OFFSET 0
 */
```
**in 查询：**
```csharp
List<int> ids = new List<int>() { 1, 2, 3 };
q.Where(a => ids.Contains(a.Id)).ToList();
/*
 * Int32 @P_0 = 1;
   Int32 @P_1 = 2;
   Int32 @P_2 = 3;
   SELECT [Users].[Id] AS [Id],[Users].[Name] AS [Name],[Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime] 
   FROM [Users] AS [Users] 
   WHERE [Users].[Id] IN (@P_0,@P_1,@P_2)
 */
```
**可以选取指定的字段，返回一个匿名类型：**
```csharp
q.Where(a => a.Id == 1).Select(a => new { a.Id, a.Name }).FirstOrDefault();
/*
 * 只会生成包含 Id 和 Name 两个字段的 sql 语句：
 * SELECT [Users].[Id] AS [Id],[Users].[Name] AS [Name] 
   FROM [Users] AS [Users] 
   WHERE [Users].[Id] = 1 
   LIMIT 1 OFFSET 0
 */
```
**排序：**
```csharp
q.Where(a => a.Id > 0).OrderBy(a => a.Age).ThenBy(a => a.Id).ToList();
/*
 * SELECT [Users].[Id] AS [Id],[Users].[Name] AS [Name],[Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime] 
   FROM [Users] AS [Users] 
   WHERE [Users].[Id] > 0 
   ORDER BY [Users].[Age] ASC,[Users].[Id] ASC
 */
```
**分页：**
```csharp
q.Where(a => a.Id > 0).OrderBy(a => a.Age).TakePage(1, 20).ToList();
/*
 * SELECT [Users].[Id] AS [Id],[Users].[Name] AS [Name],[Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime] 
   FROM [Users] AS [Users] 
   WHERE [Users].[Id] > 0 
   ORDER BY [Users].[Age] ASC 
   LIMIT 20 OFFSET 0
 */
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325155661880229888', 'SQLite-连接查询', 'SQLite-连接查询', 'SQLite-连接查询', '<h1 id="h1-u8FDEu63A5u67E5u8BE2"><a name="连接查询" class="reference-link"></a><span class="header-link octicon octicon-link"></span>连接查询</h1><p>Chloe 友好支持多表连接查询，一切都可以用 lambda 表达式操作，返回类型可以是自定义类型，也可以是匿名类型。强类型开发，编译可见错误，容错率高。<br><strong>1.创建相关的 IQuery 对象：</strong></p>
<pre><code class="lang-csharp">IQuery&lt;User&gt; users = context.Query&lt;User&gt;();
IQuery&lt;City&gt; cities = context.Query&lt;City&gt;();
IQuery&lt;Province&gt; provinces = context.Query&lt;Province&gt;();
</code></pre>
<p><strong>2.建立连接：</strong></p>
<pre><code class="lang-csharp">/* User 表和 City 表 inner join，得到 IJoiningQuery&lt;User, City&gt; 对象 */
IJoiningQuery&lt;User, City&gt; user_city = users.InnerJoin(cities, (user, city) =&gt; user.CityId == city.Id);

/* City 表和 Province 表 inner join，得到 IJoiningQuery&lt;User, City, Province&gt; 对象 */
IJoiningQuery&lt;User, City, Province&gt; user_city_province = user_city.InnerJoin(provinces, (user, city, province) =&gt; city.ProvinceId == province.Id);
</code></pre>
<p><strong>3.得到最终的 IJoiningQuery 对象，就可以 Select 所需要的数据返回一个 IQuery 对象，然后就可以进行 Where、OrderBy、GroupBy、分页、聚合查询等操作：</strong><br>查出一个用户及其隶属的城市和省份的所有信息：</p>
<pre><code class="lang-csharp">/* 调用 Select 方法返回一个泛型为包含 User、City、Province 匿名类型的 IQuery 对象。
 * Select 方法也可以返回自定义类型 。
 */
var qq = user_city_province.Select((user, city, province) =&gt; new
{
    User = user,
    City = city,
    Province = province
});

/* 根据条件筛选，然后调用 ToList 就会返回一个泛型为 new { User = user, City = city, Province = province } 的 List 集合 */
var result = qq.Where(a =&gt; a.User.Id == 1).ToList();

/*
 * 生成的 sql：
 * SELECT [Users].[Id] AS [Id],[Users].[Name] AS [Name],[Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime],[City].[Id] AS [Id0],[City].[Name] AS [Name0],[City].[ProvinceId] AS [ProvinceId],[Province].[Id] AS [Id1],[Province].[Name] AS [Name1] 
   FROM [Users] AS [Users] 
   INNER JOIN [City] AS [City] ON [Users].[CityId] = [City].[Id] 
   INNER JOIN [Province] AS [Province] ON [City].[ProvinceId] = [Province].[Id] 
   WHERE [Users].[Id] = 1
 */
</code></pre>
<p>可以只获取指定的字段信息：</p>
<pre><code class="lang-csharp">user_city_province.Select((user, city, province) =&gt; new
{
    UserId = user.Id,
    UserName = user.Name,
    CityName = city.Name,
    ProvinceName = province.Name
}).Where(a =&gt; a.UserId == 1).ToList();

/*
 * 生成的 sql 只会包含 UserId、UserName、CityName、ProvinceName 四个字段
 * SELECT [Users].[Id] AS [UserId],[Users].[Name] AS [UserName],[City].[Name] AS [CityName],[Province].[Name] AS [ProvinceName] 
   FROM [Users] AS [Users] 
   INNER JOIN [City] AS [City] ON [Users].[CityId] = [City].[Id] 
   INNER JOIN [Province] AS [Province] ON [City].[ProvinceId] = [Province].[Id] 
   WHERE [Users].[Id] = 1
 */
</code></pre>
<p>框架亦支持左连接，用法和内连接相同。</p>
', TO_DATE('2016-12-02 16:21:29', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-03 15:07:58', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 连接查询
Chloe 友好支持多表连接查询，一切都可以用 lambda 表达式操作，返回类型可以是自定义类型，也可以是匿名类型。强类型开发，编译可见错误，容错率高。
**1.创建相关的 IQuery 对象：**
```csharp
IQuery<User> users = context.Query<User>();
IQuery<City> cities = context.Query<City>();
IQuery<Province> provinces = context.Query<Province>();
```
**2.建立连接：**
```csharp
/* User 表和 City 表 inner join，得到 IJoiningQuery<User, City> 对象 */
IJoiningQuery<User, City> user_city = users.InnerJoin(cities, (user, city) => user.CityId == city.Id);

/* City 表和 Province 表 inner join，得到 IJoiningQuery<User, City, Province> 对象 */
IJoiningQuery<User, City, Province> user_city_province = user_city.InnerJoin(provinces, (user, city, province) => city.ProvinceId == province.Id);
```
**3.得到最终的 IJoiningQuery 对象，就可以 Select 所需要的数据返回一个 IQuery 对象，然后就可以进行 Where、OrderBy、GroupBy、分页、聚合查询等操作：**
查出一个用户及其隶属的城市和省份的所有信息：
```csharp
/* 调用 Select 方法返回一个泛型为包含 User、City、Province 匿名类型的 IQuery 对象。
 * Select 方法也可以返回自定义类型 。
 */
var qq = user_city_province.Select((user, city, province) => new
{
    User = user,
    City = city,
    Province = province
});

/* 根据条件筛选，然后调用 ToList 就会返回一个泛型为 new { User = user, City = city, Province = province } 的 List 集合 */
var result = qq.Where(a => a.User.Id == 1).ToList();

/*
 * 生成的 sql：
 * SELECT [Users].[Id] AS [Id],[Users].[Name] AS [Name],[Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime],[City].[Id] AS [Id0],[City].[Name] AS [Name0],[City].[ProvinceId] AS [ProvinceId],[Province].[Id] AS [Id1],[Province].[Name] AS [Name1] 
   FROM [Users] AS [Users] 
   INNER JOIN [City] AS [City] ON [Users].[CityId] = [City].[Id] 
   INNER JOIN [Province] AS [Province] ON [City].[ProvinceId] = [Province].[Id] 
   WHERE [Users].[Id] = 1
 */
```
可以只获取指定的字段信息：
```csharp
user_city_province.Select((user, city, province) => new
{
    UserId = user.Id,
    UserName = user.Name,
    CityName = city.Name,
    ProvinceName = province.Name
}).Where(a => a.UserId == 1).ToList();

/*
 * 生成的 sql 只会包含 UserId、UserName、CityName、ProvinceName 四个字段
 * SELECT [Users].[Id] AS [UserId],[Users].[Name] AS [UserName],[City].[Name] AS [CityName],[Province].[Name] AS [ProvinceName] 
   FROM [Users] AS [Users] 
   INNER JOIN [City] AS [City] ON [Users].[CityId] = [City].[Id] 
   INNER JOIN [Province] AS [Province] ON [City].[ProvinceId] = [Province].[Id] 
   WHERE [Users].[Id] = 1
 */
```
框架亦支持左连接，用法和内连接相同。');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325155712383844352', 'SQLite-分组查询', 'SQLite-分组查询', 'SQLite-分组查询', '<h1 id="h1-u5206u7EC4u67E5u8BE2"><a name="分组查询" class="reference-link"></a><span class="header-link octicon octicon-link"></span>分组查询</h1><p>Chloe 支持分组查询以及分组后 Having 过滤和聚合查询。</p>
<pre><code class="lang-csharp">IQuery&lt;User&gt; q = context.Query&lt;User&gt;();

IGroupingQuery&lt;User&gt; g = q.Where(a =&gt; a.Id &gt; 0).GroupBy(a =&gt; a.Age);
g = g.Having(a =&gt; a.Age &gt; 1 &amp;&amp; AggregateFunctions.Count() &gt; 0);

g.Select(a =&gt; new
{
    a.Age,
    Count = AggregateFunctions.Count(),
    Sum = AggregateFunctions.Sum(a.Age),
    Max = AggregateFunctions.Max(a.Age),
    Min = AggregateFunctions.Min(a.Age),
    Avg = AggregateFunctions.Average(a.Age)
}).ToList();
/*
 * SELECT [Users].[Age] AS [Age],COUNT(1) AS [Count],CAST(SUM([Users].[Age]) AS INTEGER) AS [Sum],CAST(MAX([Users].[Age]) AS INTEGER) AS [Max],CAST(MIN([Users].[Age]) AS INTEGER) AS [Min],CAST(AVG([Users].[Age]) AS REAL) AS [Avg] 
   FROM [Users] AS [Users] WHERE [Users].[Id] &gt; 0 
   GROUP BY [Users].[Age] 
   HAVING ([Users].[Age] &gt; 1 AND COUNT(1) &gt; 0)
 */
</code></pre>
', TO_DATE('2016-12-02 16:21:41', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-03 15:08:44', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 分组查询
Chloe 支持分组查询以及分组后 Having 过滤和聚合查询。
```csharp
IQuery<User> q = context.Query<User>();

IGroupingQuery<User> g = q.Where(a => a.Id > 0).GroupBy(a => a.Age);
g = g.Having(a => a.Age > 1 && AggregateFunctions.Count() > 0);

g.Select(a => new
{
    a.Age,
    Count = AggregateFunctions.Count(),
    Sum = AggregateFunctions.Sum(a.Age),
    Max = AggregateFunctions.Max(a.Age),
    Min = AggregateFunctions.Min(a.Age),
    Avg = AggregateFunctions.Average(a.Age)
}).ToList();
/*
 * SELECT [Users].[Age] AS [Age],COUNT(1) AS [Count],CAST(SUM([Users].[Age]) AS INTEGER) AS [Sum],CAST(MAX([Users].[Age]) AS INTEGER) AS [Max],CAST(MIN([Users].[Age]) AS INTEGER) AS [Min],CAST(AVG([Users].[Age]) AS REAL) AS [Avg] 
   FROM [Users] AS [Users] WHERE [Users].[Id] > 0 
   GROUP BY [Users].[Age] 
   HAVING ([Users].[Age] > 1 AND COUNT(1) > 0)
 */
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325155763537575936', 'SQLite-聚合查询', 'SQLite-聚合查询', 'SQLite-聚合查询', '<h1 id="h1-u805Au5408u67E5u8BE2"><a name="聚合查询" class="reference-link"></a><span class="header-link octicon octicon-link"></span>聚合查询</h1><p>Chloe 可以像写 sql 一样实现聚合查询。</p>
<pre><code class="lang-csharp">IQuery&lt;User&gt; q = context.Query&lt;User&gt;();

q.Select(a =&gt; AggregateFunctions.Count()).First();
/*
 * SELECT COUNT(1) AS [C] FROM [Users] AS [Users] LIMIT 1 OFFSET 0
 */

/* 支持多个聚合函数 */
q.Select(a =&gt; new
{
    Count = AggregateFunctions.Count(),
    LongCount = AggregateFunctions.LongCount(),
    Sum = AggregateFunctions.Sum(a.Age),
    Max = AggregateFunctions.Max(a.Age),
    Min = AggregateFunctions.Min(a.Age),
    Average = AggregateFunctions.Average(a.Age)
}).First();
/*
 * SELECT COUNT(1) AS [Count],COUNT(1) AS [LongCount],CAST(SUM([Users].[Age]) AS INTEGER) AS [Sum],MAX([Users].[Age]) AS [Max],MIN([Users].[Age]) AS [Min],CAST(AVG([Users].[Age]) AS REAL) AS [Average] 
   FROM [Users] AS [Users] 
   LIMIT 1 OFFSET 0
 */

var count = q.Count();
/*
 * SELECT COUNT(1) AS [C] FROM [Users] AS [Users]
 */

var longCount = q.LongCount();
/*
 * SELECT COUNT(1) AS [C] FROM [Users] AS [Users]
 */

var sum = q.Sum(a =&gt; a.Age);
/*
 * SELECT CAST(SUM([Users].[Age]) AS INTEGER) AS [C] FROM [Users] AS [Users]
 */

var max = q.Max(a =&gt; a.Age);
/*
 * SELECT MAX([Users].[Age]) AS [C] FROM [Users] AS [Users]
 */

var min = q.Min(a =&gt; a.Age);
/*
 * SELECT MIN([Users].[Age]) AS [C] FROM [Users] AS [Users]
 */

var avg = q.Average(a =&gt; a.Age);
/*
 * SELECT CAST(AVG([Users].[Age]) AS REAL) AS [C] FROM [Users] AS [Users]
 */
</code></pre>
', TO_DATE('2016-12-02 16:21:53', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-03 15:09:42', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 聚合查询
Chloe 可以像写 sql 一样实现聚合查询。
```csharp
IQuery<User> q = context.Query<User>();

q.Select(a => AggregateFunctions.Count()).First();
/*
 * SELECT COUNT(1) AS [C] FROM [Users] AS [Users] LIMIT 1 OFFSET 0
 */

/* 支持多个聚合函数 */
q.Select(a => new
{
    Count = AggregateFunctions.Count(),
    LongCount = AggregateFunctions.LongCount(),
    Sum = AggregateFunctions.Sum(a.Age),
    Max = AggregateFunctions.Max(a.Age),
    Min = AggregateFunctions.Min(a.Age),
    Average = AggregateFunctions.Average(a.Age)
}).First();
/*
 * SELECT COUNT(1) AS [Count],COUNT(1) AS [LongCount],CAST(SUM([Users].[Age]) AS INTEGER) AS [Sum],MAX([Users].[Age]) AS [Max],MIN([Users].[Age]) AS [Min],CAST(AVG([Users].[Age]) AS REAL) AS [Average] 
   FROM [Users] AS [Users] 
   LIMIT 1 OFFSET 0
 */

var count = q.Count();
/*
 * SELECT COUNT(1) AS [C] FROM [Users] AS [Users]
 */

var longCount = q.LongCount();
/*
 * SELECT COUNT(1) AS [C] FROM [Users] AS [Users]
 */

var sum = q.Sum(a => a.Age);
/*
 * SELECT CAST(SUM([Users].[Age]) AS INTEGER) AS [C] FROM [Users] AS [Users]
 */

var max = q.Max(a => a.Age);
/*
 * SELECT MAX([Users].[Age]) AS [C] FROM [Users] AS [Users]
 */

var min = q.Min(a => a.Age);
/*
 * SELECT MIN([Users].[Age]) AS [C] FROM [Users] AS [Users]
 */

var avg = q.Average(a => a.Age);
/*
 * SELECT CAST(AVG([Users].[Age]) AS REAL) AS [C] FROM [Users] AS [Users]
 */
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325155811822403584', 'SQLite-Sql查询', 'SQLite-Sql查询', 'SQLite-Sql查询', '<h1 id="h1-sql-"><a name="Sql查询" class="reference-link"></a><span class="header-link octicon octicon-link"></span>Sql查询</h1><p>对于一些极其复杂的 sql 查询，还是得依赖原生 sql，因此，Chloe 提供了原生 sql 查询接口。<br><strong>获取满足条件的用户信息，将结果映射到 User 类上：</strong></p>
<pre><code class="lang-csharp">context.SqlQuery&lt;User&gt;(&quot;select * from Users where Age&gt;@age&quot;, new DbParam(&quot;@age&quot;, 18)).ToList();
</code></pre>
<p><strong>获取满足条件的用户 Id：</strong></p>
<pre><code class="lang-csharp">context.SqlQuery&lt;int&gt;(&quot;select Id from Users where Age&gt;@age&quot;, new DbParam(&quot;@age&quot;, 18)).ToList();
</code></pre>
<p><strong>支持存储过程：</strong></p>
<pre><code class="lang-csharp">context.SqlQuery&lt;User&gt;(&quot;Proc_Test&quot;, CommandType.StoredProcedure, new DbParam(&quot;@age&quot;, 18)).ToList();
</code></pre>
', TO_DATE('2016-12-02 16:22:04', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-03 15:10:32', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# Sql查询
对于一些极其复杂的 sql 查询，还是得依赖原生 sql，因此，Chloe 提供了原生 sql 查询接口。
**获取满足条件的用户信息，将结果映射到 User 类上：**
```csharp
context.SqlQuery<User>("select * from Users where Age>@age", new DbParam("@age", 18)).ToList();
```
**获取满足条件的用户 Id：**
```csharp
context.SqlQuery<int>("select Id from Users where Age>@age", new DbParam("@age", 18)).ToList();
```
**支持存储过程：**
```csharp
context.SqlQuery<User>("Proc_Test", CommandType.StoredProcedure, new DbParam("@age", 18)).ToList();
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325155856416243712', 'SQLite-插入数据', 'SQLite-插入数据', 'SQLite-插入数据', '<h1 id="h1-u63D2u5165u6570u636E"><a name="插入数据" class="reference-link"></a><span class="header-link octicon octicon-link"></span>插入数据</h1><p>Chloe 具备两种插入数据的方式。<br><strong>1.实体插入：</strong><br>该方式插入，如果一个实体存在自增列，会自动将自增列设置到相应的属性上。</p>
<pre><code class="lang-csharp">User user = new User();
user.Name = &quot;lu&quot;;
user.Age = 18;
user.Gender = Gender.Man;
user.CityId = 1;
user.OpTime = DateTime.Now;

/* 会自动将自增 Id 设置到 user 的 Id 属性上 */
user = context.Insert(user);
/*
 * String @P_0 = &#39;lu&#39;;
   Gender @P_1 = Man;
   Int32 @P_2 = 18;
   Int32 @P_3 = 1;
   DateTime @P_4 = &#39;2016/8/6 22:03:42&#39;;
   INSERT INTO [Users]([Name],[Gender],[Age],[CityId],[OpTime]) 
   VALUES(@P_0,@P_1,@P_2,@P_3,@P_4);SELECT LAST_INSERT_ROWID()
 */
</code></pre>
<p><strong>2.lambda 方式插入：</strong><br>此种方式插入的好处是，可以指定列插入，就像写 sql 一样简单。<br>同时，该方式插入返回表主键值。如果实体主键是自增列，返回值就会是自增值。</p>
<pre><code class="lang-csharp">/* 返回主键 Id */
int id = (int)context.Insert&lt;User&gt;(() =&gt; new User()
{
    Name = &quot;lu&quot;,
    Age = 18,
    Gender = Gender.Man,
    CityId = 1,
    OpTime = DateTime.Now
});
/*
 * INSERT INTO [Users]([Name],[Age],[Gender],[CityId],[OpTime]) 
   VALUES(&#39;lu&#39;,18,1,1,DATETIME(&#39;NOW&#39;,&#39;LOCALTIME&#39;));SELECT LAST_INSERT_ROWID()
 */
</code></pre>
', TO_DATE('2016-12-02 16:22:15', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-03 15:11:56', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 插入数据
Chloe 具备两种插入数据的方式。
**1.实体插入：**
该方式插入，如果一个实体存在自增列，会自动将自增列设置到相应的属性上。
```csharp
User user = new User();
user.Name = "lu";
user.Age = 18;
user.Gender = Gender.Man;
user.CityId = 1;
user.OpTime = DateTime.Now;

/* 会自动将自增 Id 设置到 user 的 Id 属性上 */
user = context.Insert(user);
/*
 * String @P_0 = ''lu'';
   Gender @P_1 = Man;
   Int32 @P_2 = 18;
   Int32 @P_3 = 1;
   DateTime @P_4 = ''2016/8/6 22:03:42'';
   INSERT INTO [Users]([Name],[Gender],[Age],[CityId],[OpTime]) 
   VALUES(@P_0,@P_1,@P_2,@P_3,@P_4);SELECT LAST_INSERT_ROWID()
 */
```
**2.lambda 方式插入：**
此种方式插入的好处是，可以指定列插入，就像写 sql 一样简单。
同时，该方式插入返回表主键值。如果实体主键是自增列，返回值就会是自增值。
```csharp
/* 返回主键 Id */
int id = (int)context.Insert<User>(() => new User()
{
    Name = "lu",
    Age = 18,
    Gender = Gender.Man,
    CityId = 1,
    OpTime = DateTime.Now
});
/*
 * INSERT INTO [Users]([Name],[Age],[Gender],[CityId],[OpTime]) 
   VALUES(''lu'',18,1,1,DATETIME(''NOW'',''LOCALTIME''));SELECT LAST_INSERT_ROWID()
 */
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325155899147812864', 'SQLite-更新数据', 'SQLite-更新数据', 'SQLite-更新数据', '<h1 id="h1-u66F4u65B0u6570u636E"><a name="更新数据" class="reference-link"></a><span class="header-link octicon octicon-link"></span>更新数据</h1><p>Chloe 支持两种数据更新方式。<br><strong>1.实体更新：</strong></p>
<pre><code class="lang-csharp">User user = new User();
user.Id = 1;
user.Name = &quot;lu&quot;;
user.Age = 28;
user.Gender = Gender.Man;
user.OpTime = DateTime.Now;

/* 更新所有映射的字段 */
context.Update(user);
/*
 * String @P_0 = &#39;lu&#39;;
   Gender @P_1 = Man;
   Int32 @P_2 = 28;
   Nullable&lt;Int32&gt; @P_3 = NULL;
   DateTime @P_4 = &#39;2016/8/6 22:05:02&#39;;
   Int32 @P_5 = 1;
   UPDATE [Users] SET [Name]=@P_0,[Gender]=@P_1,[Age]=@P_2,[CityId]=@P_3,[OpTime]=@P_4 
   WHERE [Users].[Id] = @P_5
 */
</code></pre>
<p>由于 user 对象未被上下文跟踪，这会使所有的映射列都会被更新。Chloe 也支持类似 EF 一样只更新被修改过的属性。</p>
<pre><code class="lang-csharp">/*
 * 支持只更新属性值已变的属性
 */

/* 在修改实体属性前让上下文跟踪实体 */
context.TrackEntity(user);

/* 然后再修改实体属性 */
user.Name = user.Name + &quot;1&quot;;

/* 然后调用 Update 方法，这时只会更新被修改过的属性 */
context.Update(user);
/*
 * String @P_0 = &#39;lu1&#39;;
   Int32 @P_1 = 1;
   UPDATE [Users] SET [Name]=@P_0 WHERE [Users].[Id] = @P_1
 */
</code></pre>
<p><strong>2.lambda 方式更新：</strong><br>该方式解决的问题是：1.指定列更新；2.批量更新；3.支持类似 Age=Age + 100 这样更新字段。用法如下：</p>
<pre><code class="lang-csharp">context.Update&lt;User&gt;(a =&gt; a.Age &gt; 18, a =&gt; new User()
{
    Name = a.Name,
    Age = a.Age + 100,
    Gender = Gender.Man,
    OpTime = DateTime.Now
});
/*
 * UPDATE [Users] SET [Name]=[Users].[Name],[Age]=([Users].[Age] + 100),[Gender]=1,[OpTime]=DATETIME(&#39;NOW&#39;,&#39;LOCALTIME&#39;) 
   WHERE [Users].[Id] &gt; 18
 */
</code></pre>
', TO_DATE('2016-12-02 16:22:25', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-03 15:13:36', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 更新数据
Chloe 支持两种数据更新方式。
**1.实体更新：**
```csharp
User user = new User();
user.Id = 1;
user.Name = "lu";
user.Age = 28;
user.Gender = Gender.Man;
user.OpTime = DateTime.Now;

/* 更新所有映射的字段 */
context.Update(user);
/*
 * String @P_0 = ''lu'';
   Gender @P_1 = Man;
   Int32 @P_2 = 28;
   Nullable<Int32> @P_3 = NULL;
   DateTime @P_4 = ''2016/8/6 22:05:02'';
   Int32 @P_5 = 1;
   UPDATE [Users] SET [Name]=@P_0,[Gender]=@P_1,[Age]=@P_2,[CityId]=@P_3,[OpTime]=@P_4 
   WHERE [Users].[Id] = @P_5
 */
```
由于 user 对象未被上下文跟踪，这会使所有的映射列都会被更新。Chloe 也支持类似 EF 一样只更新被修改过的属性。
```csharp
/*
 * 支持只更新属性值已变的属性
 */

/* 在修改实体属性前让上下文跟踪实体 */
context.TrackEntity(user);

/* 然后再修改实体属性 */
user.Name = user.Name + "1";

/* 然后调用 Update 方法，这时只会更新被修改过的属性 */
context.Update(user);
/*
 * String @P_0 = ''lu1'';
   Int32 @P_1 = 1;
   UPDATE [Users] SET [Name]=@P_0 WHERE [Users].[Id] = @P_1
 */
```
**2.lambda 方式更新：**
该方式解决的问题是：1.指定列更新；2.批量更新；3.支持类似 Age=Age + 100 这样更新字段。用法如下：
```csharp
context.Update<User>(a => a.Age > 18, a => new User()
{
    Name = a.Name,
    Age = a.Age + 100,
    Gender = Gender.Man,
    OpTime = DateTime.Now
});
/*
 * UPDATE [Users] SET [Name]=[Users].[Name],[Age]=([Users].[Age] + 100),[Gender]=1,[OpTime]=DATETIME(''NOW'',''LOCALTIME'') 
   WHERE [Users].[Id] > 18
 */
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325155947889819648', 'SQLite-删除数据', 'SQLite-删除数据', 'SQLite-删除数据', '<h1 id="h1-u5220u9664u6570u636E"><a name="删除数据" class="reference-link"></a><span class="header-link octicon octicon-link"></span>删除数据</h1><p>Chloe 支持两种数据删除方式。<br><strong>1.实体删除：</strong><br>该方式删除必须要求实体拥有一个主键，否则会报异常提示。</p>
<pre><code class="lang-csharp">User user = new User();
user.Id = 1;
context.Delete(user);
/*
 * Int32 @P_0 = 1;
   DELETE FROM [Users] WHERE [Users].[Id] = @P_0
 */
</code></pre>
<p><strong>2.lambda 方式删除：</strong><br>使用该方式可以删除单条数据，也可以删除多条数据。</p>
<pre><code class="lang-csharp">/* 删除单条数据 */
context.Delete&lt;User&gt;(a =&gt; a.Id == 1);
/*
 * DELETE FROM [Users] WHERE [Users].[Id] = 1
 */

/* 批量删除满足条件的数据 */
context.Delete&lt;User&gt;(a =&gt; a.Age &gt; 18);
/*
 * DELETE FROM [Users] WHERE [Users].[Age] &gt; 18
 */
</code></pre>
', TO_DATE('2016-12-02 16:22:37', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-03 15:15:01', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 删除数据
Chloe 支持两种数据删除方式。
**1.实体删除：**
该方式删除必须要求实体拥有一个主键，否则会报异常提示。
```csharp
User user = new User();
user.Id = 1;
context.Delete(user);
/*
 * Int32 @P_0 = 1;
   DELETE FROM [Users] WHERE [Users].[Id] = @P_0
 */
```
**2.lambda 方式删除：**
使用该方式可以删除单条数据，也可以删除多条数据。
```csharp
/* 删除单条数据 */
context.Delete<User>(a => a.Id == 1);
/*
 * DELETE FROM [Users] WHERE [Users].[Id] = 1
 */

/* 批量删除满足条件的数据 */
context.Delete<User>(a => a.Age > 18);
/*
 * DELETE FROM [Users] WHERE [Users].[Age] > 18
 */
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325155999823691776', 'SQLite-存储过程', 'SQLite-存储过程', 'SQLite-存储过程', '<p>SQLite 不支持存储过程。</p>
', TO_DATE('2016-12-02 16:22:49', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-03 15:16:06', 'YYYY-MM-DD HH24:MI:SS'), '0', null, 'SQLite 不支持存储过程。');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325156054349643776', 'SQLite-事务', 'SQLite-事务', 'SQLite-事务', '<h1 id="h1-u4E8Bu52A1u652Fu6301"><a name="事务支持" class="reference-link"></a><span class="header-link octicon octicon-link"></span>事务支持</h1><p><strong>基本用法：</strong></p>
<pre><code class="lang-csharp">string connString = &quot;Your connection string&quot;;
using (SQLiteContext context = new SQLiteContext(new SQLiteConnectionFactory(connString)))
{
    try
    {
        context.Session.BeginTransaction();

        /* do some things here */
        context.Update(user);
        context.Delete&lt;User&gt;(a =&gt; a.Gender == null);

        context.Session.CommitTransaction();
    }
    catch
    {
        if (context.Session.IsInTransaction)
            context.Session.RollbackTransaction();
        throw;
    }
}
</code></pre>
', TO_DATE('2016-12-02 16:23:02', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-03 15:15:43', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 事务支持
**基本用法：**
```csharp
string connString = "Your connection string";
using (SQLiteContext context = new SQLiteContext(new SQLiteConnectionFactory(connString)))
{
    try
    {
        context.Session.BeginTransaction();

        /* do some things here */
        context.Update(user);
        context.Delete<User>(a => a.Gender == null);

        context.Session.CommitTransaction();
    }
    catch
    {
        if (context.Session.IsInTransaction)
            context.Session.RollbackTransaction();
        throw;
    }
}
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325156110087749632', 'SQLite-常用函数', 'SQLite-常用函数', 'SQLite-常用函数', '<h1 id="h1-u5E38u7528u51FDu6570"><a name="常用函数" class="reference-link"></a><span class="header-link octicon octicon-link"></span>常用函数</h1><p><strong>Chloe 对很多数据库函数支持很丰富，具体用法如下：</strong></p>
<pre><code class="lang-csharp">IQuery&lt;User&gt; q = context.Query&lt;User&gt;();

var space = new char[] { &#39; &#39; };

DateTime startTime = DateTime.Now;
DateTime endTime = DateTime.Now.AddDays(1);

var ret = q.Select(a =&gt; new
{
    Id = a.Id,

    String_Length = (int?)a.Name.Length,//LENGTH([Users].[Name])
    Substring = a.Name.Substring(0),//SUBSTR([Users].[Name],0 + 1)
    Substring1 = a.Name.Substring(1),//SUBSTR([Users].[Name],1 + 1)
    Substring1_2 = a.Name.Substring(1, 2),//SUBSTR([Users].[Name],1 + 1,2)
    ToLower = a.Name.ToLower(),//LOWER([Users].[Name])
    ToUpper = a.Name.ToUpper(),//UPPER([Users].[Name])
    IsNullOrEmpty = string.IsNullOrEmpty(a.Name),//CASE WHEN ([Users].[Name] IS NULL OR [Users].[Name] = &#39;&#39;) THEN 1 ELSE 0 END = 1
    Contains = (bool?)a.Name.Contains(&quot;s&quot;),//[Users].[Name] LIKE &#39;%&#39; || &#39;s&#39; || &#39;%&#39;
    StartsWith = (bool?)a.Name.StartsWith(&quot;s&quot;),//[Users].[Name] LIKE &#39;s&#39; || &#39;%&#39;
    EndsWith = (bool?)a.Name.EndsWith(&quot;s&quot;),//[Users].[Name] LIKE &#39;%&#39; || &#39;s&#39;
    Trim = a.Name.Trim(),//TRIM([Users].[Name])
    TrimStart = a.Name.TrimStart(space),//LTRIM([Users].[Name])
    TrimEnd = a.Name.TrimEnd(space),//RTRIM([Users].[Name])

    DiffYears = DbFunctions.DiffYears(startTime, endTime),//(CAST(STRFTIME(&#39;%Y&#39;,@P_0) AS INTEGER) - CAST(STRFTIME(&#39;%Y&#39;,@P_1) AS INTEGER))
    DiffMonths = DbFunctions.DiffMonths(startTime, endTime),//((CAST(STRFTIME(&#39;%Y&#39;,@P_0) AS INTEGER) - CAST(STRFTIME(&#39;%Y&#39;,@P_1) AS INTEGER)) * 12 + (CAST(STRFTIME(&#39;%m&#39;,@P_0) AS INTEGER) - CAST(STRFTIME(&#39;%m&#39;,@P_1) AS INTEGER)))
    DiffDays = DbFunctions.DiffDays(startTime, endTime),//CAST((JULIANDAY(@P_0) - JULIANDAY(@P_1)) AS INTEGER)
    DiffHours = DbFunctions.DiffHours(startTime, endTime),//CAST((JULIANDAY(@P_0) - JULIANDAY(@P_1)) * 24 AS INTEGER)
    DiffMinutes = DbFunctions.DiffMinutes(startTime, endTime),//CAST((JULIANDAY(@P_0) - JULIANDAY(@P_1)) * 1440 AS INTEGER)
    DiffSeconds = DbFunctions.DiffSeconds(startTime, endTime),//CAST((JULIANDAY(@P_0) - JULIANDAY(@P_1)) * 86400 AS INTEGER)
    //DiffMilliseconds = DbFunctions.DiffMilliseconds(startTime, endTime),//不支持 Millisecond
    //DiffMicroseconds = DbFunctions.DiffMicroseconds(startTime, endTime),//不支持 Microseconds

    AddYears = startTime.AddYears(1),//DATETIME(@P_0,&#39;+&#39; || 1 || &#39; years&#39;)
    AddMonths = startTime.AddMonths(1),//DATETIME(@P_0,&#39;+&#39; || 1 || &#39; months&#39;)
    AddDays = startTime.AddDays(1),//DATETIME(@P_0,&#39;+&#39; || 1 || &#39; days&#39;)
    AddHours = startTime.AddHours(1),//DATETIME(@P_0,&#39;+&#39; || 1 || &#39; hours&#39;)
    AddMinutes = startTime.AddMinutes(2),//DATETIME(@P_0,&#39;+&#39; || 2 || &#39; minutes&#39;)
    AddSeconds = startTime.AddSeconds(120),//DATETIME(@P_0,&#39;+&#39; || 120 || &#39; seconds&#39;)
    //AddMilliseconds = startTime.AddMilliseconds(2000),//不支持

    Now = DateTime.Now,//DATETIME(&#39;NOW&#39;,&#39;LOCALTIME&#39;)
    UtcNow = DateTime.UtcNow,//DATETIME()
    Today = DateTime.Today,//DATE(&#39;NOW&#39;,&#39;LOCALTIME&#39;)
    Date = DateTime.Now.Date,//DATE(&#39;NOW&#39;,&#39;LOCALTIME&#39;)
    Year = DateTime.Now.Year,//CAST(STRFTIME(&#39;%Y&#39;,DATETIME(&#39;NOW&#39;,&#39;LOCALTIME&#39;)) AS INTEGER)
    Month = DateTime.Now.Month,//CAST(STRFTIME(&#39;%m&#39;,DATETIME(&#39;NOW&#39;,&#39;LOCALTIME&#39;)) AS INTEGER)
    Day = DateTime.Now.Day,//CAST(STRFTIME(&#39;%d&#39;,DATETIME(&#39;NOW&#39;,&#39;LOCALTIME&#39;)) AS INTEGER)
    Hour = DateTime.Now.Hour,//CAST(STRFTIME(&#39;%H&#39;,DATETIME(&#39;NOW&#39;,&#39;LOCALTIME&#39;)) AS INTEGER)
    Minute = DateTime.Now.Minute,//CAST(STRFTIME(&#39;%M&#39;,DATETIME(&#39;NOW&#39;,&#39;LOCALTIME&#39;)) AS INTEGER)
    Second = DateTime.Now.Second,//CAST(STRFTIME(&#39;%S&#39;,DATETIME(&#39;NOW&#39;,&#39;LOCALTIME&#39;)) AS INTEGER)
    Millisecond = DateTime.Now.Millisecond,//@P_2 直接计算 DateTime.Now.Millisecond 的值 
    DayOfWeek = DateTime.Now.DayOfWeek,//CAST(STRFTIME(&#39;%w&#39;,DATETIME(&#39;NOW&#39;,&#39;LOCALTIME&#39;)) AS INTEGER)

    Byte_Parse = byte.Parse(&quot;1&quot;),//CAST(&#39;1&#39; AS INTEGER)
    Int_Parse = int.Parse(&quot;1&quot;),//CAST(&#39;1&#39; AS INTEGER)
    Int16_Parse = Int16.Parse(&quot;11&quot;),//CAST(&#39;11&#39; AS INTEGER)
    Long_Parse = long.Parse(&quot;2&quot;),//CAST(&#39;2&#39; AS INTEGER)
    Double_Parse = double.Parse(&quot;3.1&quot;),//CAST(&#39;3.1&#39; AS REAL)
    Float_Parse = float.Parse(&quot;4.1&quot;),//CAST(&#39;4.1&#39; AS REAL)
    //Decimal_Parse = decimal.Parse(&quot;5&quot;),//不支持
    //Guid_Parse = Guid.Parse(&quot;D544BC4C-739E-4CD3-A3D3-7BF803FCE179&quot;),//不支持 &#39;D544BC4C-739E-4CD3-A3D3-7BF803FCE179&#39;

    Bool_Parse = bool.Parse(&quot;1&quot;),//CAST(&#39;1&#39; AS INTEGER)
    DateTime_Parse = DateTime.Parse(&quot;2014-01-01&quot;),//DATETIME(&#39;2014-01-01&#39;)
}).ToList();
</code></pre>
<p>上述的函数可以用于 Select 方法，亦可用在 Where 或其它方法的 lambda 表达式树中，最终都会翻译成数据库函数。</p>
', TO_DATE('2016-12-02 16:23:16', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-03 15:16:51', 'YYYY-MM-DD HH24:MI:SS'), '0', null, null);
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325175022200291328', 'Chloe.ORM-更新记录', 'Chloe.ORM-更新记录', 'Chloe.ORM-更新记录', '<ul>
<li><strong>2016-12-10</strong><ul>
<li>修改内容：如果一个继承属性出现在IQuery.Select 方法的lambda中，会出现空引用异常，现已修复</li><li>版本更新至 2.1.2</li></ul>
</li><li><strong>2016-12-7</strong><ul>
<li>修改内容：InternalDbSession 中的 IDbCommand 是单例可重用的，所以，每次调用 PrepareCommand 方法时需要清掉上次执行的残留参数，即执行 cmd.Parameters.Clear()（主要防止以下“特俗”情况：当执行 sql 过程出现异常，会来不及调用 cmd.Parameters.Clear()，就会出现残留的参数，为了保证每次使用 IDbCommand 不受上次异常情况下的影响，所以得清除一下上次残留的参数）</li><li>版本更新至 2.1.1</li></ul>
</li><li><p><strong>2016-12-4</strong></p>
<ul>
<li>支持 Oracle 数据库</li><li>实体支持继承</li><li>支持存储过程</li><li>重命名：NotAutoIncrementAttribute —&gt; NonAutoIncrementAttribute</li><li>废弃 DbContext.CurrentSession 属性，取而代之 DbContext.Session</li><li>IQuery 接口增加 TakePage 方法</li><li>内部代码结构调整</li><li>版本升级至 2.1.0</li></ul>
</li><li><p><strong>2016-8-26</strong></p>
<ul>
<li>版本升级至 2.0.0</li><li>发布 ChloeCore.MySql NuGet 包</li></ul>
</li><li><p><strong>2016-8-8</strong></p>
<ul>
<li>支持 SQLite 数据库</li><li>.NET Ver update: 1.0.2</li><li>.NET Core Ver update: 1.0.4</li></ul>
</li><li><p><strong>2016-8-1</strong></p>
<ul>
<li>支持 .NET Core</li><li>发行 NuGet 包<ul>
<li>.NET Ver: 1.0.1</li><li>.NET Core Ver: 1.0.3</li></ul>
</li></ul>
</li><li><p><strong>2016-7-25</strong></p>
<ul>
<li>支持 MySql 数据库</li></ul>
</li><li><p><strong>2016-7-4</strong></p>
<ul>
<li>正式开源</li></ul>
</li></ul>
', TO_DATE('2016-12-02 17:38:25', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-10 10:56:21', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '* **2016-12-10**
	* 修改内容：如果一个继承属性出现在IQuery.Select 方法的lambda中，会出现空引用异常，现已修复
	* 版本更新至 2.1.2
* **2016-12-7**
	* 修改内容：InternalDbSession 中的 IDbCommand 是单例可重用的，所以，每次调用 PrepareCommand 方法时需要清掉上次执行的残留参数，即执行 cmd.Parameters.Clear()（主要防止以下“特俗”情况：当执行 sql 过程出现异常，会来不及调用 cmd.Parameters.Clear()，就会出现残留的参数，为了保证每次使用 IDbCommand 不受上次异常情况下的影响，所以得清除一下上次残留的参数）
	* 版本更新至 2.1.1
* **2016-12-4**
	* 支持 Oracle 数据库
	* 实体支持继承
	* 支持存储过程
	* 重命名：NotAutoIncrementAttribute --> NonAutoIncrementAttribute
	* 废弃 DbContext.CurrentSession 属性，取而代之 DbContext.Session
	* IQuery 接口增加 TakePage 方法
	* 内部代码结构调整
	* 版本升级至 2.1.0

* **2016-8-26**
	* 版本升级至 2.0.0
	* 发布 ChloeCore.MySql NuGet 包

* **2016-8-8**
	* 支持 SQLite 数据库
	* .NET Ver update: 1.0.2
	* .NET Core Ver update: 1.0.4

* **2016-8-1**
	* 支持 .NET Core
    * 发行 NuGet 包
      * .NET Ver: 1.0.1
      * .NET Core Ver: 1.0.3

* **2016-7-25**
    * 支持 MySql 数据库

* **2016-7-4**
	* 正式开源
');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325507078541279232', '使用进阶-复杂查询', '使用进阶-复杂查询', '使用进阶-复杂查询', '<h1 id="h1-u590Du6742u67E5u8BE2"><a name="复杂查询" class="reference-link"></a><span class="header-link octicon octicon-link"></span>复杂查询</h1><p>IQuery&lt;T&gt; 接口支持多表连接查询、聚合查询、分组查询，这几个接口配合使用可以让我们开发达到事半功倍的效果。对于一般的复杂查询，Chloe 还是游刃有余的。<br><strong>example 1：</strong><br>达到一般的 in 子查询效果，比如如下 sql：</p>
<pre><code class="lang-csharp">string sql = &quot;select Users.* from Users where Users.Id in(select id from City where City.Name LIKE &#39;%&#39; + N&#39;北京&#39; + &#39;%&#39;)&quot;;
</code></pre>
<p>Chloe 无需拼接字符串就可以做到：</p>
<pre><code class="lang-csharp">var userQuery = context.Query&lt;User&gt;();

var cityIdsQuery = context.Query&lt;City&gt;().Where(a =&gt; a.Name.Contains(&quot;北京&quot;)).Select(a =&gt; a.Id);

/* 建立连接 */
var view = userQuery.InnerJoin(cityIdsQuery, (user, cityId) =&gt; user.CityId == cityId).Select((user, cityId) =&gt; user);

/* 执行查询 */
List&lt;User&gt; userList = view.ToList();

/*
 * 生成的 sql：
 * SELECT [Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime],[Users].[Id] AS [Id],[Users].[Name] AS [Name] 
   FROM [Users] AS [Users] 
   INNER JOIN 
   (SELECT [City].[Id] AS [C] FROM [City] AS [City] WHERE [City].[Name] LIKE &#39;%&#39; + N&#39;北京&#39; + &#39;%&#39;) AS [T] 
   ON [Users].[CityId] = [T].[C]
 */
</code></pre>
<p><strong>example 2：连接、分组、聚合查询结合</strong><br>现有 Users 表、City 表，他们的关系是一个 User 隶属一个 City，一个 City 有多个用户。假设，现在有需求要查出 City 的信息，<strong>同时也要把该 City 下用户最小的年龄输出</strong>，如果用原生 sql 写的话大概是：</p>
<pre><code class="lang-sql">select City.*,T.MinAge from City left join (select CityId,Min(Users.Age) as MinAge 
from Users group by Users.CityId) as T on City.Id=T.CityId
</code></pre>
<p>这类的查询 Chloe 也完全可以做到：</p>
<pre><code class="lang-csharp">IQuery&lt;User&gt; users = context.Query&lt;User&gt;();
IQuery&lt;City&gt; cities = context.Query&lt;City&gt;();
var gq = users.GroupBy(a =&gt; a.CityId).Select(a =&gt; new { a.CityId, MinAge = DbFunctions.Min(a.Age) });

cities.LeftJoin(gq, (city, g) =&gt; city.Id == g.CityId).Select((city, g) =&gt; new { City = city, MinAge = g.MinAge }).ToList();
/*
 * SELECT [T].[MinAge] AS [MinAge],[City].[Id] AS [Id],[City].[Name] AS [Name],[City].[ProvinceId] AS [ProvinceId] 
   FROM [City] AS [City] 
   LEFT JOIN (SELECT [Users].[CityId] AS [CityId],MIN([Users].[Age]) AS [MinAge] 
   FROM [Users] AS [Users] GROUP BY [Users].[CityId]) AS [T] ON [City].[Id] = [T].[CityId]
 */
</code></pre>
', TO_DATE('2016-12-03 15:37:53', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-04 10:52:17', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 复杂查询
IQuery<T> 接口支持多表连接查询、聚合查询、分组查询，这几个接口配合使用可以让我们开发达到事半功倍的效果。对于一般的复杂查询，Chloe 还是游刃有余的。
**example 1：**
达到一般的 in 子查询效果，比如如下 sql：
```csharp
string sql = "select Users.* from Users where Users.Id in(select id from City where City.Name LIKE ''%'' + N''北京'' + ''%'')";
```
Chloe 无需拼接字符串就可以做到：
```csharp
var userQuery = context.Query<User>();

var cityIdsQuery = context.Query<City>().Where(a => a.Name.Contains("北京")).Select(a => a.Id);

/* 建立连接 */
var view = userQuery.InnerJoin(cityIdsQuery, (user, cityId) => user.CityId == cityId).Select((user, cityId) => user);

/* 执行查询 */
List<User> userList = view.ToList();

/*
 * 生成的 sql：
 * SELECT [Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime],[Users].[Id] AS [Id],[Users].[Name] AS [Name] 
   FROM [Users] AS [Users] 
   INNER JOIN 
   (SELECT [City].[Id] AS [C] FROM [City] AS [City] WHERE [City].[Name] LIKE ''%'' + N''北京'' + ''%'') AS [T] 
   ON [Users].[CityId] = [T].[C]
 */
```
**example 2：连接、分组、聚合查询结合**
现有 Users 表、City 表，他们的关系是一个 User 隶属一个 City，一个 City 有多个用户。假设，现在有需求要查出 City 的信息，**同时也要把该 City 下用户最小的年龄输出**，如果用原生 sql 写的话大概是：
```sql
select City.*,T.MinAge from City left join (select CityId,Min(Users.Age) as MinAge 
from Users group by Users.CityId) as T on City.Id=T.CityId
```
这类的查询 Chloe 也完全可以做到：
```csharp
IQuery<User> users = context.Query<User>();
IQuery<City> cities = context.Query<City>();
var gq = users.GroupBy(a => a.CityId).Select(a => new { a.CityId, MinAge = DbFunctions.Min(a.Age) });

cities.LeftJoin(gq, (city, g) => city.Id == g.CityId).Select((city, g) => new { City = city, MinAge = g.MinAge }).ToList();
/*
 * SELECT [T].[MinAge] AS [MinAge],[City].[Id] AS [Id],[City].[Name] AS [Name],[City].[ProvinceId] AS [ProvinceId] 
   FROM [City] AS [City] 
   LEFT JOIN (SELECT [Users].[CityId] AS [CityId],MIN([Users].[Age]) AS [MinAge] 
   FROM [Users] AS [Users] GROUP BY [Users].[CityId]) AS [T] ON [City].[Id] = [T].[CityId]
 */
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325512137098395648', '使用进阶-动态排序', '使用进阶-动态排序', '使用进阶-动态排序', '<h1 id="h1-u52A8u6001u6392u5E8F"><a name="动态排序" class="reference-link"></a><span class="header-link octicon octicon-link"></span>动态排序</h1><p>在一些后台系统中，很多查询的排序字段是不定的，需要动态排序的场景不少。目前 Chloe 也支持了这功能。<br><strong>简单用法：</strong><br>这种用法针对简单的实体。</p>
<pre><code class="lang-csharp">var userQuery = context.Query&lt;User&gt;();
userQuery = userQuery.OrderBy(&quot;Age asc,Id desc&quot;);/* 传入字符串，多个排序以 &#39;,&#39; 分隔 */
List&lt;User&gt; users = userQuery.ToList();
/*
 * 生成的 sql：
 * SELECT [Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime],[Users].[Id] AS [Id],[Users].[Name] AS [Name] 
   FROM [Users] AS [Users] 
   ORDER BY [Users].[Age] ASC,[Users].[Id] DESC
 */
</code></pre>
<p><strong>高级用法：</strong><br>当查询返回的类型是复杂类型的时候可以使用这种用法。</p>
<pre><code class="lang-csharp">var userQuery = context.Query&lt;User&gt;();
var cityQuery = context.Query&lt;City&gt;();

/* 建立连接 */
var user_city = userQuery.LeftJoin(cityQuery, (user, city) =&gt; user.CityId == city.Id);

/* Select 返回的是一个复杂的匿名类型 */
var view = user_city.Select((user, city) =&gt; new { User = user, City = city });

/* 传入字符串排序 */
view = view.OrderBy(&quot;User.Age asc,User.Id desc&quot;);
var result = view.ToList();
/*
 * SELECT [Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime],[Users].[Id] AS [Id],[Users].[Name] AS [Name],[City].[Id] AS [Id0],[City].[Name] AS [Name0],[City].[ProvinceId] AS [ProvinceId] 
   FROM [Users] AS [Users] 
   LEFT JOIN [City] AS [City] ON [Users].[CityId] = [City].[Id] 
   ORDER BY [Users].[Age] ASC,[Users].[Id] DESC
 */
</code></pre>
', TO_DATE('2016-12-03 15:57:59', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-03 16:08:11', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 动态排序
在一些后台系统中，很多查询的排序字段是不定的，需要动态排序的场景不少。目前 Chloe 也支持了这功能。
**简单用法：**
这种用法针对简单的实体。
```csharp
var userQuery = context.Query<User>();
userQuery = userQuery.OrderBy("Age asc,Id desc");/* 传入字符串，多个排序以 '','' 分隔 */
List<User> users = userQuery.ToList();
/*
 * 生成的 sql：
 * SELECT [Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime],[Users].[Id] AS [Id],[Users].[Name] AS [Name] 
   FROM [Users] AS [Users] 
   ORDER BY [Users].[Age] ASC,[Users].[Id] DESC
 */
```
**高级用法：**
当查询返回的类型是复杂类型的时候可以使用这种用法。
```csharp
var userQuery = context.Query<User>();
var cityQuery = context.Query<City>();

/* 建立连接 */
var user_city = userQuery.LeftJoin(cityQuery, (user, city) => user.CityId == city.Id);

/* Select 返回的是一个复杂的匿名类型 */
var view = user_city.Select((user, city) => new { User = user, City = city });

/* 传入字符串排序 */
view = view.OrderBy("User.Age asc,User.Id desc");
var result = view.ToList();
/*
 * SELECT [Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime],[Users].[Id] AS [Id],[Users].[Name] AS [Name],[City].[Id] AS [Id0],[City].[Name] AS [Name0],[City].[ProvinceId] AS [ProvinceId] 
   FROM [Users] AS [Users] 
   LEFT JOIN [City] AS [City] ON [Users].[CityId] = [City].[Id] 
   ORDER BY [Users].[Age] ASC,[Users].[Id] DESC
 */
```');
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325833069088210944', 'Github-Chloe-README.md', 'Github-Chloe-README.md', 'Github-Chloe-README.md', '<h1 id="h1-chloe"><a name="Chloe" class="reference-link"></a><span class="header-link octicon octicon-link"></span>Chloe</h1><p>Chloe is a lightweight Object/Relational Mapping(ORM) library.<br>The query interface is similar to LINQ.You can query data like LINQ and do any things(Join Query | Group Query | Aggregate Query | Insert | Batch Update | Batch Delete) by lambda with Chloe.ORM.</p>
<p><strong>Documentation</strong>: <a href="http://www.52chloe.com" title="http://www.52chloe.com">http://www.52chloe.com</a><br>.NET交流群：325936847，只要您<strong>愿意</strong>，即可加入</p>
<h1 id="h1-nuget-install-command"><a name="NuGet Install Command" class="reference-link"></a><span class="header-link octicon octicon-link"></span>NuGet Install Command</h1><table>
<thead>
<tr>
<th></th>
<th>.NET Framework</th>
<th>.NET Core</th>
</tr>
</thead>
<tbody>
<tr>
<td>SqlServer</td>
<td>Install-Package Chloe.SqlServer</td>
<td>Install-Package ChloeCore.SqlServer</td>
</tr>
<tr>
<td>MySql</td>
<td>Install-Package Chloe.MySql</td>
<td>Install-Package ChloeCore.MySql</td>
</tr>
<tr>
<td>Oracle</td>
<td>Install-Package Chloe.Oracle</td>
<td>-</td>
</tr>
<tr>
<td>SQLite</td>
<td>Install-Package Chloe.SQLite</td>
<td>Install-Package ChloeCore.SQLite</td>
</tr>
</tbody>
</table>
<h1 id="h1-usage"><a name="Usage" class="reference-link"></a><span class="header-link octicon octicon-link"></span>Usage</h1><ul>
<li><strong>Entity</strong><br>```C#<br>public enum Gender<br>{<br>  Man = 1,<br>  Woman<br>}</li></ul>
<p>[Table(“Users”)]<br>public class User<br>{<br>    [Column(IsPrimaryKey = true)]<br>    [AutoIncrement]<br>    public int Id { get; set; }<br>    public string Name { get; set; }<br>    public Gender? Gender { get; set; }<br>    public int? Age { get; set; }<br>    public int? CityId { get; set; }<br>    public DateTime? OpTime { get; set; }<br>}</p>
<p>public class City<br>{<br>    [Column(IsPrimaryKey = true)]<br>    public int Id { get; set; }<br>    public string Name { get; set; }<br>    public int ProvinceId { get; set; }<br>}</p>
<p>public class Province<br>{<br>    [Column(IsPrimaryKey = true)]<br>    public int Id { get; set; }<br>    public string Name { get; set; }<br>}</p>
<pre><code>* **DbContext**
```C#
IDbContext context = new MsSqlContext(DbHelper.ConnectionString);
IQuery&lt;User&gt; q = context.Query&lt;User&gt;();
</code></pre><ul>
<li><strong>Query</strong><br>```C#<br>IQuery&lt;User&gt; q = context.Query&lt;User&gt;();<br>q.Where(a =&gt; a.Id &gt; 0).FirstOrDefault();<br>q.Where(a =&gt; a.Id &gt; 0).ToList();<br>q.Where(a =&gt; a.Id &gt; 0).OrderBy(a =&gt; a.Age).ToList();<br>q.Where(a =&gt; a.Id &gt; 0).Take(999).OrderBy(a =&gt; a.Age).ToList();</li></ul>
<p>q.Where(a =&gt; a.Id &gt; 0).OrderBy(a =&gt; a.Age).ThenByDesc(a =&gt; a.Id).Select(a =&gt; new { a.Id, a.Name }).Skip(1).Take(999).ToList();<br>/*</p>
<ul>
<li>SELECT TOP (999) [T].[Id] AS [Id],[T].[Name] AS [Name] FROM (SELECT [Users].[Id] AS [Id],[Users].[Name] AS [Name],ROW_NUMBER() OVER(ORDER BY [Users].[Age] ASC,[Users].[Id] DESC) AS [ROW_NUMBER_0] FROM [Users] AS [Users] WHERE [Users].[Id] &gt; 0) AS [T] WHERE [T].[ROW_NUMBER_0] &gt; 1<br>*/</li></ul>
<p>q.Where(a =&gt; a.Id &gt; 0).Where(a =&gt; a.Name.Contains(“lu”)).ToList();<br>/*</p>
<ul>
<li>SELECT [Users].[Id] AS [Id],[Users].[Name] AS [Name],[Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime] </li><li>FROM [Users] AS [Users] </li><li>WHERE ([Users].[Id] &gt; 0 AND [Users].[Name] LIKE ‘%’ + N’lu’ + ‘%’)<br>*/<br>```<ul>
<li><strong>Join Query</strong><br>```C#<br>MsSqlContext context = new MsSqlContext(DbHelper.ConnectionString);</li></ul>
</li></ul>
<p>IQuery&lt;User&gt; users = context.Query&lt;User&gt;();<br>IQuery&lt;City&gt; cities = context.Query&lt;City&gt;();<br>IQuery&lt;Province&gt; provinces = context.Query&lt;Province&gt;();</p>
<p>IJoiningQuery&lt;User, City&gt; user_city = users.InnerJoin(cities, (user, city) =&gt; user.CityId == city.Id);<br>IJoiningQuery&lt;User, City, Province&gt; user_city_province = user_city.InnerJoin(provinces, (user, city, province) =&gt; city.ProvinceId == province.Id);</p>
<p>user_city_province.Select((user, city, province) =&gt; new { UserId = user.Id, CityName = city.Name, ProvinceName = province.Name }).Where(a =&gt; a.UserId == 1).ToList();<br>/*</p>
<ul>
<li>SELECT [Users].[Id] AS [UserId],[City].[Name] AS [CityName],[Province].[Name] AS [ProvinceName] </li><li>FROM [Users] AS [Users] </li><li>INNER JOIN [City] AS [City] ON [Users].[CityId] = [City].[Id] </li><li>INNER JOIN [Province] AS [Province] ON [City].[ProvinceId] = [Province].[Id] </li><li>WHERE [Users].[Id] = 1<br>*/</li></ul>
<p>var view = user_city_province.Select((user, city, province) =&gt; new { User = user, City = city, Province = province });</p>
<p>view.Where(a =&gt; a.User.Id == 1).ToList();<br>/*</p>
<ul>
<li>SELECT [Users].[Id] AS [Id],[Users].[Name] AS [Name],[Users].[Gender] AS [Gender],[Users].[Age] AS [Age],[Users].[CityId] AS [CityId],[Users].[OpTime] AS [OpTime],[City].[Id] AS [Id0],[City].[Name] AS [Name0],[City].[ProvinceId] AS [ProvinceId],[Province].[Id] AS [Id1],[Province].[Name] AS [Name1] </li><li>FROM [Users] AS [Users] </li><li>INNER JOIN [City] AS [City] ON [Users].[CityId] = [City].[Id] </li><li>INNER JOIN [Province] AS [Province] ON [City].[ProvinceId] = [Province].[Id] </li><li>WHERE [Users].[Id] = 1<br>*/</li></ul>
<p>view.Where(a =&gt; a.User.Id == 1).Select(a =&gt; new { UserId = a.User.Id, CityName = a.City.Name, ProvinceName = a.Province.Name }).ToList();<br>/*</p>
<ul>
<li>SELECT [Users].[Id] AS [UserId],[City].[Name] AS [CityName],[Province].[Name] AS [ProvinceName] </li><li>FROM [Users] AS [Users] </li><li>INNER JOIN [City] AS [City] ON [Users].[CityId] = [City].[Id] </li><li>INNER JOIN [Province] AS [Province] ON [City].[ProvinceId] = [Province].[Id] </li><li>WHERE [Users].[Id] = 1<br>*/</li></ul>
<p>/*</p>
<ul>
<li>Chloe also supports left join,right join and full join query.</li><li>For details please see ‘<a href="https://github.com/shuxinqin/Chloe/blob/master/src/DotNet/Chloe/IQuery%60.cs">https://github.com/shuxinqin/Chloe/blob/master/src/DotNet/Chloe/IQuery%60.cs</a>‘.<br>*/<br>```<ul>
<li><strong>Group Query</strong><br>```C#<br>IQuery&lt;User&gt; q = context.Query&lt;User&gt;();</li></ul>
</li></ul>
<p>IGroupingQuery&lt;User&gt; g = q.Where(a =&gt; a.Id &gt; 0).GroupBy(a =&gt; a.Age);<br>g = g.Having(a =&gt; a.Age &gt; 1 &amp;&amp; AggregateFunctions.Count() &gt; 0);</p>
<p>g.Select(a =&gt; new { a.Age, Count = AggregateFunctions.Count(), Sum = AggregateFunctions.Sum(a.Age), Max = AggregateFunctions.Max(a.Age), Min = AggregateFunctions.Min(a.Age), Avg = AggregateFunctions.Average(a.Age) }).ToList();<br>/*</p>
<ul>
<li>SELECT [Users].[Age] AS [Age],COUNT(1) AS [Count],SUM([Users].[Age]) AS [Sum],MAX([Users].[Age]) AS [Max],MIN([Users].[Age]) AS [Min],CAST(AVG([Users].[Age]) AS FLOAT) AS [Avg] </li><li>FROM [Users] AS [Users] </li><li>WHERE [Users].[Id] &gt; 0 </li><li>GROUP BY [Users].[Age] HAVING ([Users].[Age] &gt; 1 AND COUNT(1) &gt; 0)<br>*/<pre><code>* **Sql Query**
```C#
context.SqlQuery&lt;User&gt;(&quot;select Id,Name,Age from Users where Name=<a href="https://github.com/name" title="&#64;name" class="at-link">@name</a>&quot;, DbParam.Create(&quot;<a href="https://github.com/name" title="&#64;name" class="at-link">@name</a>&quot;, &quot;lu&quot;)).ToList();
context.SqlQuery&lt;int&gt;(&quot;select Id from Users&quot;).ToList();
</code></pre><ul>
<li><strong>Aggregate Query</strong><br>```C#<br>IQuery&lt;User&gt; q = context.Query&lt;User&gt;();</li></ul>
</li></ul>
<p>q.Select(a =&gt; AggregateFunctions.Count()).First();<br>/*</p>
<ul>
<li>SELECT TOP (1) COUNT(1) AS [C] FROM [Users] AS [Users]<br>*/</li></ul>
<p>q.Select(a =&gt; new { Count = AggregateFunctions.Count(), LongCount = AggregateFunctions.LongCount(), Sum = AggregateFunctions.Sum(a.Age), Max = AggregateFunctions.Max(a.Age), Min = AggregateFunctions.Min(a.Age), Average = AggregateFunctions.Average(a.Age) }).First();<br>/*</p>
<ul>
<li>SELECT TOP (1) COUNT(1) AS [Count],COUNT_BIG(1) AS [LongCount],SUM([Users].[Age]) AS [Sum],MAX([Users].[Age]) AS [Max],MIN([Users].[Age]) AS [Min],CAST(AVG([Users].[Age]) AS FLOAT) AS [Average] </li><li>FROM [Users] AS [Users]<br>*/</li></ul>
<p>var count = q.Count();<br>/*</p>
<ul>
<li>SELECT COUNT(1) AS [C] FROM [Users] AS [Users]<br>*/</li></ul>
<p>var longCount = q.LongCount();<br>/*</p>
<ul>
<li>SELECT COUNT_BIG(1) AS [C] FROM [Users] AS [Users]<br>*/</li></ul>
<p>var sum = q.Sum(a =&gt; a.Age);<br>/*</p>
<ul>
<li>SELECT SUM([Users].[Age]) AS [C] FROM [Users] AS [Users]<br>*/</li></ul>
<p>var max = q.Max(a =&gt; a.Age);<br>/*</p>
<ul>
<li>SELECT MAX([Users].[Age]) AS [C] FROM [Users] AS [Users]<br>*/</li></ul>
<p>var min = q.Min(a =&gt; a.Age);<br>/*</p>
<ul>
<li>SELECT MIN([Users].[Age]) AS [C] FROM [Users] AS [Users]<br>*/</li></ul>
<p>var avg = q.Average(a =&gt; a.Age);<br>/*</p>
<ul>
<li>SELECT CAST(AVG([Users].[Age]) AS FLOAT) AS [C] FROM [Users] AS [Users]<br>*/<br>```<ul>
<li><strong>Method</strong><br>```C#<br>IQuery&lt;User&gt; q = context.Query&lt;User&gt;();</li></ul>
</li></ul>
<p>var space = new char[] { ‘ ‘ };</p>
<p>DateTime startTime = DateTime.Now;<br>DateTime endTime = DateTime.Now.AddDays(1);<br>q.Select(a =&gt; new<br>{<br>    Id = a.Id,</p>
<pre><code>String_Length = (int?)a.Name.Length,//LEN([Users].[Name])
Substring = a.Name.Substring(0),//SUBSTRING([Users].[Name],0 + 1,LEN([Users].[Name]))
Substring1 = a.Name.Substring(1),//SUBSTRING([Users].[Name],1 + 1,LEN([Users].[Name]))
Substring1_2 = a.Name.Substring(1, 2),//SUBSTRING([Users].[Name],1 + 1,2)
ToLower = a.Name.ToLower(),//LOWER([Users].[Name])
ToUpper = a.Name.ToUpper(),//UPPER([Users].[Name])
IsNullOrEmpty = string.IsNullOrEmpty(a.Name),//too long
Contains = (bool?)a.Name.Contains(&quot;s&quot;),//
Trim = a.Name.Trim(),//RTRIM(LTRIM([Users].[Name]))
TrimStart = a.Name.TrimStart(space),//LTRIM([Users].[Name])
TrimEnd = a.Name.TrimEnd(space),//RTRIM([Users].[Name])
StartsWith = (bool?)a.Name.StartsWith(&quot;s&quot;),//
EndsWith = (bool?)a.Name.EndsWith(&quot;s&quot;),//

DiffYears = DbFunctions.DiffYears(startTime, endTime),//DATEDIFF(YEAR,@P_0,@P_1)
DiffMonths = DbFunctions.DiffMonths(startTime, endTime),//DATEDIFF(MONTH,@P_0,@P_1)
DiffDays = DbFunctions.DiffDays(startTime, endTime),//DATEDIFF(DAY,@P_0,@P_1)
DiffHours = DbFunctions.DiffHours(startTime, endTime),//DATEDIFF(HOUR,@P_0,@P_1)
DiffMinutes = DbFunctions.DiffMinutes(startTime, endTime),//DATEDIFF(MINUTE,@P_0,@P_1)
DiffSeconds = DbFunctions.DiffSeconds(startTime, endTime),//DATEDIFF(SECOND,@P_0,@P_1)
DiffMilliseconds = DbFunctions.DiffMilliseconds(startTime, endTime),//DATEDIFF(MILLISECOND,@P_0,@P_1)
//DiffMicroseconds = DbFunctions.DiffMicroseconds(startTime, endTime),//DATEDIFF(MICROSECOND,@P_0,@P_1)  Exception

/* No longer support method &#39;DateTime.Subtract(DateTime d)&#39;, instead of using &#39;DbFunctions.DiffXX&#39; */
//SubtractTotalDays = endTime.Subtract(startTime).TotalDays,//CAST(DATEDIFF(DAY,@P_0,@P_1)
//SubtractTotalHours = endTime.Subtract(startTime).TotalHours,//CAST(DATEDIFF(HOUR,@P_0,@P_1)
//SubtractTotalMinutes = endTime.Subtract(startTime).TotalMinutes,//CAST(DATEDIFF(MINUTE,@P_0,@P_1)
//SubtractTotalSeconds = endTime.Subtract(startTime).TotalSeconds,//CAST(DATEDIFF(SECOND,@P_0,@P_1)
//SubtractTotalMilliseconds = endTime.Subtract(startTime).TotalMilliseconds,//CAST(DATEDIFF(MILLISECOND,@P_0,@P_1)

AddYears = startTime.AddYears(1),//DATEADD(YEAR,1,@P_0)
AddMonths = startTime.AddMonths(1),//DATEADD(MONTH,1,@P_0)
AddDays = startTime.AddDays(1),//DATEADD(DAY,1,@P_0)
AddHours = startTime.AddHours(1),//DATEADD(HOUR,1,@P_0)
AddMinutes = startTime.AddMinutes(2),//DATEADD(MINUTE,2,@P_0)
AddSeconds = startTime.AddSeconds(120),//DATEADD(SECOND,120,@P_0)
AddMilliseconds = startTime.AddMilliseconds(20000),//DATEADD(MILLISECOND,20000,@P_0)

Now = DateTime.Now,//GETDATE()
UtcNow = DateTime.UtcNow,//GETUTCDATE()
Today = DateTime.Today,//CAST(GETDATE() AS DATE)
Date = DateTime.Now.Date,//CAST(GETDATE() AS DATE)
Year = DateTime.Now.Year,//DATEPART(YEAR,GETDATE())
Month = DateTime.Now.Month,//DATEPART(MONTH,GETDATE())
Day = DateTime.Now.Day,//DATEPART(DAY,GETDATE())
Hour = DateTime.Now.Hour,//DATEPART(HOUR,GETDATE())
Minute = DateTime.Now.Minute,//DATEPART(MINUTE,GETDATE())
Second = DateTime.Now.Second,//DATEPART(SECOND,GETDATE())
Millisecond = DateTime.Now.Millisecond,//DATEPART(MILLISECOND,GETDATE())
DayOfWeek = DateTime.Now.DayOfWeek,//(DATEPART(WEEKDAY,GETDATE()) - 1)

Int_Parse = int.Parse(&quot;1&quot;),//CAST(N&#39;1&#39; AS INT)
Int16_Parse = Int16.Parse(&quot;11&quot;),//CAST(N&#39;11&#39; AS SMALLINT)
Long_Parse = long.Parse(&quot;2&quot;),//CAST(N&#39;2&#39; AS BIGINT)
Double_Parse = double.Parse(&quot;3&quot;),//CAST(N&#39;3&#39; AS FLOAT)
Float_Parse = float.Parse(&quot;4&quot;),//CAST(N&#39;4&#39; AS REAL)
//Decimal_Parse = decimal.Parse(&quot;5&quot;),//CAST(N&#39;5&#39; AS DECIMAL)  ps: &#39;Decimal.Parse(string s)&#39; is not supported now,because we don&#39;t know the precision and scale information.
Guid_Parse = Guid.Parse(&quot;D544BC4C-739E-4CD3-A3D3-7BF803FCE179&quot;),//CAST(N&#39;D544BC4C-739E-4CD3-A3D3-7BF803FCE179&#39; AS UNIQUEIDENTIFIER) AS [Guid_Parse]

Bool_Parse = bool.Parse(&quot;1&quot;),//CASE WHEN CAST(N&#39;1&#39; AS BIT) = CAST(1 AS BIT) THEN CAST(1 AS BIT) WHEN NOT (CAST(N&#39;1&#39; AS BIT) = CAST(1 AS BIT)) THEN CAST(0 AS BIT) ELSE NULL END AS [Bool_Parse]
DateTime_Parse = DateTime.Parse(&quot;1992-1-16&quot;),//CAST(N&#39;1992-1-16&#39; AS DATETIME) AS [DateTime_Parse]

B = a.Age == null ? false : a.Age &gt; 1,
</code></pre><p>}).ToList();</p>
<pre><code>* **Insert**
```C#
IDbContext context = new MsSqlContext(DbHelper.ConnectionString);

//return the key value
int id = (int)context.Insert&lt;User&gt;(() =&gt; new User() { Name = &quot;lu&quot;, Age = 18, Gender = Gender.Man, CityId = 1, OpTime = DateTime.Now });
/*
 * INSERT INTO [Users]([Name],[Age],[Gender],[CityId],[OpTime]) VALUES(N&#39;lu&#39;,18,1,1,GETDATE());SELECT @@IDENTITY
 */


User user = new User();
user.Name = &quot;lu&quot;;
user.Age = 18;
user.Gender = Gender.Man;
user.CityId = 1;
user.OpTime = new DateTime(1992, 1, 16);

user = context.Insert(user);
/*
 * String @P_0 = &quot;lu&quot;;
   Gender @P_1 = Man;
   Int32 @P_2 = 18;
   Int32 @P_3 = 1;
   DateTime @P_4 = &quot;1992/1/16 0:00:00&quot;;
   INSERT INTO [Users]([Name],[Gender],[Age],[CityId],[OpTime]) VALUES(@P_0,@P_1,@P_2,@P_3,@P_4);SELECT @@IDENTITY
 */
</code></pre><ul>
<li><strong>Update</strong><br>```C#<br>MsSqlContext context = new MsSqlContext(DbHelper.ConnectionString);</li></ul>
<p>context.Update&lt;User&gt;(a =&gt; new User() { Name = a.Name, Age = a.Age + 100, Gender = Gender.Man, OpTime = DateTime.Now }, a =&gt; a.Id == 1);<br>/*</p>
<ul>
<li>UPDATE [Users] SET [Name]=[Users].[Name],[Age]=([Users].[Age] + 100),[Gender]=1,[OpTime]=GETDATE() WHERE [Users].[Id] = 1<br>*/</li></ul>
<p>context.Update&lt;User&gt;(a =&gt; new User() { Age = a.Age - 10, OpTime = DateTime.Now }, a =&gt; a.Gender == Gender.Woman);<br>/*</p>
<ul>
<li>UPDATE [Users] SET [Age]=([Users].[Age] - 10),[OpTime]=GETDATE() WHERE [Users].[Gender] = 2<br>*/</li></ul>
<p>User user = new User();<br>user.Id = 1;<br>user.Name = “lu”;<br>user.Age = 28;<br>user.Gender = Gender.Man;<br>user.OpTime = DateTime.Now;</p>
<p>context.Update(user); //update all columns<br>/*</p>
<ul>
<li>String <a href="https://github.com/P_0" title="&#64;P_0" class="at-link">@P_0</a> = “lu”;<br>Gender <a href="https://github.com/P_1" title="&#64;P_1" class="at-link">@P_1</a> = Man;<br>Int32 <a href="https://github.com/P_2" title="&#64;P_2" class="at-link">@P_2</a> = 28;<br>Nullable&lt;Int32&gt; <a href="https://github.com/P_3" title="&#64;P_3" class="at-link">@P_3</a> = NULL;<br>DateTime <a href="https://github.com/P_4" title="&#64;P_4" class="at-link">@P_4</a> = “2016/7/8 11&#58;28&#58;27”;<br>Int32 <a href="https://github.com/P_5" title="&#64;P_5" class="at-link">@P_5</a> = 1;<br>UPDATE [Users] SET [Name]=<a href="https://github.com/P_0" title="&#64;P_0" class="at-link">@P_0</a>,[Gender]=<a href="https://github.com/P_1" title="&#64;P_1" class="at-link">@P_1</a>,[Age]=<a href="https://github.com/P_2" title="&#64;P_2" class="at-link">@P_2</a>,[CityId]=<a href="https://github.com/P_3" title="&#64;P_3" class="at-link">@P_3</a>,[OpTime]=<a href="https://github.com/P_4" title="&#64;P_4" class="at-link">@P_4</a> WHERE [Users].[Id] = <a href="https://github.com/P_5" title="&#64;P_5" class="at-link">@P_5</a><br>*/</li></ul>
<p>context.TrackEntity(user);//track entity<br>user.Name = user.Name + “1”;<br>context.Update(user);//update the column ‘Name’ only<br>/*</p>
<ul>
<li>String <a href="https://github.com/P_0" title="&#64;P_0" class="at-link">@P_0</a> = “lu1”;<br>Int32 <a href="https://github.com/P_1" title="&#64;P_1" class="at-link">@P_1</a> = 1;<br>UPDATE [Users] SET [Name]=<a href="https://github.com/P_0" title="&#64;P_0" class="at-link">@P_0</a> WHERE [Users].[Id] = <a href="https://github.com/P_1" title="&#64;P_1" class="at-link">@P_1</a><br>*/<br>```<ul>
<li><strong>Delete</strong><br>```C#<br>MsSqlContext context = new MsSqlContext(DbHelper.ConnectionString);</li></ul>
</li></ul>
<p>context.Delete&lt;User&gt;(a =&gt; a.Id == 1);<br>/*</p>
<ul>
<li>DELETE [Users] WHERE [Users].[Id] = 1<br>*/</li></ul>
<p>context.Delete&lt;User&gt;(a =&gt; a.Gender == null);<br>/*</p>
<ul>
<li>DELETE [Users] WHERE [Users].[Gender] IS NULL<br>*/</li></ul>
<p>User user = new User();<br>user.Id = 1;<br>context.Delete(user);<br>/*</p>
<ul>
<li>Int32 <a href="https://github.com/P_0" title="&#64;P_0" class="at-link">@P_0</a> = 1;<br>DELETE [Users] WHERE [Users].[Id] = <a href="https://github.com/P_0" title="&#64;P_0" class="at-link">@P_0</a><br>*/<br>```</li></ul>
<p><a href="http://www.cnblogs.com/so9527/p/5636216.html">More…</a></p>
', TO_DATE('2016-12-04 13:13:15', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-04 13:24:16', 'YYYY-MM-DD HH24:MI:SS'), '0', null, null);
INSERT INTO "SYSTEM"."WIKIDOCUMENT" VALUES ('3325873886481874944', 'Chloe-性能评测', '性能测评', 'Chloe-性能评测', '<h1 id="h1-u6027u80FDu8BC4u6D4B"><a name="性能评测" class="reference-link"></a><span class="header-link octicon octicon-link"></span>性能评测</h1><p>测评对象：EntityFramework6.1、Dapper 和 Chloe.ORM。<br><strong>1.映射能力</strong><br>一次查50万条数据，总共测试5轮，测试结果数据如下：</p>
<table>
<thead>
<tr>
<th></th>
<th>Chloe.IQuery(ms)</th>
<th>Chloe.SqlQuery(ms)</th>
<th>Dapper.Query(ms)</th>
<th>EF.IQueryable(ms)</th>
<th>EF.SqlQuery(ms)</th>
</tr>
</thead>
<tbody>
<tr>
<td>第1轮</td>
<td>6976</td>
<td>7170</td>
<td>7948</td>
<td>7704</td>
<td>7744</td>
</tr>
<tr>
<td>第2轮</td>
<td>7357</td>
<td>6853</td>
<td>8410</td>
<td>8328</td>
<td>7783</td>
</tr>
<tr>
<td>第3轮</td>
<td>7610</td>
<td>7833</td>
<td>8107</td>
<td>9795</td>
<td>8706</td>
</tr>
<tr>
<td>第4轮</td>
<td>7296</td>
<td>6957</td>
<td>7760</td>
<td>8643</td>
<td>7873</td>
</tr>
<tr>
<td>第5轮</td>
<td>9636</td>
<td>6705</td>
<td>8805</td>
<td>8946</td>
<td>8544</td>
</tr>
<tr>
<td><strong>平均</strong></td>
<td><strong>7775</strong></td>
<td><strong>7103</strong></td>
<td><strong>8206</strong></td>
<td><strong>8683</strong></td>
<td><strong>8130</strong></td>
</tr>
</tbody>
</table>
<p><strong>2.查询能力</strong><br>一次查询只查一条数据，循环执行20000次查询。</p>
<table>
<thead>
<tr>
<th></th>
<th>Chloe.IQuery(ms)</th>
<th>Chloe.SqlQuery(ms)</th>
<th>Dapper.Query(ms)</th>
<th>EF.IQueryable(ms)</th>
<th>EF.SqlQuery(ms)</th>
</tr>
</thead>
<tbody>
<tr>
<td>第1轮</td>
<td>15281</td>
<td>11858</td>
<td>11981</td>
<td>31394</td>
<td>19309</td>
</tr>
<tr>
<td>第2轮</td>
<td>15194</td>
<td>12177</td>
<td>12314</td>
<td>31464</td>
<td>18161</td>
</tr>
<tr>
<td>第3轮</td>
<td>15967</td>
<td>12348</td>
<td>12366</td>
<td>31082</td>
<td>18030</td>
</tr>
<tr>
<td>第4轮</td>
<td>15371</td>
<td>11793</td>
<td>12479</td>
<td>32314</td>
<td>18356</td>
</tr>
<tr>
<td>第5轮</td>
<td>15350</td>
<td>11921</td>
<td>11937</td>
<td>35023</td>
<td>18356</td>
</tr>
<tr>
<td><strong>平均</strong></td>
<td><strong>15411</strong></td>
<td><strong>12019</strong></td>
<td><strong>12215</strong></td>
<td><strong>32255</strong></td>
<td><strong>18442</strong></td>
</tr>
</tbody>
</table>
<p>以上测试，EF 均使用了 AsNoTracking。测试效果在不同机子可能会有略微差别，以上数据仅供参考。<br>数据来源：<a href="http://www.cnblogs.com/so9527/p/5674498.html" title="http://www.cnblogs.com/so9527/p/5674498.html">http://www.cnblogs.com/so9527/p/5674498.html</a></p>
', TO_DATE('2016-12-04 15:55:27', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-04 16:09:45', 'YYYY-MM-DD HH24:MI:SS'), '0', null, '# 性能评测
测评对象：EntityFramework6.1、Dapper 和 Chloe.ORM。
**1.映射能力**
一次查50万条数据，总共测试5轮，测试结果数据如下：

|   | Chloe.IQuery(ms)  | Chloe.SqlQuery(ms)  | Dapper.Query(ms)  | EF.IQueryable(ms)  | EF.SqlQuery(ms)  |
| ------------ | ------------ | ------------ | ------------ | ------------ | ------------ |
| 第1轮  | 6976 | 7170  | 7948  | 7704  | 7744  |
| 第2轮  | 7357  | 6853  | 8410  | 8328  | 7783  |
| 第3轮  | 7610  | 7833  | 8107  | 9795  | 8706 |
| 第4轮  | 7296  | 6957  | 7760  | 8643  | 7873  |
| 第5轮  | 9636  | 6705  | 8805  | 8946  | 8544  |
| **平均**  | **7775**  | **7103**  | **8206**  | **8683**  | **8130**  |

**2.查询能力**
一次查询只查一条数据，循环执行20000次查询。

|   | Chloe.IQuery(ms)  | Chloe.SqlQuery(ms)  | Dapper.Query(ms)  | EF.IQueryable(ms)  | EF.SqlQuery(ms)  |
| ------------ | ------------ | ------------ | ------------ | ------------ | ------------ |
| 第1轮  | 15281 | 11858  | 11981  | 31394  | 19309  |
| 第2轮  | 15194  | 12177  | 12314  | 31464  | 18161  |
| 第3轮  | 15967  | 12348  | 12366  | 31082  | 18030 |
| 第4轮  | 15371  | 11793  | 12479  | 32314  | 18356  |
| 第5轮  | 15350  | 11921  | 11937  | 35023  | 18356  |
| **平均**  | **15411**  | **12019**  | **12215**  | **32255**  | **18442**  |

以上测试，EF 均使用了 AsNoTracking。测试效果在不同机子可能会有略微差别，以上数据仅供参考。
数据来源：[http://www.cnblogs.com/so9527/p/5674498.html](http://www.cnblogs.com/so9527/p/5674498.html "http://www.cnblogs.com/so9527/p/5674498.html")');

-- ----------------------------
-- Indexes structure for table WIKIDOCUMENT
-- ----------------------------

-- ----------------------------
-- Checks structure for table WIKIDOCUMENT
-- ----------------------------
ALTER TABLE "SYSTEM"."WIKIDOCUMENT" ADD CHECK ("ID" IS NOT NULL);
ALTER TABLE "SYSTEM"."WIKIDOCUMENT" ADD CHECK ("CREATIONTIME" IS NOT NULL);
ALTER TABLE "SYSTEM"."WIKIDOCUMENT" ADD CHECK ("ISDELETED" IS NOT NULL);

-- ----------------------------
-- Primary Key structure for table WIKIDOCUMENT
-- ----------------------------
ALTER TABLE "SYSTEM"."WIKIDOCUMENT" ADD PRIMARY KEY ("ID");
