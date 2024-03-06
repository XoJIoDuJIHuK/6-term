select DB_NAME();
create database SEPDB;
use SEPDB;

begin transaction;
CREATE TABLE ROLES (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    NAME NVARCHAR(50) UNIQUE NOT NULL
);
go

CREATE TABLE STAFF (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    NAME NVARCHAR(50) UNIQUE NOT NULL,
    PRINCIPAL INT,
    ROLE INT NOT NULL,
    CONSTRAINT FK_STAFF_PRINCIPAL FOREIGN KEY (PRINCIPAL) REFERENCES STAFF(ID),
    CONSTRAINT FK_STAFF_ROLE FOREIGN KEY (ROLE) REFERENCES ROLES(ID)
);
go

CREATE TABLE TEST_DATA (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    GEO_DATA GEOMETRY,
    JSON_DATA NVARCHAR(1000)
);
go

CREATE TABLE COMMITS (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    DEVELOPER INT NOT NULL,
    COMMIT_DATE DATETIME NOT NULL,
    CONSTRAINT FK_COMMITS_DEVELOPER FOREIGN KEY (DEVELOPER) REFERENCES STAFF(ID)
);
go

CREATE TABLE TESTS (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    TESTER INT NOT NULL,
    COMMIT_ID INT NOT NULL,
    DATA_ID INT NOT NULL,
    PASSED CHAR(1) NOT NULL CHECK (PASSED IN ('Y', 'N')),
    CONSTRAINT FK_TESTS_TESTER FOREIGN KEY (TESTER) REFERENCES STAFF(ID),
    CONSTRAINT FK_TESTS_COMMIT FOREIGN KEY (COMMIT_ID) REFERENCES COMMITS(ID),
    CONSTRAINT FK_TESTS_DATA FOREIGN KEY (DATA_ID) REFERENCES TEST_DATA(ID)
);
commit;

begin transaction;
CREATE VIEW vw_StaffRoles AS 
    SELECT s.ID AS StaffID, s.NAME AS StaffName, r.ID AS RoleID, r.NAME AS RoleName
    FROM STAFF s INNER JOIN ROLES r ON s.ROLE = r.ID;
GO
CREATE VIEW vw_StaffCommits AS
    SELECT s.ID AS StaffID, s.NAME AS StaffName, c.ID AS CommitID, c.COMMIT_DATE AS CommitDate
    FROM STAFF s INNER JOIN COMMITS c ON s.ID = c.DEVELOPER;
GO
CREATE INDEX idx_StaffRoles_RoleID ON STAFF (ROLE);
GO
CREATE INDEX idx_StaffCommits_DeveloperID ON COMMITS (DEVELOPER);
GO
CREATE INDEX idx_Tests_TesterID ON TESTS (TESTER);
CREATE INDEX idx_Tests_CommitID ON TESTS (COMMIT_ID);
CREATE INDEX idx_Tests_DataID ON TESTS (DATA_ID);
GO
CREATE FUNCTION get_average_passed_tests()
RETURNS FLOAT
AS
BEGIN
    DECLARE @avg_passed_tests FLOAT;
    DECLARE @all_tests FLOAT;
    DECLARE @all_passed_tests FLOAT;
    
    SELECT @all_passed_tests = CAST(COUNT(*) AS FLOAT)
    FROM TESTS WHERE PASSED = 'Y';
    SELECT @all_tests = CAST(COUNT(*) AS FLOAT)
    FROM TESTS;
    SELECT @avg_passed_tests = @all_passed_tests / @all_tests;
    
    RETURN @avg_passed_tests;
END;
GO
CREATE FUNCTION get_median_passed_tests()
RETURNS FLOAT
AS
BEGIN
    DECLARE @median_passed_tests FLOAT;
    
    WITH ordered_tests AS (
        SELECT COUNT(*) AS passed_tests, ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) AS rn
        FROM TESTS
        WHERE PASSED = 'Y'
        GROUP BY TESTER
    )
    SELECT @median_passed_tests = AVG(passed_tests)
    FROM ordered_tests
    WHERE rn IN (FLOOR((SELECT COUNT(*) FROM ordered_tests) / 2) + 1, CEILING((SELECT COUNT(*) FROM ordered_tests) / 2));

    RETURN @median_passed_tests;
END;
GO
CREATE FUNCTION get_worst_tester()
RETURNS VARCHAR(100)
AS
BEGIN
    DECLARE @tester_in_question INT;
    
    SELECT @tester_in_question = TESTER
    FROM (
        SELECT TOP 1 TESTER, ((SELECT COUNT(*) FROM TESTS WHERE TESTER = TESTER AND PASSED = 'Y') * 1.0 / (SELECT COUNT(*) FROM TESTS WHERE TESTER = t.TESTER)) AS pass_percentage
        FROM TESTS t
        WHERE PASSED = 'Y'
        GROUP BY TESTER
        ORDER BY pass_percentage ASC
    ) AS subquery;

    RETURN @tester_in_question;
END;
GO
commit;
go
create PROCEDURE create_test_data (@gd GEOMETRY, @jd NVARCHAR(1000)) AS
BEGIN
    insert into TEST_DATA (GEO_DATA, JSON_DATA) values (@gd, @jd);
END;
go
create PROCEDURE create_test (@tes INT, @com INT, @dat INT, @pas CHAR) AS
BEGIN
    insert into TESTS (TESTER, COMMIT_ID, DATA_ID, PASSED) values (@tes, @com, @dat, @pas);
END;
go
create PROCEDURE fire_staff (@sid INT) AS
BEGIN
    DECLARE @fitting_count INT = 0;
    DECLARE @principal_id INT = null;
    SET @fitting_count = (select count(*) from STAFF where ID = @sid);
    SET @principal_id = (select PRINCIPAL from STAFF where ID = @sid);
    IF @fitting_count = 0 OR @principal_id IS NULL
        return;
    update STAFF set PRINCIPAL = @principal_id where PRINCIPAL = @sid;
    delete STAFF where ID = @sid;
END