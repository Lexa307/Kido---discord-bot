create database if not exists kidoDB;
use kidoDB;
create table if not exists users (
	`id` varchar(255) not null,-- discord userid 
    `money` int default 0,
    `description` varchar(255), -- user descibes yourself  
	`voicem` int default 0,-- counts in minutes how long user was in voice chat  this time rows can be merged in 1 row
    `voiceh` int default 0, -- counts in hours how long user was in voice chat
	`private` json, -- users roles on server 
    `uses` json, -- what user already used
    `inventory` json, -- users inventory
    `gifts` int default 0,-- count of gifts  
    `messages` int default 0, -- count of user messages 
   PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table if not exists shop (
	`itemid` int auto_increment,
	`item` varchar(255) not null,
    `price` int not null,
    PRIMARY KEY (`itemid`)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;
insert into shop(item, price) values('elite',255);
insert into shop(item, price) values('private_3',50);
insert into shop(item, price) values('private_5',70);
insert into shop(item, price) values('private_7',100);