CREATE DATABASE HW12;

-- Use the DB wizard_schools_db for all the rest of the script
USE HW12;

-- Created the table "schools"
CREATE TABLE Department (
  id int AUTO_INCREMENT,
  name varchar(30),
  PRIMARY KEY(id)
);

CREATE TABLE Role (
  id int AUTO_INCREMENT,
  title varchar(30),
  salary decimal,
  department_id int not null,
  PRIMARY KEY(id)
);

CREATE TABLE Employee (
  id int AUTO_INCREMENT,
  first_name varchar(30),
  last_name varchar(30),
  role_id int not null,
  manager_id int,
  PRIMARY KEY(id)
);