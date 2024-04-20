-- Active: 1712052565265@@192.168.75.131@5432
select current_database();
insert into "public"."PROLETARIAT" (name, login, password_hash, is_admin, education_json, experience_json) values ('Supreme Admin', 'adminxd', N'$2b$10$iujfXl.zABzRKFiRSkMl3.GH/MCgczusmhAq9V8Gi94KTd3jeRCd2', N'Y', '{}', '{}');
insert into "public"."PROLETARIAT" (name, login, password_hash, is_admin, education_json, experience_json) values ('Ivan Ivanov', 'user2', N'$2b$10$iujfXl.zABzRKFiRSkMl3.GH/MCgczusmhAq9V8Gi94KTd3jeRCd2', N'N', '{}', '{}');
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


select * from "public"."RESPONSES" where vacancy in (1,6);
select GetAverageRating('R', 3);

select * from "PROLETARIAT";
select * from "CVS";
select * from "BOURGEOISIE";
select * from "VACANCIES";
select * from "RESPONSES";
select * from "REVIEWS";
select * from "PROMOTION_REQUESTS";
select * from "ACCOUNT_DROP_REQUESTS";
select * from "TOKENS";

drop table "PROLETARIAT";
drop table "CVS";
drop table "BOURGEOISIE";
drop table "VACANCIES";
drop table "RESPONSES";
drop table "REVIEWS";
drop table "PROMOTION_REQUESTS";
drop table "ACCOUNT_DROP_REQUESTS";
drop table "TOKENS";

delete from "BOURGEOISIE";
delete from "ACCOUNT_DROP_REQUESTS";
delete from "REVIEWS";
delete from "TOKENS";