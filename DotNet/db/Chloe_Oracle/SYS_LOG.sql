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

Date: 2016-12-11 15:16:56
*/


-- ----------------------------
-- Table structure for SYS_LOG
-- ----------------------------
DROP TABLE "SYSTEM"."SYS_LOG";
CREATE TABLE "SYSTEM"."SYS_LOG" (
"ID" NUMBER(9) NOT NULL ,
"USERID" VARCHAR2(50 BYTE) NULL ,
"REALNAME" NVARCHAR2(50) NULL ,
"TYPE" NUMBER(9) NOT NULL ,
"IP" NVARCHAR2(50) NULL ,
"IPADDRESS" NVARCHAR2(50) NULL ,
"MODULEID" NVARCHAR2(50) NULL ,
"MODULENAME" NVARCHAR2(50) NULL ,
"RESULT" NUMBER(9) NULL ,
"DESCRIPTION" NVARCHAR2(500) NULL ,
"CREATIONTIME" DATE NOT NULL 
)
LOGGING
NOCOMPRESS
NOCACHE

;

-- ----------------------------
-- Indexes structure for table SYS_LOG
-- ----------------------------

-- ----------------------------
-- Checks structure for table SYS_LOG
-- ----------------------------
ALTER TABLE "SYSTEM"."SYS_LOG" ADD CHECK ("ID" IS NOT NULL);
ALTER TABLE "SYSTEM"."SYS_LOG" ADD CHECK ("TYPE" IS NOT NULL);
ALTER TABLE "SYSTEM"."SYS_LOG" ADD CHECK ("CREATIONTIME" IS NOT NULL);

-- ----------------------------
-- Primary Key structure for table SYS_LOG
-- ----------------------------
ALTER TABLE "SYSTEM"."SYS_LOG" ADD PRIMARY KEY ("ID");

CREATE SEQUENCE "SYSTEM"."SYS_LOG_AUTOID"
 INCREMENT BY 1
 MINVALUE 1
 MAXVALUE 9999999999999999999999999999
 START WITH 1
 CACHE 20;
