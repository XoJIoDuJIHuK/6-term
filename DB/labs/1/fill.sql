insert into ROLES (NAME) values ('Tech Lead');
insert into ROLES (NAME) values ('Dev manager');
insert into ROLES (NAME) values ('Tester manager');
insert into ROLES (NAME) values ('Developer');
insert into ROLES (NAME) values ('Tester');
select * from Roles;
select * from staff;
select * from commits;
select * from test_data;
select * from tests;

drop table tests;
drop table test_data;
drop table commits;
drop table staff;

insert into STAFF (NAME, PRINCIPAL, ROLE) values ('supreme leader', null, 1);
go
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('dev_manager1', 1, 2);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('dev_manager2', 1, 2);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('tester_manager1', 1, 3);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('tester_manager2', 1, 3);
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
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('tester 1', 4, 5);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('tester 2', 4, 5);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('tester 3', 4, 5);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('tester 4', 4, 5);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('tester 5', 4, 5);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('tester 6', 5, 5);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('tester 7', 5, 5);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('tester 8', 5, 5);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('tester 9', 5, 5);
insert into STAFF (NAME, PRINCIPAL, ROLE) values ('tester 10', 5, 5);
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

INSERT INTO test_data (JSON_DATA, GEO_DATA) VALUES ('{"xd":"lmao"}', SDO_GEOMETRY(2001, NULL, SDO_POINT_TYPE(1, 1, NULL), NULL, NULL));
INSERT INTO test_data (JSON_DATA, GEO_DATA) VALUES ('[]', SDO_GEOMETRY(2002, NULL, SDO_POINT_TYPE(1, 1, NULL), NULL, NULL));
INSERT INTO test_data (JSON_DATA, GEO_DATA) VALUES ('{"kek":[1,2,3]}', SDO_GEOMETRY(2003, NULL, SDO_POINT_TYPE(1, 1, NULL), NULL, NULL));
