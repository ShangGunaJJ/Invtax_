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

Date: 2016-12-11 15:16:34
*/


-- ----------------------------
-- Table structure for SYS_DUTY
-- ----------------------------
DROP TABLE "SYSTEM"."SYS_DUTY";
CREATE TABLE "SYSTEM"."SYS_DUTY" (
"ID" VARCHAR2(50 BYTE) NOT NULL ,
"NAME" NVARCHAR2(50) NULL ,
"DEPARTMENTID" VARCHAR2(50 BYTE) NULL ,
"SORTCODE" NUMBER(9) NULL ,
"CREATIONTIME" DATE NOT NULL ,
"CREATEUSERID" VARCHAR2(50 BYTE) NULL ,
"ISDELETED" NUMBER(9) NOT NULL ,
"DELETIONTIME" DATE NULL ,
"DELETEUSERID" VARCHAR2(50 BYTE) NULL 
)
LOGGING
NOCOMPRESS
NOCACHE

;

-- ----------------------------
-- Records of SYS_DUTY
-- ----------------------------
INSERT INTO "SYSTEM"."SYS_DUTY" VALUES ('5824d5f07ab24933b06b85595bc3399b', '小开发', 'fd1df42f71e74a3a9541dabc85175f4e', '1', TO_DATE('2016-10-29 18:08:03', 'YYYY-MM-DD HH24:MI:SS'), '9f2ec079-7d0f-4fe2-90ab-8b09a8302aba', '0', null, null);
INSERT INTO "SYSTEM"."SYS_DUTY" VALUES ('5AB270C0-5D33-4203-A54F-4552699FDA3C', '开发部', '5AB270C0-5D33-4203-A54F-4552699FDA3C', null, TO_DATE('2016-10-10 00:00:00', 'YYYY-MM-DD HH24:MI:SS'), null, '1', TO_DATE('2016-10-29 18:08:15', 'YYYY-MM-DD HH24:MI:SS'), '9f2ec079-7d0f-4fe2-90ab-8b09a8302aba');
INSERT INTO "SYSTEM"."SYS_DUTY" VALUES ('80E10CD5-7591-40B8-A005-BCDE1B961E76', '测试部', 'fd1df42f71e74a3a9541dabc85175f4e', '1', TO_DATE('2016-10-10 00:00:00', 'YYYY-MM-DD HH24:MI:SS'), null, '0', null, null);

-- ----------------------------
-- Indexes structure for table SYS_DUTY
-- ----------------------------

-- ----------------------------
-- Checks structure for table SYS_DUTY
-- ----------------------------
ALTER TABLE "SYSTEM"."SYS_DUTY" ADD CHECK ("ID" IS NOT NULL);
ALTER TABLE "SYSTEM"."SYS_DUTY" ADD CHECK ("CREATIONTIME" IS NOT NULL);
ALTER TABLE "SYSTEM"."SYS_DUTY" ADD CHECK ("ISDELETED" IS NOT NULL);

-- ----------------------------
-- Primary Key structure for table SYS_DUTY
-- ----------------------------
ALTER TABLE "SYSTEM"."SYS_DUTY" ADD PRIMARY KEY ("ID");
