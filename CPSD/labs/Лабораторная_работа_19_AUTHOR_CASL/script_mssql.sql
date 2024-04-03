CREATE DATABASE [lab_19];
USE [lab_19];

CREATE TABLE [users] (
  [id] INT NOT NULL IDENTITY,
  [username] VARCHAR(16) NOT NULL,
  [email] VARCHAR(255) NULL,
  [password] VARCHAR(32) NOT NULL,
  [role] VARCHAR(5) NOT NULL CHECK ([role] IN ('user', 'admin')),
  PRIMARY KEY ([id]));

CREATE TABLE repos (
  [id] INT NOT NULL IDENTITY,
  [name] VARCHAR(255) NULL DEFAULT NULL,
  [authorId] INT NOT NULL,
  PRIMARY KEY ([id]),
  CONSTRAINT fk_repos_users
    FOREIGN KEY ([authorId])
    REFERENCES [users]([id])
    ON DELETE CASCADE);

CREATE TABLE commits (
  [id] INT NOT NULL IDENTITY,
  [repoId] INT NULL DEFAULT NULL,
  [message] VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY ([id]),
  CONSTRAINT fk_commits_repos
    FOREIGN KEY ([repoId])
    REFERENCES repos([id])
    ON DELETE CASCADE);