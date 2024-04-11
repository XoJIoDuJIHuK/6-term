-- Active: 1712767252056@@192.168.75.131@1433
-- Вычисление итогов работы продавцов помесячно, за квартал, за полгода, за год
SELECT
    DATEPART(YEAR, c.COMMIT_DATE) AS [Year],
    CONCAT(DATEPART(YEAR, c.COMMIT_DATE), '-', CASE WHEN DATEPART(MONTH, c.COMMIT_DATE) <= 6 THEN '1' ELSE '2' END) AS [Year-Half],
    CONCAT(DATEPART(YEAR, c.COMMIT_DATE), '-', DATEPART(QUARTER, c.COMMIT_DATE)) AS [Quarter],
    CONCAT(DATEPART(YEAR, c.COMMIT_DATE), '-', DATEPART(MONTH, c.COMMIT_DATE)) AS [Month],
    COUNT(t.ID) AS PassedTests
FROM
    TESTS t JOIN COMMITS c ON t.COMMIT_ID = c.ID
WHERE
    t.PASSED = 'Y'
GROUP BY ROLLUP (
    DATEPART(YEAR, c.COMMIT_DATE),
    CONCAT(DATEPART(YEAR, c.COMMIT_DATE), '-', CASE WHEN DATEPART(MONTH, c.COMMIT_DATE) <= 6 THEN '1' ELSE '2' END),
    CONCAT(DATEPART(YEAR, c.COMMIT_DATE), '-', DATEPART(QUARTER, c.COMMIT_DATE)),
    CONCAT(DATEPART(YEAR, c.COMMIT_DATE), '-', DATEPART(MONTH, c.COMMIT_DATE))
)
ORDER BY
    [Year] ASC, [Year-Half] ASC, [Quarter] ASC, [Month] ASC;
go
-- Вычисление итогов работы продавцов за определенный период:
--  • объем продаж;
--  • сравнение их с общим объемом продаж (в %);
--  • сравнение с наилучшим объемом продаж (в %).
DECLARE @startDate DATETIME = '2023-01-01';
DECLARE @endDate DATETIME = '2023-06-01';

WITH DeveloperCommits AS (
    SELECT
        DEVELOPER,
        COUNT(ID) AS [CommitsCount],
        AVG(COUNT(ID)) OVER () AS [AverageCommits],
        MAX(COUNT(ID)) OVER () AS [MaxCommits]
    FROM
        COMMITS
    WHERE
        COMMIT_DATE <= @endDate AND COMMIT_DATE >= @startDate
    GROUP BY
        DEVELOPER
)
SELECT
    s.NAME AS [Name],
    dc.CommitsCount AS [Commits count],
    ROUND((CAST(dc.CommitsCount AS FLOAT) / dc.AverageCommits) * 100, 2) AS [Relative average],
    ROUND((CAST(dc.CommitsCount AS FLOAT) / dc.MaxCommits) * 100, 2) AS [Relative max]
FROM
    DeveloperCommits dc
    JOIN STAFF s ON dc.DEVELOPER = s.NODE;
go
-- по страницам
DECLARE @startDate DATETIME = '2023-01-01';
DECLARE @endDate DATETIME = '2023-06-01';
DECLARE @pageSize INT = 5;
DECLARE @pageNumber INT = 2;

WITH DeveloperCommits AS (
    SELECT
        DEVELOPER,
        COUNT(ID) AS [CommitsCount],
        AVG(COUNT(ID)) OVER () AS [AverageCommits],
        MAX(COUNT(ID)) OVER () AS [MaxCommits],
        ROW_NUMBER() OVER (ORDER BY COUNT(ID) DESC) AS RowNum
    FROM
        COMMITS
    WHERE
        COMMIT_DATE <= @endDate AND COMMIT_DATE >= @startDate
    GROUP BY
        DEVELOPER
)
SELECT
    [Name],
    [Commits count],
    [Relative average],
    [Relative max]
FROM
    (
        SELECT
            s.NAME AS [Name],
            dc.CommitsCount AS [Commits count],
            ROUND((CAST(dc.CommitsCount AS FLOAT) / dc.AverageCommits) * 100, 2) AS [Relative average],
            ROUND((CAST(dc.CommitsCount AS FLOAT) / dc.MaxCommits) * 100, 2) AS [Relative max],
            ROW_NUMBER() OVER (ORDER BY dc.RowNum) AS RowNum
        FROM
            DeveloperCommits dc
            JOIN STAFF s ON dc.DEVELOPER = s.NODE
    ) AS Paging
WHERE
    RowNum BETWEEN (@pageNumber - 1) * @pageSize + 1 AND @pageNumber * @pageSize;
