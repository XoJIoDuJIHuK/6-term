-- Создать процедуру, которая отобразит все подчиненные узлы с указанием уровня иерархии 
-- (параметр – значение узла).
DROP PROCEDURE GetSubordinates;

CREATE OR REPLACE PROCEDURE GetSubordinatesRecursive(
        p_StaffID IN NUMBER,
        p_Level IN NUMBER
    )
    IS
    BEGIN
        FOR c IN (
            SELECT
                s.ID,
                s.NAME,
                s.PRINCIPAL
            FROM
                STAFF s
            WHERE
                s.PRINCIPAL = p_StaffID
        )
        LOOP
            DBMS_OUTPUT.PUT_LINE('ID: ' || c.ID || ', NAME: ' || c.NAME || ', PRINCIPAL: ' || c.PRINCIPAL || ', LEVEL: ' || p_Level);
            GetSubordinatesRecursive(c.ID, p_Level + 1);
        END LOOP;
    END;
CREATE OR REPLACE PROCEDURE GetSubordinates(
    p_StaffID IN NUMBER
)
AS
    EMPLOYEE_NAME NVARCHAR2(50);
    PRINCIPAL_ID INT;
    PRINCIPAL_NAME NVARCHAR2(50);
BEGIN
    SELECT STAFF."NAME" INTO EMPLOYEE_NAME FROM STAFF WHERE ID = p_StaffID;
    SELECT PRINCIPAL INTO PRINCIPAL_ID FROM STAFF WHERE ID = p_StaffID;
    BEGIN
        SELECT "NAME" INTO PRINCIPAL_NAME FROM STAFF WHERE ID = PRINCIPAL_ID;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            PRINCIPAL_NAME := NULL;
    END;
    DBMS_OUTPUT.PUT_LINE('ID: ' || p_StaffID || ', NAME: ' || EMPLOYEE_NAME || ', PRINCIPAL: ' || PRINCIPAL_NAME || ', LEVEL: 0');
    GetSubordinatesRecursive(p_StaffID, 1);
END;

-- Создать процедуру, которая добавит подчиненный узел (параметр – значение родительского узла).
CREATE OR REPLACE PROCEDURE AddSubordinate(
    p_PrincipalID IN NUMBER,
    p_Name IN NVARCHAR2
)
AS
BEGIN
    INSERT INTO STAFF (NAME, PRINCIPAL, ROLE)
        VALUES (p_Name, p_PrincipalID, (SELECT ROLE FROM STAFF WHERE ID = p_PrincipalID));
END;

-- Создать процедуру, которая переместит всех подчиненных (первый параметр – значение родительского узла, 
-- подчиненные которого будут перемещаться, второй параметр – значение нового родительского узла).
CREATE OR REPLACE PROCEDURE MoveSubordinates(
    p_CurrentPrincipalID IN NUMBER,
    p_NewPrincipalID IN NUMBER
)
AS
BEGIN
    UPDATE STAFF
    SET PRINCIPAL = p_NewPrincipalID
    WHERE PRINCIPAL = p_CurrentPrincipalID;
END;

select * from STAFF;
BEGIN
    GETSUBORDINATES(P_STAFFID  => 1 /*IN NUMBER*/);
END;

BEGIN
    ADDSUBORDINATE(P_PRINCIPALID  => 102 /*IN NUMBER*/,
                   P_NAME  => 'TEST_SUBORDINATE' /*IN NVARCHAR2*/);
END;
delete from STAFF where NAME = 'TEST_SUBORDINATE';

BEGIN
    MOVESUBORDINATES(P_CURRENTPRINCIPALID  => 102 /*IN NUMBER*/,
                     P_NEWPRINCIPALID  => 1 /*IN NUMBER*/);
END;

SELECT level, id, name, PRINCIPAL
FROM STAFF
START WITH PRINCIPAL is null
CONNECT BY PRIOR id = PRINCIPAL
ORDER BY name;

insert into STAFF (NAME, PRINCIPAL, ROLE) values ('TEST', NULL, 1);