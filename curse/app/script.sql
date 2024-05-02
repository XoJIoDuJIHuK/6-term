-- Active: 1712052565265@@192.168.75.131@5432
select current_database();
insert into "public"."PROLETARIAT" (name, login, password_hash, is_admin, education_json, experience_json) values ('Supreme Admin', 'adminxd', N'$2b$10$iujfXl.zABzRKFiRSkMl3.GH/MCgczusmhAq9V8Gi94KTd3jeRCd2', N'Y', '[]', '[]');
insert into "public"."PROLETARIAT" (name, login, password_hash, is_admin, education_json, experience_json, email) values ('Ivan Ivanov', 'user1', N'$2b$10$iujfXl.zABzRKFiRSkMl3.GH/MCgczusmhAq9V8Gi94KTd3jeRCd2', N'N', '[]', '[]', 'tochilo.oleg@mail.ru');
insert into "public"."BOURGEOISIE" (name, login, password_hash, approved) values ('EPAM', 'admincumpany', N'$2b$10$iujfXl.zABzRKFiRSkMl3.GH/MCgczusmhAq9V8Gi94KTd3jeRCd2', 'N');
CREATE OR REPLACE FUNCTION GetAverageRating(userType char(1), user_id int) returns FLOAT as
$$
declare avg_value real;
begin 
    select avg(rating) into avg_value from "public"."REVIEWS" 
        where (userType = 'R' and p_object = user_id) or (userType = 'C' and b_object = user_id);
    return avg_value;
end;
$$ LANGUAGE PLPGSQL;
select GetAverageRating('R', 3);

select * from "REVIEWS" r join "PROLETARIAT" p on r.p_subject = p.id or r.p_object = p.id;
select * from "REVIEWS" r join "BOURGEOISIE" b on r.b_subject = b.id or r.b_object = b.id;
select r.id as id, r.text as text, r.p_subject as p_subject, p.id as prolId, p.name as prolName, b.id as bourId, b.name as bourName  
from "REVIEWS" r join "PROLETARIAT" p on r.p_subject = p.id or r.p_object = p.id join "BOURGEOISIE" b on r.b_subject = b.id or r.b_object = b.id where r.reported = 'Y';

select n.id as id, n.p_subject as p_subject, n.b_subject as b_subject, p.name as prol_name, b.name as bour_name
from "BLACK_LIST" n join "PROLETARIAT" p on n.p_subject = p.id or n.p_object = p.id join "BOURGEOISIE" b on n.b_subject = b.id or n.b_object = b.id;


select * from "PROLETARIAT";
select * from "CVS";
select * from "BOURGEOISIE";
select * from "VACANCIES";
select * from "RESPONSES";
select * from "REVIEWS";
select * from "PROMOTION_REQUESTS";
select * from "ACCOUNT_DROP_REQUESTS";
select * from "TOKENS";
select * from "BLACK_LIST";

drop table "PROLETARIAT";
drop table "CVS";
drop table "BOURGEOISIE";
drop table "VACANCIES";
drop table "RESPONSES";
drop table "REVIEWS";
drop table "PROMOTION_REQUESTS";
drop table "ACCOUNT_DROP_REQUESTS";
drop table "TOKENS";
drop table "BLACK_LIST";

delete from "PROLETARIAT";
delete from "BOURGEOISIE";
delete from "VACANCIES";
delete from "ACCOUNT_DROP_REQUESTS";
delete from "REVIEWS";
delete from "TOKENS";
delete from "BLACK_LIST";