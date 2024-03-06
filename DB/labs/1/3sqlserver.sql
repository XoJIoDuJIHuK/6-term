-- Создать процедуру, которая отобразит все подчиненные узлы с указанием уровня иерархии 
-- (параметр – значение узла).
-- drop procedure GetSubordinates;
CREATE PROCEDURE GetSubordinates
    @StaffID INT
AS
BEGIN
    WITH SubordinatesCTE AS (
        SELECT
            ID,
            NAME,
            PRINCIPAL,
            0 AS Level
        FROM
            STAFF
        WHERE
            ID = @StaffID
        UNION ALL
        SELECT
            s.ID,
            s.NAME,
            s.PRINCIPAL,
            Level + 1
        FROM
            STAFF s
            INNER JOIN SubordinatesCTE cte ON s.PRINCIPAL = cte.ID
    )
    SELECT
        ID,
        NAME,
        PRINCIPAL,
        Level
    FROM
        SubordinatesCTE;
END;
go
-- Создать процедуру, которая добавит подчиненный узел (параметр – значение родительского узла).
CREATE PROCEDURE AddSubordinate
    @PrincipalID INT,
    @Name NVARCHAR(50)
AS
BEGIN
    INSERT INTO STAFF (NAME, PRINCIPAL, ROLE)
    VALUES (@Name, @PrincipalID, (SELECT ROLE FROM STAFF WHERE ID = @PrincipalID));
END;
go
-- Создать процедуру, которая переместит всех подчиненных (первый параметр – значение родительского узла, 
-- подчиненные которого будут перемещаться, второй параметр – значение нового родительского узла).
CREATE PROCEDURE MoveSubordinates
    @CurrentPrincipalID INT,
    @NewPrincipalID INT
AS
BEGIN
    UPDATE STAFF
    SET PRINCIPAL = @NewPrincipalID
    WHERE PRINCIPAL = @CurrentPrincipalID;
END;

select * from STAFF;
EXEC GetSubordinates @StaffID = 1;