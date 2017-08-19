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

Date: 2016-12-11 15:15:44
*/


-- ----------------------------
-- Table structure for SYS_DEPARTMENT
-- ----------------------------
DROP TABLE "SYSTEM"."SYS_DEPARTMENT";
CREATE TABLE "SYSTEM"."SYS_DEPARTMENT" (
"ID" VARCHAR2(50 BYTE) NOT NULL ,
"ENCODE" NVARCHAR2(50) NULL ,
"NAME" NVARCHAR2(50) NULL ,
"MANAGER" NVARCHAR2(50) NULL ,
"TELEPHONE" NVARCHAR2(50) NULL ,
"MOBILEPHONE" NVARCHAR2(50) NULL ,
"WECHAT" NVARCHAR2(50) NULL ,
"FAX" NVARCHAR2(50) NULL ,
"EMAIL" NVARCHAR2(50) NULL ,
"SORTCODE" NUMBER(9) NULL ,
"DESCRIPTION" NVARCHAR2(500) NULL ,
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
-- Records of SYS_DEPARTMENT
-- ----------------------------
INSERT INTO "SYSTEM"."SYS_DEPARTMENT" VALUES ('111', '11', '2', '3', '4', '5', '6', '7', '8', '1', 'fhdf', TO_DATE('2016-10-10 00:00:00', 'YYYY-MM-DD HH24:MI:SS'), null, '1', TO_DATE('2016-10-29 13:52:41', 'YYYY-MM-DD HH24:MI:SS'), '9f2ec079-7d0f-4fe2-90ab-8b09a8302aba');
INSERT INTO "SYSTEM"."SYS_DEPARTMENT" VALUES ('fd1df42f71e74a3a9541dabc85175f4e', '1', '技术部', '秦树新', '1346585136', '2', 'a', null, '1', null, '3', TO_DATE('2016-10-29 13:37:06', 'YYYY-MM-DD HH24:MI:SS'), null, '0', null, null);

-- ----------------------------
-- Indexes structure for table SYS_DEPARTMENT
-- ----------------------------

-- ----------------------------
-- Checks structure for table SYS_DEPARTMENT
-- ----------------------------
ALTER TABLE "SYSTEM"."SYS_DEPARTMENT" ADD CHECK ("ID" IS NOT NULL);
ALTER TABLE "SYSTEM"."SYS_DEPARTMENT" ADD CHECK ("CREATIONTIME" IS NOT NULL);
ALTER TABLE "SYSTEM"."SYS_DEPARTMENT" ADD CHECK ("ISDELETED" IS NOT NULL);

-- ----------------------------
-- Primary Key structure for table SYS_DEPARTMENT
-- ----------------------------
ALTER TABLE "SYSTEM"."SYS_DEPARTMENT" ADD PRIMARY KEY ("ID");
