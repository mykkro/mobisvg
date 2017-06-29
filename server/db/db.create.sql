-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema kote
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema kote
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `kote` DEFAULT CHARACTER SET utf8 ;
USE `kote` ;

-- -----------------------------------------------------
-- Table `kote`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kote`.`user` ;

CREATE TABLE IF NOT EXISTS `kote`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `nickname` VARCHAR(45) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `birthyear` INT NULL,
  `gender` VARCHAR(45) NULL,
  `eduyears` INT NULL,
  `notes` TEXT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nickname_UNIQUE` (`nickname` ASC),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kote`.`api_tokens`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kote`.`api_tokens` ;

CREATE TABLE IF NOT EXISTS `kote`.`api_tokens` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `token` VARCHAR(100) NULL,
  `created` DATETIME NULL,
  `expires` DATETIME NULL,
  PRIMARY KEY (`id`, `user_id`),
  INDEX `fk_apikeys_user1_idx` (`user_id` ASC),
  CONSTRAINT `fk_apikeys_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `kote`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kote`.`role`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kote`.`role` ;

CREATE TABLE IF NOT EXISTS `kote`.`role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kote`.`event_type`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kote`.`event_type` ;

CREATE TABLE IF NOT EXISTS `kote`.`event_type` (
  `id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kote`.`result`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kote`.`result` ;

CREATE TABLE IF NOT EXISTS `kote`.`result` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `total_time` TIME NULL,
  `correctness` FLOAT NULL,
  `playback` TEXT NULL,
  `details` TEXT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kote`.`game_type`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kote`.`game_type` ;

CREATE TABLE IF NOT EXISTS `kote`.`game_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kote`.`event`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kote`.`event` ;

CREATE TABLE IF NOT EXISTS `kote`.`event` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `datetime` DATETIME NULL,
  `details` TEXT NULL,
  `event_type_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `result_id` INT NOT NULL,
  `game_type_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_event_event_type1_idx` (`event_type_id` ASC),
  INDEX `fk_event_user1_idx` (`user_id` ASC),
  INDEX `fk_event_result1_idx` (`result_id` ASC),
  INDEX `fk_event_game_type1_idx` (`game_type_id` ASC),
  CONSTRAINT `fk_event_event_type1`
    FOREIGN KEY (`event_type_id`)
    REFERENCES `kote`.`event_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_event_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `kote`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_event_result1`
    FOREIGN KEY (`result_id`)
    REFERENCES `kote`.`result` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_event_game_type1`
    FOREIGN KEY (`game_type_id`)
    REFERENCES `kote`.`game_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kote`.`measure_type`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kote`.`measure_type` ;

CREATE TABLE IF NOT EXISTS `kote`.`measure_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `type` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kote`.`measure`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kote`.`measure` ;

CREATE TABLE IF NOT EXISTS `kote`.`measure` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `measure_type_id` INT NOT NULL,
  `result_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_measure_measure_type1_idx` (`measure_type_id` ASC),
  INDEX `fk_measure_result1_idx` (`result_id` ASC),
  CONSTRAINT `fk_measure_measure_type1`
    FOREIGN KEY (`measure_type_id`)
    REFERENCES `kote`.`measure_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_measure_result1`
    FOREIGN KEY (`result_id`)
    REFERENCES `kote`.`result` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kote`.`user_has_role`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kote`.`user_has_role` ;

CREATE TABLE IF NOT EXISTS `kote`.`user_has_role` (
  `user_id` INT NOT NULL,
  `role_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`),
  INDEX `fk_user_has_role_role1_idx` (`role_id` ASC),
  INDEX `fk_user_has_role_user_idx` (`user_id` ASC),
  CONSTRAINT `fk_user_has_role_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `kote`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_has_role_role1`
    FOREIGN KEY (`role_id`)
    REFERENCES `kote`.`role` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kote`.`game_type_has_measure_type`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kote`.`game_type_has_measure_type` ;

CREATE TABLE IF NOT EXISTS `kote`.`game_type_has_measure_type` (
  `game_type_id` INT NOT NULL,
  `measure_type_id` INT NOT NULL,
  PRIMARY KEY (`game_type_id`, `measure_type_id`),
  INDEX `fk_game_type_has_measure_type_measure_type1_idx` (`measure_type_id` ASC),
  INDEX `fk_game_type_has_measure_type_game_type1_idx` (`game_type_id` ASC),
  CONSTRAINT `fk_game_type_has_measure_type_game_type1`
    FOREIGN KEY (`game_type_id`)
    REFERENCES `kote`.`game_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_game_type_has_measure_type_measure_type1`
    FOREIGN KEY (`measure_type_id`)
    REFERENCES `kote`.`measure_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
