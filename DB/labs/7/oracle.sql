with based_data as (
  select name as "name", extract(month from commit_date) as "month", count(*) as "count"
  from STAFF s join TESTS t on t.tester = s.id 
    join COMMITS c on t.commit = c.id 
  where extract(year from commit_date) = 2023
  group by name, extract(month from commit_date)
  order by s.name
) 
select "name", "month", round("count") as "count" from based_data model
  partition by ("name")
  DIMENSION BY ("month")
  measures ("count")
  rules (
    "count"[1] = "count"[1] * 1.1,
    "count"[for "month" from 2 to 12 increment 1] = "count"[CV()-1] * 1.1
  )
order by "name", "month";

with based_data as (
  select extract(year from commit_date) year, extract(month from commit_date) month, count(*) count
  from STAFF s join TESTS t on t.tester = s.id 
    join COMMITS c on t.commit = c.id
  group by extract(year from commit_date), extract(month from commit_date)
  order by extract(year from commit_date), extract(month from commit_date)
) select * from based_data 
match_recognize (
  measures
    growth.year as year,
    growth.month as month,
    growth.count as first_count,
    fall.count as second_count,
    growth.count as third_count
  one row per match
  pattern (growth fall growth)
  define
    growth as (count < next(count)),
    fall as (next(count) < count)
);

select count(*) from tests

-- 1.	Для чего используется конструкция MODEL?
  -- для упрощения аналитических запросов
-- 2.	Поясните секцию ORDER BY конструкции MODEL.
  -- применяется к строкам после применения правил модели
-- 3.	Поясните секцию PARTITION BY конструкции MODEL.
  -- разделяет данные на группы по правилам
-- 4.	Поясните секцию DIMENSIONS конструкции MODEL.
  --  определяют оси, по которым выполняется вычисление и моделирование
-- 5.	Что такое мера конструкции MODEL?
  -- числовой стобец, для которого выполняются вычисления
-- 6.	Что такое RULES?
  -- определяют логику или условия выполнения вычислений. Используются для определения паттернов, условных вычислений и т.д.
-- 7.	Что такое символьная, позиционная и смешанная нотации?
  -- (по именам стобцов, по индексам, смешанно) соответственно
-- 8.	Что такое NESTED REFERENCES?
  -- возможность ссылаться на вычисленные значения внутри модели
-- 9.	Что такое REFERENCE MODEL?
  -- механизм использования модели внутри другой модели
-- 10.	Для чего используется UNIQUE SINGLE REFERENCE?
  -- ссылка на указанный столбец или выражение должна быть уникальной и ссылаться на единственное значение
-- 11.	Для чего используется конструкция MATCH_RECOGNIZE?
  -- для распознавания паттернов в данных
-- 12.	Что такое переменные шаблона в конструкции MATCH_RECOGNIZE?
  -- переменные, позволяющие ссылаться на определенные части шаблона и использовать их в дальнейших вычислениях или условиях
-- 13.	Что такое шаблон в конструкции MATCH_RECOGNIZE?
  -- искомая последовательность
-- 14.	Для чего используются меры в конструкции MATCH_RECOGNIZE 
  -- для определения вычисляемых значений, которые будут ассоциированы с результатами распознавания шаблона
-- 15.	Для чего используется ключевая фраза AFTER MATCH в конструкции MATCH_RECOGNIZE?
  -- определяет действия, выполняемые после обнаружения совпадения с шаблоном