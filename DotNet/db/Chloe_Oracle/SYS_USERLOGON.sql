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

Date: 2016-12-11 15:18:14
*/


-- ----------------------------
-- Table structure for SYS_USERLOGON
-- ----------------------------
DROP TABLE "SYSTEM"."SYS_USERLOGON";
CREATE TABLE "SYSTEM"."SYS_USERLOGON" (
"ID" VARCHAR2(50 BYTE) NOT NULL ,
"USERID" VARCHAR2(50 BYTE) NULL ,
"USERPASSWORD" VARCHAR2(50 BYTE) NULL ,
"USERSECRETKEY" VARCHAR2(50 BYTE) NULL ,
"PREVIOUSVISITTIME" DATE NULL ,
"LASTVISITTIME" DATE NULL ,
"LOGONCOUNT" NUMBER NOT NULL 
)
LOGGING
NOCOMPRESS
NOCACHE

;

-- ----------------------------
-- Records of SYS_USERLOGON
-- ----------------------------
INSERT INTO "SYSTEM"."SYS_USERLOGON" VALUES ('9f2ec0797d0f4fe290ab8b09a8302aba', '9f2ec0797d0f4fe290ab8b09a8302aba', '0a119d93650ee6fd68aed4b0a9574855', '4b871e9d5bd683b7', TO_DATE('2016-12-10 23:52:08', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2016-12-10 23:56:08', 'YYYY-MM-DD HH24:MI:SS'), '222');

-- ----------------------------
-- Indexes structure for table SYS_USERLOGON
-- ----------------------------

-- ----------------------------
-- Checks structure for table SYS_USERLOGON
-- ----------------------------
ALTER TABLE "SYSTEM"."SYS_USERLOGON" ADD CHECK ("ID" IS NOT NULL);
ALTER TABLE "SYSTEM"."SYS_USERLOGON" ADD CHECK ("LOGONCOUNT" IS NOT NULL);

-- ----------------------------
-- Primary Key structure for table SYS_USERLOGON
-- ----------------------------
ALTER TABLE "SYSTEM"."SYS_USERLOGON" ADD PRIMARY KEY ("ID");
