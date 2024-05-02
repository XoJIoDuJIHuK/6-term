select db_name();
use sepdb;
-- Создайте таблицу Report, содержащую два столбца – id и XML-столбец в базе данных SQL Server.
select * from Report;
create table Report (
    Id INTEGER primary key identity(1,1),
    XmlParsed XML
);
drop table Report;
delete from Report;

-- Создайте процедуру генерации XML. XML должен включать данные из как минимум 3 
-- соединенных таблиц, различные промежуточные итоги и штамп времени
drop function generateXML;
CREATE FUNCTION generateXML()
RETURNS XML
AS
BEGIN
    DECLARE @x XML;
    SET @x = (
        SELECT 
        t.id AS "@TestID", 
        c.developer AS "Developer",
        td.json_data AS "JSON_DATA",
        GETDATE() AS "Date"
            FROM 
                TEST_DATA td
                JOIN tests t ON td.id = t.data_id
                JOIN commits c on c.id = t.commit_id
            FOR XML PATH('TESTS')
    );
    RETURN @x;
END;

DECLARE @xmlData XML = dbo.generateXML();
select @xmlData as XMLData;

-- Создайте процедуру вставки этого XML в таблицу Report
create procedure getInsertReport
as
DECLARE @xmlData XML; 
SET @xmlData = dbo.generateXML()
insert into Report values(@xmlData);

execute getInsertReport;

select * from Report;

-- Создайте индекс над XML-столбцом в таблице Report
create primary xml index PrimaryIndex on Report(XmlParsed);
create xml index PathIndex on Report(XmlParsed) using xml index PrimaryIndex for path;

drop index PathIndex on report
drop index PrimaryIndex on report

select * from Report;

-- Создайте процедуру извлечения значений элементов и/или атрибутов из XML -столбца в таблице 
-- Report (параметр – значение атрибута или элемента).
drop procedure GetInfoColumnData;
CREATE PROCEDURE GetInfoColumnData
    @XPath NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @SQL NVARCHAR(MAX);
    SET @SQL = 'SELECT XmlParsed.query(''' + @XPath + ''') FROM Report FOR XML AUTO, TYPE';
    EXEC sp_executesql @SQL;
END;

execute GetInfoColumnData  '/TESTS/Developer';

SELECT XmlParsed.query('/TESTS/Developer') FROM Report FOR XML AUTO, TYPE;


-- 1.	Опишите структуру XML-файла. 
-- один корневой элемент, сколько угодно вложеннных
-- 2.	Чем валидный XML-файл отличается от правильно построенного?
-- правильно построенный:
    -- Есть корневой элемент.
    -- У каждого элемента есть закрывающийся тег.
    -- Теги регистрозависимы!
    -- Соблюдается правильная вложенность элементов.
    -- Атрибуты оформлены в кавычках.
-- валидный:
    -- включает определение типа документа (document type definition, DTD) или XML-схему (XSD), причем 
    -- сам документ не противоречит этой схеме (определению DTD). Определение DTD (схема документа) задает 
    -- корректный синтаксис:
        -- <?xml version="1.0" ?>
        -- <!DOCTYPE queue [
        --         ...
        -- ]>
-- 3.	Что такое DTD? Опишите структуру DTD файла. ^-^
-- набор <!ELEMENT> и <!ATTLIST> с описаниями
-- 4.	Что такое схема? Опишите структуру файла схемы.
-- файл, описывающий требования к дочерним тегам и их типам данных
    -- какие поля будут в запросе;
    -- какие поля будут в ответе;
    -- какие типы данных у каждого поля;
    -- какие поля обязательны для заполнения, а какие нет;
    -- есть ли у поля значение по умолчанию, и какое оно;
    -- есть ли у поля ограничение по длине;
    -- есть ли у поля другие параметры;
    -- какая у запроса структура по вложенности элементов;
-- 5.	Поясните разницу между различными видами представления реляционных данных в XML в SQL Server.
-- 
-- 6.	Какие виды индексов для XML существуют в SQL Server?
-- первичные 
    -- индексируются все теги, значения и пути в экземплярах XML, хранимых в XML-столбце
    -- в таблице должен быть индекс по первичному ключу)
    -- это разобранное и сохраненное представление XML-объектов BLOB, содержащихся в столбце типа данных xml
-- вторичные (должен быть первичный индекс, могут быть по селектору, значению и свойству)
-- 7.	Поясните назначение функций и методов EXTRACTVALUE, EXISTSNODE, GETSTRING, GETROOTELEMENT, XMLELEMENT, 
-- XMLATTRIBUTES, XMLAGG.
    -- EXTRACTVALUE принимет ноду с селектор и возвращает скалярное значение получившейся ноды
    -- EXISTSNODE принимает ноду и селектор и возвращает 1 или 0
    -- GETSTRING ?
    -- GETROOTELEMENT Returns top-level element of the given instance (NULL for fragment)
    -- XMLELEMENT takes an element name for identifier or evaluates an element name for EVALNAME value_expr, 
        -- an optional collection of attributes for the element, and arguments that make up the content of 
        -- the element. It returns an instance of type XMLType
    -- XMLATTRIBUTES can be used together with XMLElement, to specify attributes for the generated elements
    -- XMLAGG takes a collection of XML fragments and returns an aggregated XML document
