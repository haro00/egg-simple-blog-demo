# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.19)
# ************************************************************


CREATE DATABASE IF NOT EXISTS blog
  DEFAULT CHARSET utf8
  COLLATE utf8_general_ci;

USE blog;


# Dump of table td_article
# ------------------------------------------------------------

CREATE TABLE `td_article` (
  `id` int(255) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `title` varchar(255) NOT NULL COMMENT '标题',
  `creator_id` int(10) NOT NULL COMMENT '作者id',
  `content` longtext NOT NULL COMMENT '内容',
  `editor` int(1) NOT NULL DEFAULT '0' COMMENT '0:markdown  1:html',
  `type_id` varchar(255) NOT NULL DEFAULT '1' COMMENT '分类',
  `intro` varchar(255) DEFAULT '' COMMENT '简介',
  `state` int(1) NOT NULL DEFAULT '1' COMMENT '-1:已删除, 0:私有, 1:公开',
  `views` int(10) NOT NULL DEFAULT '0' COMMENT '浏览量',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table td_role
# ------------------------------------------------------------

CREATE TABLE `td_role` (
  `id` int(4) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(16) NOT NULL DEFAULT '' COMMENT '名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table td_type
# ------------------------------------------------------------

CREATE TABLE `td_type` (
  `id` int(4) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(16) NOT NULL DEFAULT '' COMMENT '名称',
  PRIMARY KEY (`id`),
  KEY `index_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table td_user
# ------------------------------------------------------------

CREATE TABLE `td_user` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(16) NOT NULL DEFAULT '' COMMENT '用户名',
  `password` varchar(255) NOT NULL DEFAULT '' COMMENT '密码',
  `email` varchar(255) DEFAULT NULL COMMENT '邮箱',
  `tel` int(11) DEFAULT NULL COMMENT '手机号',
  `role_id` int(10) NOT NULL DEFAULT '3' COMMENT '角色id',
  `token` varchar(255) DEFAULT NULL COMMENT 'token',
  `expiration` bigint(16) DEFAULT '0' COMMENT 'token有效时间',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `status` int(1) NOT NULL DEFAULT '1' COMMENT '1: 正常',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
