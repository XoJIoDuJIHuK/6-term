insert into ROLES (NAME) values ('Tech Lead');
insert into ROLES (NAME) values ('Dev manager');
insert into ROLES (NAME) values ('Tester manager');
insert into ROLES (NAME) values ('Developer');
insert into ROLES (NAME) values ('Tester');
select * from Roles;


insert into STAFF (NAME, PRINCIPAL, ROLE) values ('supreme leader', null, 1);
go
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('manager 1', 1, 2);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('manager 2', 1, 2);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('manager 3', 1, 3);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('manager 4', 1, 3);
go
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('developer 1', 2, 4);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('developer 2', 2, 4);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('developer 3', 2, 4);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('developer 4', 2, 4);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('developer 5', 2, 4);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('developer 6', 3, 4);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('developer 7', 3, 4);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('developer 8', 3, 4);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('developer 9', 3, 4);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('developer 10', 3, 4);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('tester 11', 4, 5);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('tester 12', 4, 5);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('tester 13', 4, 5);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('tester 14', 4, 5);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('tester 15', 4, 5);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('tester 16', 5, 5);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('tester 17', 5, 5);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('tester 18', 5, 5);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('tester 19', 5, 5);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('tester 20', 5, 5);
commit;

-- DECLARE
--     v_name NVARCHAR2(50);
--     v_principal NUMBER;
--     v_role INT;
-- BEGIN
--     DBMS_OUTPUT.PUT_LINE('Xd');
--     FOR i IN 0..3 LOOP
--         FOR j IN 0..4 LOOP
--             v_name := CASE WHEN i < 2 THEN 'developer' ELSE 'tester' END || ' ' || (i * 4 + j);
--             v_principal := i + 2;
--             v_role := 4 + FLOOR(i / 2);
--             DBMS_OUTPUT.PUT_LINE('v_name ' || v_name || ' v_principal ' || v_principal || ' v_role ' || v_role);
--             INSERT INTO STAFF (NAME, PRINCIPAL, ROLE) VALUES (v_name, v_principal, v_role);
--         END LOOP;
--     END LOOP;
--     COMMIT;
-- END;
select * from STAFF;

BEGIN
    EXEC AddSubordinate 1, 'xd';
END;
delete STAFF where NAME = 'xd';

BEGIN
    EXEC GetSubordinates 1;
END;