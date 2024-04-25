set serveroutput on;

CREATE OR REPLACE TYPE answer_type_9 AS OBJECT (
  id           NUMBER,
  test_data    NUMBER,
  answer nvarchar2(50),
  CONSTRUCTOR FUNCTION answer_type_9(SELF IN OUT NOCOPY answer_type_9, test_data NUMBER, answer nvarchar2) 
    return self as result
);

CREATE OR REPLACE TYPE BODY answer_type_9 AS
  CONSTRUCTOR FUNCTION answer_type_9(test_data NUMBER, answer nvarchar2) 
    return self as result IS
  BEGIN
    SELF.test_data := test_data;
    SELF.answer := answer;
    return;
  END;
END;

create or REPLACE type array_of_answers is VARRAY(7) of answer_type_9;

drop table tests_9;
drop type array_of_tests;
drop type table_of_tests;
drop type test_type_9;
CREATE OR REPLACE TYPE test_type_9 AS OBJECT (
  id           NUMBER,
  tester       NUMBER,
  test_data    NUMBER,
  commit       NUMBER,
  got_answers array_of_answers,
  map member function get_id return number
);

CREATE OR REPLACE TYPE BODY test_type_9 AS
  map member function get_id return number is
  begin
    return id;
  end get_id;
END;


create type table_of_tests is table of test_type_9;
create type array_of_tests is VARRAY(7) of test_type_9;
create table tests_9(tests_table_column table_of_tests) NESTED TABLE tests_table_column store as tests_table_of_tests_tab;

DECLARE
  table_xd table_of_tests;
  item_1 test_type_9;
  item_2 test_type_9;
  item_3 test_type_9;
  item_4 test_type_9;
  answer_1 answer_type_9;
  answer_2 answer_type_9;
  answer_3 answer_type_9;
  is_member BOOLEAN;
BEGIN
  answer_1 := answer_type_9(1, 1, 'zxc');
  answer_2 := answer_type_9(2, 2, 'asd');
  answer_3 := answer_type_9(3, 3, 'qwe');
  item_1 := test_type_9(1404, 20, 3, 468, array_of_answers(answer_1));
  item_2 := test_type_9(1405, 24, 1, 469, array_of_answers(answer_1, answer_2));
  item_3 := test_type_9(1406, 17, 2, 469, array_of_answers());
  item_4 := test_type_9(1407, 17, 3, 469, array_of_answers(answer_1, answer_2, answer_3));
  table_xd := table_of_tests(item_1, item_2, item_3);
  -- insert into tests_9(tests_table_column) values (table_xd);
  -- insert into tests_9(tests_table_column) values (table_of_tests());
  -- insert into tests_9(tests_table_column) values (table_xd);
  -- insert into tests_9(tests_table_column) values (table_of_tests());
  commit;
  -- Выяснить, является ли членом коллекции К1 какой-то произвольный элемент
  is_member := item_3 MEMBER OF table_xd;
  if is_member then dbms_output.PUT_LINE('in table_xd'); else dbms_output.PUT_LINE('not in table_xd'); end if;
END;

select * from tests_9;

-- Найти пустые коллекции К1;
declare tests_xd table_of_tests;
  row_num integer;
  cursor c_tests is select ROWNUM, tests_table_column from tests_9;
begin
  open c_tests;
  loop
    fetch c_tests into row_num, tests_xd;
    exit when c_tests%notfound;
    if tests_xd.count = 0 then dbms_output.PUT_LINE(row_num); end if;
  end loop;
  close c_tests;
end;

-- table
select * from table(select TESTS_TABLE_COLUMN from tests_9 where rownum=1);

-- cast
select * from table(select cast(TESTS_TABLE_COLUMN as array_of_tests) from tests_9 where rownum=1);

-- bulk
declare
  type test_local_type is table of tests_9%rowtype;
  v_tests test_local_type;
  rows number;
  num integer;
  test_arr table_of_tests;
BEGIN
  select * bulk COLLECT into v_tests from tests_9;
  for i in 1..v_tests.count loop
    dbms_output.PUT_LINE(v_tests(i).tests_table_column.count);
  end loop;
end;