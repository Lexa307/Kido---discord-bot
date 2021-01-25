create database if not exists kidoDB;
use kidoDB;
create table if not exists kidoDB.users (
	`id` varchar(255) not null,-- discord userid 
    `money` int default 0,
    `description` varchar(255), -- user descibes yourself  
	`voicem` int default 0,-- counts in minutes how long user was in voice chat  this time rows can be merged in 1 row
    `voiceh` int default 0, -- counts in hours how long user was in voice chat
	`private` json, -- users roles on server 
    `uses` json, -- what  ations user already used
    `inventory` json, -- users inventory
    `gifts` int default 0,-- count of gifts  
    `messages` int default 0, -- count of user messages 
   PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table if not exists kidoDB.item ( -- shop of ability setup private role
	`id` int auto_increment,
    `type` varchar(30) not null,
	`name` varchar(255) not null,
    `description` varchar(255) not null,
    `value` VARCHAR (255) DEFAULT NULL, 
    `onUse` VARCHAR (255) DEFAULT NULL, 
    PRIMARY KEY (`id`), INDEX (`name`)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table if not exists kidoDB.shop ( -- shop of ability setup private role
	`itemid` int not null,
    `price` int not null,
    FOREIGN KEY (`itemid`)
    REFERENCES kidoDB.item (`id`) ON DELETE CASCADE
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;

DELIMITER $$
CREATE PROCEDURE add_user(in userid VARCHAR(255) )
BEGIN
    INSERT INTO users (id, uses, inventory, private) VALUES (userid, '{"hug": 0, "kiss": 0, "bite": 0, "pat": 0, "smoke": 0, "beer": 0, "rip": 0, "shot": 0, "poke": 0, "slap": 0, "lick": 0, "coffee": 0, "sad": 0, "sex": 0 }','{}','{}');
END $$
DELIMITER ;

insert into item(type, name, description, value) values('role', 'elite', 'Элитная роль сервера', '742535740847685653');
insert into shop(itemid, price) values(1, 250);