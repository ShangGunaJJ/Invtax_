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

Date: 2016-12-11 15:17:20
*/


-- ----------------------------
-- Table structure for SYS_MODULE
-- ----------------------------
DROP TABLE "SYSTEM"."SYS_MODULE";
CREATE TABLE "SYSTEM"."SYS_MODULE" (
"ID" VARCHAR2(50 BYTE) NOT NULL ,
"PARENTID" VARCHAR2(50 BYTE) NULL ,
"ENCODE" NVARCHAR2(50) NULL ,
"NAME" NVARCHAR2(50) NULL ,
"ICON" NVARCHAR2(50) NULL ,
"URLADDRESS" NVARCHAR2(500) NULL ,
"OPENTARGET" NVARCHAR2(50) NULL ,
"ISMENU" NUMBER(9) NOT NULL ,
"ISEXPAND" NUMBER(9) NOT NULL ,
"ISPUBLIC" NUMBER(9) NOT NULL ,
"SORTCODE" NUMBER(9) NULL ,
"DESCRIPTION" NVARCHAR2(500) NULL ,
"CREATIONTIME" DATE NOT NULL ,
"CREATEUSERID" VARCHAR2(50 BYTE) NULL ,
"LASTMODIFYTIME" DATE NULL ,
"LASTMODIFYUSERID" VARCHAR2(50 BYTE) NULL ,
"ISENABLED" NUMBER(9) NOT NULL ,
"ISDELETED" NUMBER(9) NOT NULL ,
"DELETETIME" DATE NULL ,
"DELETEUSERID" VARCHAR2(50 BYTE) NULL 
)
LOGGING
NOCOMPRESS
NOCACHE

;

