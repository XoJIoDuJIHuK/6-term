-- Создать процедуру, которая отобразит все подчиненные узлы с указанием уровня иерархии 
-- (параметр – значение узла).
-- drop procedure GetSubordinates;
CREATE PROCEDURE GetSubordinates
    @parentNode hierarchyid
AS
BEGIN
    WITH ChildNodes_CTE AS
    (
        SELECT
            NODE,
            NAME,
            LEVEL
        FROM
            STAFF
        WHERE
            NODE.IsDescendantOf(@parentNode) = 1
    )
    SELECT
        NODE.ToString() AS NodePath,
        NAME,
        LEVEL
    FROM
        ChildNodes_CTE
    ORDER BY
        NODE;
END;
go
-- Создать процедуру, которая добавит подчиненный узел (параметр – значение родительского узла).
drop PROCEDURE AddSubordinate;
go
CREATE PROCEDURE AddSubordinate
    @parentNode hierarchyid,
    @Name NVARCHAR(50),
    @Role int
AS
BEGIN
    DECLARE @childNode hierarchyid;
    set @childNode = dbo.GetLastDescendant(@parentNode);
    INSERT INTO STAFF (NODE, NAME, ROLE) values (@parentNode.GetDescendant(@childNode, null), @Name, @Role);
END;
go
-- Создать процедуру, которая переместит всех подчиненных (первый параметр – значение родительского узла, 
-- подчиненные которого будут перемещаться, второй параметр – значение нового родительского узла).
drop PROCEDURE MoveSubordinates;
go
CREATE PROCEDURE MoveSubordinates
    @oldParent HIERARCHYID,
    @newParent HIERARCHYID
AS
BEGIN
    declare @child HIERARCHYID, @lastchild HIERARCHYID;
    declare rowstomove cursor for select node from staff where node.IsDescendantOf(@oldParent) = 1 and 
        level = (select level from staff where node = @oldParent) + 1;
    open rowstomove;
    fetch next from rowstomove into @child;
    set @lastchild = dbo.GetLastDescendant(@newParent);
    while @@FETCH_STATUS = 0
    BEGIN
        set @lastchild = @newParent.GetDescendant(@lastchild, null);
        update staff set node = @lastchild where node = @child;
        fetch next from rowstomove into @child;
    end;
    close rowstomove;
    deallocate rowstomove;
END;
go
drop function GetLastDescendant;
go
create function GetLastDescendant(@parentNode HIERARCHYID) RETURNS HIERARCHYID AS
BEGIN
    return (select top 1 node from staff where node.IsDescendantOf(@parentNode) = 1 and 
        level = (select level from staff where node = @parentNode) + 1 order by node desc);
end;
go
select NODE.ToString(), level, name, role from STAFF;
delete staff where name = N'xd';

declare @root HIERARCHYID = (select node from staff where name = N'Big Boss'), 
    @oldParent hierarchyid = (SELECT node from staff where name = N'dev_manager1'),
    @newParent hierarchyid = (SELECT node from staff where name = N'xd');
-- EXEC GetSubordinates @parentNode = @root;
-- EXEC AddSubordinate @parentNode = @oldParent, @Name = N'xd1', @Role = 2;
EXEC MoveSubordinates @oldParent = @oldParent, @newParent = @newParent;