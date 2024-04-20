create table answers (
    id number generated always as identity primary key,
    test_data number not null,
    answer nvarchar2(50) not null,
    constraint test_data_fk foreign key (test_data) references test_data(id)
) tablespace db_tbs;

insert into answers (test_data, answer) values (3, 'xdb');

CREATE OR REPLACE TYPE answer_type AS OBJECT (
  id           NUMBER,
  test_data    NUMBER,
  answer nvarchar2(50),
  MAP MEMBER FUNCTION get_id (self in out nocopy answer_type) RETURN number,
  MEMBER FUNCTION get_answer (self in out nocopy answer_type) RETURN nvarchar2,
  MEMBER PROCEDURE print_answer (SELF IN OUT NOCOPY answer_type),
  CONSTRUCTOR FUNCTION answer_type(SELF IN OUT NOCOPY answer_type, test_data NUMBER, answer nvarchar2) 
    return self as result
);

CREATE OR REPLACE TYPE BODY ANSWER_TYPE AS
  MAP MEMBER FUNCTION get_id (self in out nocopy answer_type) RETURN number IS
  BEGIN
    return self.id;
  END get_id;
  MEMBER FUNCTION get_answer (self in out nocopy answer_type) RETURN nvarchar2 IS
  BEGIN
    return self.answer;
  END get_answer;
  MEMBER PROCEDURE print_answer (SELF IN OUT NOCOPY answer_type) IS
  BEGIN
    DBMS_OUTPUT.PUT_LINE('right answer is ' || SELF.answer);
  END print_answer;
  CONSTRUCTOR FUNCTION answer_type(test_data NUMBER, answer nvarchar2) 
    return self as result IS
  BEGIN
    SELF.test_data := test_data;
    SELF.answer := answer;
    return;
  END;
END;

drop table answers_table;
create table answers_table of answer_type;
set SERVEROUTPUT on;
declare
    cursor cur is select id, test_data, answer from answers;
    rec cur%rowtype;
    i integer;
begin
    i := 1;
    for rec in cur
    loop
        -- dbms_output.put_line(i || ' ' || rec.test_data || ' ' || rec.answer);
        insert into ANSWERS_TABLE (id, test_data, answer) values (rec.id, rec.test_data, rec.answer);
        i := i + 1;
    end loop;
end;
select * from answers_table;
select * from answers;

CREATE OR REPLACE TYPE test_type AS OBJECT (
  id           NUMBER,
  tester       NUMBER,
  test_data    NUMBER,
  commit       NUMBER,
  got_answer nvarchar2(50),
  MEMBER FUNCTION get_id return number DETERMINISTIC,
  MAP MEMBER FUNCTION get_commit_date (self in out nocopy test_type) RETURN TIMESTAMP,
  MEMBER FUNCTION is_passed  (SELF IN OUT NOCOPY test_type) RETURN char,
  MEMBER PROCEDURE switch_to_right ( SELF IN OUT NOCOPY test_type ),
  CONSTRUCTOR FUNCTION test_type (SELF IN OUT NOCOPY test_type, id number, tester NUMBER, test_data NUMBER, commit NUMBER, 
    got_answer nvarchar2) return self as result
);

CREATE OR REPLACE TYPE BODY test_type AS
  MEMBER FUNCTION get_id return number is
  begin
    RETURN id;
  end get_id;
    MAP MEMBER FUNCTION get_commit_date (self in out nocopy test_type) RETURN TIMESTAMP IS
    commit_date TIMESTAMP;
    BEGIN
        select c.commit_date into commit_date from commits c where c.id = commit;
        return commit_date;
    END get_commit_date;
    MEMBER FUNCTION is_passed (self in out nocopy test_type) RETURN CHAR IS
    right_answer NVARCHAR2(50);
    BEGIN
        select answer into right_answer from ANSWERS_TABLE where id = self.test_data;
        if self.got_answer = right_answer then return 'Y'; else return 'N'; end if;
    END is_passed;
    MEMBER PROCEDURE switch_to_right (self in out nocopy test_type) IS
    right_answer NVARCHAR2(50);
    BEGIN
        select answer into right_answer from ANSWERS_TABLE where id = self.test_data;
        self.got_answer := right_answer;
        return;
    END switch_to_right;
    CONSTRUCTOR FUNCTION test_type (SELF IN OUT NOCOPY test_type, id number, tester NUMBER, test_data NUMBER, commit NUMBER, 
        got_answer nvarchar2) RETURN SELF AS RESULT IS
    BEGIN
      self.id := id;
        SELF.tester := tester;
        SELF.test_data := test_data;
        SELF.commit := commit;
        SELF.got_answer := got_answer;
        return;
    END;
END;

drop table tests_table;
create table tests_table of test_type;
declare
    cursor cur is select * from tests;
    rec cur%rowtype;
    i integer;
    right_answer nvarchar2(50);
    got_answer nvarchar2(50);
begin
    i := 1;
    for rec in cur
    loop
        select answer into right_answer from answers_table where id = rec.data_id;
        if rec.passed = 'Y' then got_answer := right_answer; else got_answer := 'null'; end if;
        insert into TESTS_TABLE (id, tester, test_data, commit, got_answer) values (
            rec.id, rec.tester, rec.data_id, rec.commit, got_answer);
        i := i + 1;
    end loop;
end;
select * from tests_table;

declare test test_type;
begin
    select t.test into test from tests_table t where id = 366;
    dbms_output.put_line(test.is_passed());
end;

drop table tests_with_indexes;
create table tests_with_indexes(test test_type);
declare
    cursor cur is select * from tests;
    rec cur%rowtype;
    i integer;
    right_answer nvarchar2(50);
    got_answer nvarchar2(50);
begin
    i := 1;
    for rec in cur
    loop
        select answer into right_answer from answers_table where id = rec.data_id;
        if rec.passed = 'Y' then got_answer := right_answer; else got_answer := 'null'; end if;
        insert into TESTS_WITH_INDEXES values (test_type(rec.id, rec.tester, rec.data_id, rec.commit, got_answer));
        i := i + 1;
    end loop;
end;
select * from tests_with_indexes;
drop index i_test_data;
drop index i_test_id;
commit;
create index i_test_data on tests_with_indexes (test.test_data);
create bitmap index i_test_id on tests_with_indexes (test.get_id());

select t.test.tester, t.test.test_data, t.test.got_answer from TESTS_WITH_INDEXES t where t.test.get_id() = 700;
select t.test.tester, t.test.test_data, t.test.got_answer from TESTS_WITH_INDEXES t where t.test.test_data = 2;

declare ans answer_type;
id int;
right_answer nvarchar2(50);
BEGIN
  ans := answer_type(1, 'right');
  id := ans.get_id();
  right_answer := ans.get_answer();
  ans.print_answer();
  dbms_output.put_line(id);
  dbms_output.put_line(right_answer);
end;

create view tests_view of test_type
with object identifier (id) as select * from tests_table;
select * from tests_view;

create view answers_view of answer_type
with object identifier (id) as select * from answers_table;
select * from answers_view;
declare id int;
begin
select t.test.get_id() into id from TESTS_WITH_INDEXES t where t.test.id = 700;
dbms_output.put_line(id);
end; 
set serveroutput on;