SELECT sys_context('USERENV', 'CON_NAME') FROM dual;
select * from dba_pdbs;
select * from USER_TABLES;

CREATE TABLESPACE DB_TBS DATAFILE 'DB_TBS.dbf' SIZE 4M AUTOEXTEND ON;

CREATE TABLE ROLES (
    ID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    NAME NVARCHAR2(50) UNIQUE NOT NULL
) TABLESPACE DB_TBS;

SELECT * FROM STAFF;
CREATE TABLE STAFF (
    ID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    NAME NVARCHAR2(50) UNIQUE NOT NULL,
    PRINCIPAL INT,
    ROLE INT NOT NULL,
    CONSTRAINT FK_STAFF_PRINCIPAL FOREIGN KEY (PRINCIPAL) REFERENCES STAFF(ID),
    CONSTRAINT FK_STAFF_ROLE FOREIGN KEY (ROLE) REFERENCES ROLES(ID)
) TABLESPACE DB_TBS;

CREATE TABLE TEST_DATA (
    ID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    GEO_DATA SDO_GEOMETRY,
    JSON_DATA NVARCHAR2(1000)
) TABLESPACE DB_TBS;

SELECT * FROM COMMITS;
CREATE TABLE COMMITS (
    ID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    DEVELOPER INT NOT NULL,
    COMMIT_DATE TIMESTAMP NOT NULL,
    CONSTRAINT FK_COMMITS_DEVELOPER FOREIGN KEY (DEVELOPER) REFERENCES STAFF(ID)
) TABLESPACE DB_TBS;

SELECT * FROM TESTS;
CREATE TABLE TESTS (
    ID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    TESTER INT NOT NULL,
    COMMIT INT NOT NULL,
    DATA_ID INT NOT NULL,
    PASSED CHAR(1) NOT NULL CHECK (PASSED IN ('Y', 'N')),
    CONSTRAINT FK_TESTS_TESTER FOREIGN KEY (TESTER) REFERENCES STAFF(ID),
    CONSTRAINT FK_TESTS_COMMIT FOREIGN KEY (COMMIT) REFERENCES COMMITS(ID),
    CONSTRAINT FK_TESTS_DATA FOREIGN KEY (DATA_ID) REFERENCES TEST_DATA(ID)
) TABLESPACE DB_TBS;

commit;

CREATE VIEW vw_StaffRoles AS
SELECT
    s.ID AS StaffID,
    s.NAME AS StaffName,
    r.ID AS RoleID,
    r.NAME AS RoleName
FROM
    STAFF s
    INNER JOIN ROLES r ON s.ROLE = r.ID;
    
CREATE VIEW vw_StaffCommits AS
SELECT
    s.ID AS StaffID,
    s.NAME AS StaffName,
    c.ID AS CommitID,
    c.COMMIT_DATE AS CommitDate
FROM
    STAFF s
    INNER JOIN COMMITS c ON s.ID = c.DEVELOPER;

CREATE INDEX idx_StaffRoles_RoleID ON STAFF (ROLE);

CREATE INDEX idx_StaffCommits_DeveloperID ON COMMITS (DEVELOPER);

CREATE INDEX idx_Tests_TesterID ON TESTS (TESTER);
CREATE INDEX idx_Tests_CommitID ON TESTS (COMMIT);
CREATE INDEX idx_Tests_DataID ON TESTS (DATA_ID);

CREATE OR REPLACE FUNCTION get_average_passed_tests
RETURN NUMBER
IS
    avg_passed_tests NUMBER;
BEGIN
    SELECT AVG(COUNT(*)) INTO avg_passed_tests
    FROM TESTS
    WHERE PASSED = 'Y';
    
    RETURN avg_passed_tests;
END;

CREATE OR REPLACE FUNCTION get_median_passed_tests
RETURN NUMBER
IS
    median_passed_tests NUMBER;
BEGIN
    WITH ordered_tests AS (
        SELECT COUNT(*) AS passed_tests, ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) AS rn
        FROM TESTS
        WHERE PASSED = 'Y'
        GROUP BY TESTER
    )
    SELECT AVG(passed_tests) INTO median_passed_tests
    FROM ordered_tests
    WHERE rn IN (FLOOR((SELECT COUNT(*) FROM ordered_tests) / 2) + 1, CEIL((SELECT COUNT(*) FROM ordered_tests) / 2));

    RETURN median_passed_tests;
END;

CREATE OR REPLACE FUNCTION get_worst_tester
RETURN NUMBER
IS
    tester_in_question NUMBER;
BEGIN
    SELECT TESTER INTO tester_in_question
    FROM (
        SELECT TESTER, ((SELECT COUNT(*) FROM TESTS WHERE TESTER = t.TESTER AND t.PASSED = 'Y') / (SELECT COUNT(*) FROM TESTS WHERE TESTER = t.TESTER)) AS pass_percentage
        FROM TESTS t
        WHERE PASSED = 'Y'
        GROUP BY TESTER
        ORDER BY pass_percentage ASC
    ) WHERE ROWNUM = 1;

    RETURN tester_in_question;
END;
commit;

create or replace PROCEDURE create_test_data (gd SDO_GEOMETRY, jd NVARCHAR2) AS
BEGIN
    insert into TEST_DATA (GEO_DATA, JSON_DATA) values (gd, jd);
END;
create or replace PROCEDURE create_test (tes INT, com INT, dat INT, pas CHAR) AS
BEGIN
    insert into TESTS (TESTER, COMMIT, DATA_ID, PASSED) values (tes, com, dat, pas);
END;
create or replace PROCEDURE fire_staff (sid INT) AS
    fitting_count INT := 0;
    principal_id INT := null;
BEGIN
    select count(*) into fitting_count from STAFF where ID = sid;
    select PRINCIPAL into principal_id from STAFF where ID = sid;
    IF fitting_count = 0 OR principal_id IS NULL THEN
        return;
    END IF;
    update STAFF set PRINCIPAL = principal_id where PRINCIPAL = sid;
    delete STAFF where ID = sid;
END;
commit;


select * from STAFF;
select * from commits;
select * from tests;
select * from test_data;

declare point SDO_GEOMETRY;
begin
point := SDO_GEOMETRY(2001, NULL, SDO_POINT_TYPE(3, 56, null), NULL, NULL);
insert into TEST_DATA (JSON_DATA, GEO_DATA) values ('{"xd":"kek"}', point);
point := SDO_GEOMETRY(2001, NULL, SDO_POINT_TYPE(4, 57, null), NULL, NULL);
insert into TEST_DATA (JSON_DATA, GEO_DATA) values ('{"lmao":"lul"}', point);
point := SDO_GEOMETRY(2001, NULL, SDO_POINT_TYPE(5, 58, null), NULL, NULL);
insert into TEST_DATA (JSON_DATA, GEO_DATA) values ('{"googoo":"gaga"}', point);
end;