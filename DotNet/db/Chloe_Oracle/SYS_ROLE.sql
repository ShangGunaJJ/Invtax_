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

Date: 2016-12-11 15:17:39
*/


-- ----------------------------
-- Table structure for SYS_ROLE
-- ----------------------------
DROP TABLE "SYSTEM"."SYS_ROLE";
CREATE TABLE "SYSTEM"."SYS_ROLE" (
"ID" VARCHAR2(50 BYTE) NOT NULL ,
"ENCODE" VARCHAR2(50 BYTE) NULL ,
"NAME" VARCHAR2(50 BYTE) NULL ,
"SORTCODE" NUMBER(9) NULL ,
"ISENABLED" NUMBER(9) NULL ,
"DESCRIPTION" VARCHAR2(500 BYTE) NULL ,
"CREATIONTIME" DATE NULL ,
"CREATEUSERID" VARCHAR2(50 BYTE) NULL ,
"LASTMODIFYTIME" DATE NULL ,
"LASTMODIFYUSERID" VARCHAR2(50 BYTE) NULL ,
"ISDELETED" NUMBER(9) NULL ,
"DELETIONTIME" DATE NULL ,
"DELETEUSERID" VARCHAR2(500 BYTE) NULL 
)
LOGGING
NOCOMPRESS
NOCACHE

;

-- ----------------------------
-- Records of SYS_ROLE
-- ----------------------------
INSERT INTO "SYSTEM"."SYS_ROLE" VALUES ('2f0242ca3ed945b49599ce7da76a5a31', 'SysAdmin', '管理员', '1', '1', null, TO_DATE('2016-12-01 19:47:47', 'YYYY-MM-DD HH24:MI:SS'), '9f2ec0797d0f4fe290ab8b09a8302aba', null, null, '0', null, null);

-- ----------------------------
-- Indexes structure for table SYS_ROLE
-- ----------------------------

-- ----------------------------
-- Checks structure for table SYS_ROLE
-- ----------------------------
ALTER TABLE "SYSTEM"."SYS_ROLE" ADD CHECK ("ID" IS NOT NULL);

-- ----------------------------
-- Primary Key structure for table SYS_ROLE
-- ----------------------------
ALTER TABLE "SYSTEM"."SYS_ROLE" ADD PRIMARY KEY ("ID");
