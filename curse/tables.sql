create database xd;
go
use xd;
use master;
-- drop database xd;
go
select * from PROLETARIAT;
-- insert into PROLETARIAT (name, password_hash, is_admin, education_json, experience_json) values (N'adminxd', N'$2b$10$iujfXl.zABzRKFiRSkMl3.GH/MCgczusmhAq9V8Gi94KTd3jeRCd2', N'Y', '{}', '{}');
-- insert into BOURGEOISIE (name, password_hash) values ('admincumpany', N'$2b$10$iujfXl.zABzRKFiRSkMl3.GH/MCgczusmhAq9V8Gi94KTd3jeRCd2');
go
create table proletariat(
    id int IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(70) UNIQUE not null,
    PASSWORD_hash NVARCHAR(60) not null,
    is_admin char not null check (is_admin in ('Y', 'N')),
    education_json NVARCHAR(200) not null,
    experience_json NVARCHAR(500) not null
);
go
create table cvs(
    id int IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(30) not null,
    applicant int not null foreign key REFERENCES proletariat(id),
    skills_json NVARCHAR(100) not null
)
go
create table bourgeoisie(
    id int IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(70) UNIQUE not null,
    PASSWORD_hash NVARCHAR(60) not null,
);
go
create table vacancies(
    id int IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(30) UNIQUE not null,
    company int not null FOREIGN KEY REFERENCES bourgeoisie(id),
    min_salary INT not null check (min_salary >= 0),
    max_salary INT not null check (max_salary >= 0),
    region NVARCHAR(20),-- добавить ключевое слово "не имеет значения"
    schedule INT not null check (schedule between 1 and 5),--вахта, полный рабочий день, частичный рабочий день, фриланс, стажировка
    experience INT not null check (experience between 1 and 5),--не имеет значения, без опыта, 1-3, 3-6, 6+
    min_hours_per_day INT not null check (min_hours_per_day > 0),
    max_hours_per_day INT not null check (max_hours_per_day > 0),
    description NVARCHAR(1000) not null
);
go
create table responses(
    id int IDENTITY(1,1) PRIMARY KEY,
    cv int not null FOREIGN KEY REFERENCES cvs(id),
    [status] char(1) not null check ([status] in ('W', 'X', 'Y'))
);
GO
create table reviews(
    id int IDENTITY(1,1) PRIMARY KEY,
    [p_subject] int FOREIGN KEY REFERENCES proletariat(id),
    [b_subject] int FOREIGN KEY REFERENCES bourgeoisie(id),
    [p_object] int FOREIGN KEY REFERENCES bourgeoisie(id),
    [b_object] int FOREIGN KEY REFERENCES proletariat(id),
    [text] NVARCHAR(100),
    rating int check (rating BETWEEN 1 and 5),
    CONSTRAINT not_both_subjects check (p_subject is null or b_subject is null),
    CONSTRAINT not_both_objects check (p_object is null or b_object is null)
);
go
create table registration_requests(
    id int IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(70) not null,
    PASSWORD_hash NVARCHAR(256) not null,
    proofs VARBINARY(max)
);