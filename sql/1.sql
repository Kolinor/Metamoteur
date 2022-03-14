CREATE TABLE `Metamoteur`.`sites` ( `site_id` INT NOT NULL AUTO_INCREMENT , `domaine` VARCHAR(100) NOT NULL , `ipv4` BOOLEAN NOT NULL , `ipv6` BOOLEAN NOT NULL , `transition` TIMESTAMP NOT NULL , `creation_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`site_id`)) ENGINE = InnoDB;