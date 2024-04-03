CREATE SCHEMA `lab_19` ;
USE `lab_19` ;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(16) NOT NULL,
  `email` VARCHAR(255) NULL,
  `password` VARCHAR(32) NOT NULL,
  `role` VARCHAR(5) NOT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE IF NOT EXISTS `repos` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  `authorId` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_repos_users`
    FOREIGN KEY (`authorId`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION);

CREATE TABLE IF NOT EXISTS `commits` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `repoId` INT(11) NULL DEFAULT NULL,
  `message` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_commits_repos`
    FOREIGN KEY (`repoId`)
    REFERENCES `repos` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
    
DELIMITER $$
CREATE TRIGGER `trig_check` BEFORE INSERT ON `users` 
	FOR EACH ROW 
    BEGIN 
		IF NEW.`role` NOT IN ('usr', 'admin') THEN 
			SET NEW.`role` = 'user';
		END IF;
    END $$
DELIMITER ;