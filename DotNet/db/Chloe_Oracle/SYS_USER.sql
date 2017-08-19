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

Date: 2016-12-11 15:18:08
*/


-- ----------------------------
-- Table structure for SYS_USER
-- ----------------------------
DROP TABLE "SYSTEM"."SYS_USER";
CREATE TABLE "SYSTEM"."SYS_USER" (
"ID" VARCHAR2(50 BYTE) NOT NULL ,
"USERNAME" NVARCHAR2(50) NULL ,
"REALNAME" NVARCHAR2(50) NULL ,
"HEADICON" NVARCHAR2(50) NULL ,
"GENDER" NUMBER(9) NULL ,
"BIRTHDAY" DATE NULL ,
"MOBILEPHONE" NVARCHAR2(50) NULL ,
"EMAIL" NVARCHAR2(50) NULL ,
"WECHAT" NVARCHAR2(50) NULL ,
"DEPARTMENTID" NVARCHAR2(50) NULL ,
"ROLEID" NVARCHAR2(50) NULL ,
"DUTYID" NVARCHAR2(50) NULL ,
"ISENABLED" NUMBER(9) NOT NULL ,
"DESCRIPTION" NVARCHAR2(500) NULL ,
"CREATIONTIME" DATE NOT NULL ,
"CREATEUSERID" NVARCHAR2(50) NULL ,
"LASTMODIFYTIME" DATE NULL ,
"LASTMODIFYUSERID" NVARCHAR2(50) NULL ,
"ISDELETED" NUMBER(9) NOT NULL ,
"DELETIONTIME" DATE NULL ,
"DELETEUSERID" NVARCHAR2(50) NULL 
)
LOGGING
NOCOMPRESS
NOCACHE

;

-- ----------------------------
-- Records of SYS_USER
-- ----------------------------
INSERT INTO "SYSTEM"."SYS_USER" VALUES ('9f2ec0797d0f4fe290ab8b09a8302aba', 'admin', '超级管理员', null, '1', TO_DATE('2016-11-29 00:00:00', 'YYYY-MM-DD HH24:MI:SS'), '13548654896', 'so_while@163.com', 'so9527', '554C61CE-6AE0-44EB-B33D-A462BE7EB3E1', null, null, '1', '系统内置账户a', TO_DATE('2016-07-20 00:00:00', 'YYYY-MM-DD HH24:MI:SS'), null, null, null, '0', null, null);

-- ----------------------------
-- Indexes structure for table SYS_USER
-- ----------------------------

-- ----------------------------
-- Checks structure for table SYS_USER
-- ----------------------------
ALTER TABLE "SYSTEM"."SYS_USER" ADD CHECK ("ID" IS NOT NULL);
ALTER TABLE "SYSTEM"."SYS_USER" ADD CHECK ("ISENABLED" IS NOT NULL);
ALTER TABLE "SYSTEM"."SYS_USER" ADD CHECK ("CREATIONTIME" IS NOT NULL);
ALTER TABLE "SYSTEM"."SYS_USER" ADD CHECK ("ISDELETED" IS NOT NULL);

-- ----------------------------
-- Primary Key structure for table SYS_USER
-- ----------------------------
ALTER TABLE "SYSTEM"."SYS_USER" ADD PRIMARY KEY ("ID");