go
-- удаление дубликатов
WITH DeduplicatedData AS (
    SELECT
        DATA_ID,
        COMMIT_ID,
        TESTER,
        ROW_NUMBER() OVER (PARTITION BY COMMIT_ID, TESTER, DATA_ID ORDER BY (SELECT NULL)) AS RowNum
    FROM TESTS
)
DELETE FROM DeduplicatedData
WHERE RowNum > 1; 
go
insert into tests (tester, COMMIT_ID, DATA_ID, PASSED) VALUEs ((select node from staff where name = 'tester11'), 55, 5, 'Y');
SELECT * FROM STAFF;
SELECT * FROM TESTS;
-- Вернуть для каждого клиента суммы последних 6 заказов
WITH DeveloperCommits AS (
    SELECT
        c.DEVELOPER,
        c.ID,
        t.PASSED,
        ROW_NUMBER() OVER (PARTITION BY c.DEVELOPER ORDER BY c.COMMIT_DATE DESC) AS RowNum
    FROM COMMITS c INNER JOIN TESTS t ON c.ID = t.COMMIT_ID
)
SELECT
    d.NAME,
    100.0 * SUM(CASE WHEN dc.PASSED = 'Y' THEN 1 ELSE 0 END) / COUNT(*) AS SuccessRate
FROM
    DeveloperCommits dc
    INNER JOIN STAFF d ON dc.DEVELOPER = d.NODE
WHERE dc.RowNum <= 6
GROUP BY dc.DEVELOPER, d.NAME;
go

-- Какой сотрудник обслужил наибольшее число заказов определенного клиента? Вернуть для всех клиентов
WITH DeveloperTesterCommits AS (
    SELECT
        sd.NAME AS Developer,
        st.NAME AS Tester,
        COUNT(*) AS TestedCommits,
        ROW_NUMBER() OVER(PARTITION BY sd.NAME ORDER BY COUNT(*) DESC) AS Rank
    FROM STAFF st 
        JOIN TESTS t on t.TESTER = st.NODE 
        JOIN COMMITS c on c.ID = t.COMMIT_ID 
        JOIN STAFF sd ON sd.NODE = c.DEVELOPER
    GROUP BY sd.NAME, st.NAME
)
SELECT
    Developer,
    Tester,
    TestedCommits
FROM DeveloperTesterCommits
WHERE Rank = 1
ORDER BY Developer;

-- 1. Что такое расширенные группировки?
-- группировки по различным комбинациям столбцов, а не только по набору столбцов
-- 2. Приведите примеры использования расширенных группировок.
-- ролап, куб
-- 3. Для чего предназначена функция GROUPING ()?
-- показывает, является ли строка результатом агрегации
-- 4. Для чего предназначена функция GROUP_ID ()?
-- выводит разные значения для разных строк с одинаковыми комбинациями значений группируемых столбцов
-- 5. Для чего предназначена функция GROUPING_ID ()?
-- формирует значение битового вектора (таблицы для NULL/NOT NULL значений столбцов данной строки)
-- 6. Что такое составные столбцы?
-- это набор столбцов, котоырй рассматривается как одно целое при группировке. Пусть есть запрос с ROLLUP (year, (quarter, month), day)
-- тогда ролап будет проводиться так: 
-- (year, quarter, month, day),
-- (year, quarter, month),
-- (year)
-- ()
-- 7. Что такое GROUPING SETS?
-- наборы групп, которые будут использованы при группировке. Позволяет точнее определять, какие наборы столбцов группировать, 
-- вместо группировки всего куба
-- 8. Поясните синтаксис аналитических функций.
-- {FUNCTION} OVER ([PARTITION BY {COLUMNS}])
-- 9. Перечислите виды аналитических функций.
-- предоставляют информацию о распределении данных: 
-- PERCENT_RANK - возвращает ранг (что это?) от 0 до 1. Первая строка в наборе всегда 0. Null трактуется как наименьшее значение в наборе
-- CUME_DIST - возвращает накопленное распределение внутри группы значений (относительное положение значения в группе)
-- PERCENTILE_CONT - вычисляет перцентиль, основанный на продолжительном (?) распределении значения столбца в группе
-- PERCENTILE_DISC - вычисляет определенный перцентиль для отсортированных значений во всем наборе строк или в отдельных разделах набора

-- Агрегатные (арифметические)
--      sum, min, max, avg, count
-- Ранжирования (порядковые номера строк в окне)
--      rank, row_number
-- Сдвига (значение из другой строки окна)
--      lag, lead, first_value, last_value
-- Аналитические (информация о распределении данных)
-- 10. Перечислите известные вам аналитические функции каждого вида.
-- 11. Поясните секцию ORDER BY аналитических функций.
-- определяет порядок сортировки строк внутри каждой группы или окна
-- 12. Поясните секцию PARTITION BY аналитических функций.
-- определяет, по каким признакам строки делятся на окна. Позволяет выполнять вычисления для каждого набора строк независимо
-- 13. Поясните ключевые слова ROWS и RANGE аналитических функций.
-- используются для определения размера окна (ROWS ограничивает строки, RANGE ограничивает данные)
-- 14. Опишите, как работает вложенность аналитических функций.
-- позволяет использовать результат одной аналитической функции в качестве входных данных для другой аналитической функции
-- например, использовать ROW_NUMBER в SUM