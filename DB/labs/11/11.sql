drop function ExportCommits;
drop function ExportTests;
go
CREATE FUNCTION ExportAnswers(@StartDate DATETIME, @EndDate DATETIME)
    RETURNS TABLE AS RETURN (select comment, rigth_float, update_date from table_answers 
    where update_date BETWEEN @StartDate and @EndDate);
go
CREATE FUNCTION ExportTests(@StartDate DATETIME, @EndDate DATETIME)
    RETURNS TABLE AS RETURN (select got_answer, success_rate, test_date from table_tests 
    where test_date BETWEEN @StartDate and @EndDate);
go
use sepdb;
SELECT * FROM ExportTests('2023-01-01', '2024-02-01');


drop table table_tests;
drop table table_answers;

create table table_tests(
    id int IDENTITY (1,1) PRIMARY KEY,
    got_answer NVARCHAR(50),
    success_rate FLOAT,
    test_date datetime
);
INSERT INTO table_tests (got_answer, success_rate, test_date)
VALUES
    ('{xd:kek}', 0.75, '2024-04-25'),
    ('[lmao]', 0.2, '2024-04-24'),
    ('{omega:[lul]}', 0.9, '2024-04-23'),
    ('[]', 0.4, '2024-04-22'),
    ('[kek, 0]', 0.8, '2024-04-21');

create table table_answers(
    id int IDENTITY (1,1) PRIMARY KEY,
    comment NVARCHAR(50),
    rigth_float FLOAT,
    update_date datetime
);
INSERT INTO table_answers (comment, rigth_float, update_date)
VALUES
    ('todo: die', 0.8, '2024-04-25'),
    ('Needs improvement', 0.4, '2024-04-24'),
    ('skill issue', 0.9, '2024-04-23'),
    ('Keep practicing', 0.5, '2024-04-22'),
    ('kys', 0.95, '2024-04-21');