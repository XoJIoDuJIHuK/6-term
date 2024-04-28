create table table_tests(
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    got_answer VARCHAR(50),
    success_rate number(10, 2),
    test_date timestamp
);
INSERT INTO table_tests (got_answer, success_rate, test_date)
VALUES ('{xd:kek}', 0.756, TO_DATE('2024-04-25', 'YYYY-MM-DD'));
INSERT INTO table_tests (got_answer, success_rate, test_date)
VALUES ('[lmao]', 0.223, TO_DATE('2024-04-24', 'YYYY-MM-DD'));
INSERT INTO table_tests (got_answer, success_rate, test_date)
VALUES ('{omega:[lul]}', 0.923, TO_DATE('2024-04-23', 'YYYY-MM-DD'));
INSERT INTO table_tests (got_answer, success_rate, test_date)
VALUES ('[]', 0.4567, TO_DATE('2024-04-22', 'YYYY-MM-DD'));
INSERT INTO table_tests (got_answer, success_rate, test_date)
VALUES ('[kek, 0]', 0.887, TO_DATE('2024-04-21', 'YYYY-MM-DD'));
select * from table_tests;

create table table_answers(
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    commentary VARCHAR(50),
    rigth_float number(10, 2),
    update_date timestamp
);
INSERT INTO table_answers (commentary, rigth_float, update_date)
VALUES ('todo: die', 0.85667, TO_DATE('2024-04-25', 'YYYY-MM-DD'));
INSERT INTO table_answers (commentary, rigth_float, update_date)
VALUES ('Needs improvement', 0.457, TO_DATE('2024-04-24', 'YYYY-MM-DD'));
INSERT INTO table_answers (commentary, rigth_float, update_date)
VALUES ('skill issue', 0.9578, TO_DATE('2024-04-23', 'YYYY-MM-DD'));
INSERT INTO table_answers (commentary, rigth_float, update_date)
VALUES ('Keep practicing', 0.51234, TO_DATE('2024-04-22', 'YYYY-MM-DD'));
INSERT INTO table_answers (commentary, rigth_float, update_date)
VALUES ('kys', 0.95325, TO_DATE('2024-04-21', 'YYYY-MM-DD'));

drop table table_tests;
drop table table_answers;

create or replace package lab_11 as
type test_for_export is record (
    got_answer VARCHAR(50),
    success_rate number(10, 2),
    test_date timestamp
);
type tests_for_export is table of test_for_export;
type answer_for_export is record (
    commentary VARCHAR(50),
    rigth_float number(10, 2),
    update_date timestamp
);
type answers_for_export is table of answer_for_export;
function ExportTests(StartDate timestamp, EndDate timestamp) return tests_for_export pipelined;
function ExportAnswers(StartDate timestamp, EndDate timestamp) return answers_for_export pipelined;
end;

create or replace package body lab_11 AS
    function ExportTests(StartDate timestamp, EndDate timestamp) return tests_for_export pipelined AS
    begin
        for rec in (select got_answer, success_rate, test_date from table_tests 
            where test_date between StartDate and EndDate) loop
            pipe row (rec);
        end loop;
    end;
    function ExportAnswers(StartDate timestamp, EndDate timestamp) return answers_for_export pipelined AS
    begin
        for rec in (select commentary, rigth_float, update_date from table_answers 
            where update_date between StartDate and EndDate) loop
            pipe row (rec);
        end loop;
    end;
end;

select * from table(lab_11.ExportTests(to_date('2024-01-01', 'YYYY-MM-DD'), to_date('2025-01-01', 'YYYY-MM-DD')));
select * from table(lab_11.ExportAnswers(to_date('2024-01-01', 'YYYY-MM-DD'), to_date('2025-01-01', 'YYYY-MM-DD')));

-- sqlldr system/Qwerty123@//dbuntu:1521/SEPDB CONTROL='D:\6-term\DB\labs\11\control_tests.ctl'
-- sqlldr system/Qwerty123@//dbuntu:1521/SEPDB CONTROL='D:\6-term\DB\labs\11\control_answers.ctl'