-- ----------------------------
-- Records of SYS_MODULE
-- ----------------------------
INSERT INTO "SYSTEM"."SYS_MODULE" VALUES ('e72c75d0-3a69-41ad-b220-13c9a62ec788', '73FD1267-79BA-4E23-A152-744AF73117E9', null, '数据备份', null, '/SystemSecurity/DbBackup/Index', 'iframe', '1', '0', '0', '1', null, TO_DATE('2016-10-20 12:34:58', 'YYYY-MM-DD HH24:MI:SS'), null, TO_DATE('2016-07-20 16:15:40', 'YYYY-MM-DD HH24:MI:SS'), null, '1', '0', null, null);
INSERT INTO "SYSTEM"."SYS_MODULE" VALUES ('462027E0-0848-41DD-BCC3-025DCAE65555', null, null, '系统管理', 'fa fa-gears', null, 'expand', '0', '1', '0', '1', null, TO_DATE('2016-10-20 12:34:58', 'YYYY-MM-DD HH24:MI:SS'), null, TO_DATE('2016-12-10 23:50:03', 'YYYY-MM-DD HH24:MI:SS'), '9f2ec0797d0f4fe290ab8b09a8302aba', '1', '0', null, null);
INSERT INTO "SYSTEM"."SYS_MODULE" VALUES ('73FD1267-79BA-4E23-A152-744AF73117E9', null, null, '系统安全', 'fa fa-desktop', null, 'expand', '0', '1', '0', '3', null, TO_DATE('2016-10-20 12:34:58', 'YYYY-MM-DD HH24:MI:SS'), null, TO_DATE('2016-07-22 15:46:56', 'YYYY-MM-DD HH24:MI:SS'), '9f2ec079-7d0f-4fe2-90ab-8b09a8302aba', '1', '0', null, null);
INSERT INTO "SYSTEM"."SYS_MODULE" VALUES ('e7e1cfb2856d492faeaadc8e2962ac76', null, null, 'Wiki管理', 'fa fa-gears', null, 'expand', '0', '0', '0', '2', null, TO_DATE('2016-11-29 23:05:58', 'YYYY-MM-DD HH24:MI:SS'), '9f2ec079-7d0f-4fe2-90ab-8b09a8302aba', TO_DATE('2016-11-29 23:14:03', 'YYYY-MM-DD HH24:MI:SS'), '9f2ec079-7d0f-4fe2-90ab-8b09a8302aba', '0', '0', null, null);
INSERT INTO "SYSTEM"."SYS_MODULE" VALUES ('6e5b779e849e459f957f3abef2a277e6', 'e7e1cfb2856d492faeaadc8e2962ac76', null, '文档管理', null, '/WikiManage/WikiDocument/Index', 'iframe', '1', '0', '0', '1', null, TO_DATE('2016-11-29 23:08:11', 'YYYY-MM-DD HH24:MI:SS'), '9f2ec079-7d0f-4fe2-90ab-8b09a8302aba', TO_DATE('2016-11-29 23:08:28', 'YYYY-MM-DD HH24:MI:SS'), '9f2ec079-7d0f-4fe2-90ab-8b09a8302aba', '1', '0', null, null);
INSERT INTO "SYSTEM"."SYS_MODULE" VALUES ('a3a4742d-ca39-42ec-b95a-8552a6fae579', '73FD1267-79BA-4E23-A152-744AF73117E9', null, '访问控制', null, '/SystemSecurity/FilterIP/Index', 'iframe', '1', '0', '0', '2', null, TO_DATE('2016-10-20 12:34:58', 'YYYY-MM-DD HH24:MI:SS'), null, TO_DATE('2016-07-20 16:16:02', 'YYYY-MM-DD HH24:MI:SS'), null, '1', '0', null, null);
INSERT INTO "SYSTEM"."SYS_MODULE" VALUES ('64A1C550-2C61-4A8C-833D-ACD0C012260F', '462027E0-0848-41DD-BCC3-025DCAE65555', null, '系统菜单', null, '/SystemManage/Module/Index', 'iframe', '1', '0', '0', '7', '测试', TO_DATE('2016-10-20 12:34:58', 'YYYY-MM-DD HH24:MI:SS'), null, TO_DATE('2016-07-27 10:50:09', 'YYYY-MM-DD HH24:MI:SS'), '9f2ec079-7d0f-4fe2-90ab-8b09a8302aba', '1', '0', null, null);
INSERT INTO "SYSTEM"."SYS_MODULE" VALUES ('38CA5A66-C993-4410-AF95-50489B22939C', '462027E0-0848-41DD-BCC3-025DCAE65555', null, '用户管理', null, '/SystemManage/User/Index', 'iframe', '1', '0', '0', '4', null, TO_DATE('2016-10-20 12:34:58', 'YYYY-MM-DD HH24:MI:SS'), null, TO_DATE('2016-07-14 16:22:47', 'YYYY-MM-DD HH24:MI:SS'), null, '1', '0', null, null);
INSERT INTO "SYSTEM"."SYS_MODULE" VALUES ('252229DB-35CA-47AE-BDAE-C9903ED5BA7B', '462027E0-0848-41DD-BCC3-025DCAE65555', null, '部门管理', null, '/SystemManage/Department/Index', 'iframe', '1', '0', '0', '1', null, TO_DATE('2016-10-20 12:34:58', 'YYYY-MM-DD HH24:MI:SS'), null, TO_DATE('2016-11-29 22:58:58', 'YYYY-MM-DD HH24:MI:SS'), '9f2ec079-7d0f-4fe2-90ab-8b09a8302aba', '1', '0', null, null);
INSERT INTO "SYSTEM"."SYS_MODULE" VALUES ('91A6CFAD-B2F9-4294-BDAE-76DECF412C6C', '462027E0-0848-41DD-BCC3-025DCAE65555', null, '角色管理', '&nbsp;', '/SystemManage/Role/Index', 'iframe', '1', '0', '0', '2', '&nbsp;', TO_DATE('2016-10-20 12:34:58', 'YYYY-MM-DD HH24:MI:SS'), null, TO_DATE('2016-10-29 11:01:29', 'YYYY-MM-DD HH24:MI:SS'), '9f2ec079-7d0f-4fe2-90ab-8b09a8302aba', '1', '0', null, null);
INSERT INTO "SYSTEM"."SYS_MODULE" VALUES ('a7f1f2f73ac74b5ba8421ed9b3840439', 'e7e1cfb2856d492faeaadc8e2962ac76', null, '菜单管理', null, '/WikiManage/WikiMenu/Index', 'iframe', '1', '0', '0', '2', null, TO_DATE('2016-11-29 23:09:14', 'YYYY-MM-DD HH24:MI:SS'), '9f2ec079-7d0f-4fe2-90ab-8b09a8302aba', null, null, '1', '0', null, null);
INSERT INTO "SYSTEM"."SYS_MODULE" VALUES ('F298F868-B689-4982-8C8B-9268CBF0308D', '462027E0-0848-41DD-BCC3-025DCAE65555', null, '岗位管理', null, '/SystemManage/Duty/Index', 'iframe', '1', '0', '0', '3', null, TO_DATE('2016-10-20 12:34:58', 'YYYY-MM-DD HH24:MI:SS'), null, TO_DATE('2016-07-14 16:22:41', 'YYYY-MM-DD HH24:MI:SS'), null, '1', '0', null, null);
INSERT INTO "SYSTEM"."SYS_MODULE" VALUES ('96EE855E-8CD2-47FC-A51D-127C131C9FB9', '73FD1267-79BA-4E23-A152-744AF73117E9', null, '系统日志', null, '/SystemSecurity/Log/Index', 'iframe', '1', '0', '0', '3', null, TO_DATE('2016-10-20 12:34:58', 'YYYY-MM-DD HH24:MI:SS'), null, TO_DATE('2016-07-20 16:16:19', 'YYYY-MM-DD HH24:MI:SS'), null, '1', '0', null, null);

-- ----------------------------
-- Indexes structure for table SYS_MODULE
-- ----------------------------

-- ----------------------------
-- Checks structure for table SYS_MODULE
-- ----------------------------
ALTER TABLE "SYSTEM"."SYS_MODULE" ADD CHECK ("ID" IS NOT NULL);
ALTER TABLE "SYSTEM"."SYS_MODULE" ADD CHECK ("ISMENU" IS NOT NULL);
ALTER TABLE "SYSTEM"."SYS_MODULE" ADD CHECK ("ISEXPAND" IS NOT NULL);
ALTER TABLE "SYSTEM"."SYS_MODULE" ADD CHECK ("ISPUBLIC" IS NOT NULL);
ALTER TABLE "SYSTEM"."SYS_MODULE" ADD CHECK ("CREATIONTIME" IS NOT NULL);
ALTER TABLE "SYSTEM"."SYS_MODULE" ADD CHECK ("ISENABLED" IS NOT NULL);
ALTER TABLE "SYSTEM"."SYS_MODULE" ADD CHECK ("ISDELETED" IS NOT NULL);

-- ----------------------------
-- Primary Key structure for table SYS_MODULE
-- ----------------------------
ALTER TABLE "SYSTEM"."SYS_MODULE" ADD PRIMARY KEY ("ID");
