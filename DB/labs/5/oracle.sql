-- Вычисление итогов работы продавцов помесячно, за квартал, за полгода, за год
SELECT
    EXTRACT(YEAR FROM c.COMMIT_DATE) AS "Year",
    EXTRACT(YEAR FROM c.COMMIT_DATE) || '-' || CASE WHEN EXTRACT(MONTH FROM c.COMMIT_DATE) <= 6 THEN '1' ELSE '2' END AS "Year-Half",
    EXTRACT(YEAR FROM c.COMMIT_DATE) || '-' || TO_CHAR(c.COMMIT_DATE, 'Q') AS "Quarter",
    EXTRACT(YEAR FROM c.COMMIT_DATE) || '-' || EXTRACT(MONTH FROM c.COMMIT_DATE) AS "Month",
    COUNT(t.ID) AS "PassedTests"
FROM TESTS t JOIN COMMITS c ON t.COMMIT = c.ID
WHERE t.PASSED = 'Y'
GROUP BY ROLLUP (
    EXTRACT(YEAR FROM c.COMMIT_DATE),
    EXTRACT(YEAR FROM c.COMMIT_DATE) || '-' || CASE WHEN EXTRACT(MONTH FROM c.COMMIT_DATE) <= 6 THEN '1' ELSE '2' END,
    EXTRACT(YEAR FROM c.COMMIT_DATE) || '-' || TO_CHAR(c.COMMIT_DATE, 'Q'),
    EXTRACT(YEAR FROM c.COMMIT_DATE) || '-' || EXTRACT(MONTH FROM c.COMMIT_DATE)
)
ORDER BY "Year" ASC, "Year-Half" ASC, "Quarter" ASC, "Month" ASC;
-- Вычисление итогов работы продавцов за определенный период:
--  • объем продаж;
--  • сравнение их с общим объемом продаж (в %);
--  • сравнение с наилучшим объемом продаж (в %).
DECLARE
    startDate DATE := TO_DATE('2023-01-01', 'YYYY-MM-DD');
    endDate DATE := TO_DATE('2023-06-01', 'YYYY-MM-DD');
    Name NVARCHAR2(50);
    CommitsCount INT;
    RelativeAverage FLOAT;
    RelativeMax FLOAT;
BEGIN
    FOR dc IN (
        SELECT
            DEVELOPER,
            COUNT(ID) AS CommitsCount,
            AVG(COUNT(ID)) OVER () AS AverageCommits,
            MAX(COUNT(ID)) OVER () AS MaxCommits
        FROM COMMITS
        WHERE COMMIT_DATE <= endDate AND COMMIT_DATE >= startDate
        GROUP BY DEVELOPER
    )
        LOOP
            SELECT 
                s.NAME AS Name, 
                dc.CommitsCount AS "Commits count",
                ROUND((dc.CommitsCount / dc.AverageCommits) * 100, 2) AS "Relative average",
                ROUND((dc.CommitsCount / dc.MaxCommits) * 100, 2) AS "Relative max"
            INTO Name, CommitsCount, RelativeAverage, RelativeMax
            FROM STAFF s
            WHERE dc.DEVELOPER = s.ID;
            DBMS_OUTPUT.PUT_LINE('Name: ' || Name || ', Commits count: ' || CommitsCount ||
                ', Relative average: ' || RelativeAverage || ', Relative max: ' || RelativeMax);
        END LOOP;
END;
-- Вернуть для каждого клиента суммы последних 6 заказов
WITH DeveloperCommits AS (
    SELECT
        c.DEVELOPER,
        c.ID,
        t.PASSED,
        ROW_NUMBER() OVER (PARTITION BY c.DEVELOPER ORDER BY c.COMMIT_DATE DESC) AS "RowNum"
    FROM
        COMMITS c
        INNER JOIN TESTS t ON c.ID = t.COMMIT
)
SELECT
    d.NAME,
    100.0 * SUM(CASE WHEN dc.PASSED = 'Y' THEN 1 ELSE 0 END) / COUNT(*) AS SuccessRate
FROM
    DeveloperCommits dc
    INNER JOIN STAFF d ON dc.DEVELOPER = d.ID
WHERE
    dc."RowNum" <= 3
GROUP BY
    dc.DEVELOPER,
    d.NAME;

-- Какой сотрудник обслужил наибольшее число заказов определенного клиента? Вернуть для всех клиентов
WITH DeveloperTesterCommits AS (
    SELECT
        sd.NAME AS Developer,
        st.NAME AS Tester,
        COUNT(*) AS TestedCommits,
        ROW_NUMBER() OVER(PARTITION BY sd.NAME ORDER BY COUNT(*) DESC) AS "Rank"
    FROM STAFF st 
        JOIN TESTS t on t.TESTER = st.ID 
        JOIN COMMITS c on c.ID = t.COMMIT 
        JOIN STAFF sd ON sd.ID = c.DEVELOPER
    GROUP BY
        sd.NAME,
        st.NAME
)
SELECT
    Developer,
    Tester,
    TestedCommits
FROM
    DeveloperTesterCommits
WHERE "Rank" = 1
ORDER BY Developer;