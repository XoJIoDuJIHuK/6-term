create database CPSD_Lab13;
use CPSD_Lab13;

select DB_NAME();

-- DROP TABLE FACULTY
CREATE TABLE FACULTY
	(
	 FACULTY      NVARCHAR(10)      NOT NULL,
	 FACULTY_NAME NVARCHAR(50), 
	 CONSTRAINT PK_FACULTY PRIMARY KEY(FACULTY) 
	);
select * from FACULTY;

delete FACULTY;
insert into FACULTY   (FACULTY,   FACULTY_NAME )
						 values  (N'ИДиП',   N'Издательское дело и полиграфия');
insert into FACULTY   (FACULTY,   FACULTY_NAME )
						values  (N'ХТиТ',   N'Химическая технология и техника');
insert into FACULTY   (FACULTY,   FACULTY_NAME )
						values  (N'ЛХФ',     N'Лесохозяйственный факультет');
insert into FACULTY   (FACULTY,   FACULTY_NAME )
						values  (N'ИЭФ',     N'Инженерно-экономический факультет');
insert into FACULTY   (FACULTY,   FACULTY_NAME )
						values  (N'ТТЛП',    N'Технология и техника лесной промышленности');
insert into FACULTY   (FACULTY,   FACULTY_NAME )
						values  (N'ТОВ',     N'Технология органических веществ');

--------------------------------------------------------------------------------------------
-- DROP TABLE PULPIT
CREATE TABLE PULPIT 
(
 PULPIT       NVARCHAR(10)      NOT NULL,
 PULPIT_NAME  NVARCHAR(100), 
 FACULTY      NVARCHAR(10)      NOT NULL, 
 CONSTRAINT FK_PULPIT_FACULTY FOREIGN KEY(FACULTY)   REFERENCES FACULTY(FACULTY), 
 CONSTRAINT PK_PULPIT PRIMARY KEY(PULPIT) 
 ); 
 
delete PULPIT; 
select * from PULPIT; 
insert into PULPIT   (PULPIT,    PULPIT_NAME, FACULTY )
						 values  (N'ИСиТ',    N'Информационных систем и технологий',                         N'ИДиП'  );
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                   FACULTY )
						 values  (N'ПОиСОИ', N'Полиграфического оборудования и систем обработки информации ', N'ИДиП'  );
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                   FACULTY)
							values  (N'ЛВ',      N'Лесоводства',                                                 N'ЛХФ') ;         
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                   FACULTY)
						 values  (N'ОВ',      N'ОхоТОВедения',                                                 N'ЛХФ') ;   
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                   FACULTY)
						 values  (N'ЛУ',      N'Лесоустройства',                                              N'ЛХФ');           
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                   FACULTY)
						 values  (N'ЛЗиДВ',   N'Лесозащиты и древесиноведения',                               N'ЛХФ');                
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                   FACULTY)
						 values  (N'ЛПиСПС',  N'Ландшафтного проектирования и садово-паркового строительства',N'ЛХФ');                  
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                   FACULTY)
						 values  (N'ТЛ',     N'Транспорта леса',                                              N'ТТЛП');                        
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                   FACULTY)
						 values  (N'ЛМиЛЗ',  N'Лесных машин и технологии лесозагоТОВок',                      N'ТТЛП');                        
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                   FACULTY)
						 values  (N'ОХ',     N'Органической химии',                                           N'ТОВ');            
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                              FACULTY)
						 values  (N'ТНХСиППМ',N'Технологии нефтехимического синтеза и переработки полимерных материалов',N'ТОВ');             
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                      FACULTY)
						 values  (N'ТНВиОХТ',N'Технологии неорганических веществ и общей химической технологии ',N'ХТиТ');                    
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                                         FACULTY)
						 values  (N'ХТЭПиМЭЕ',N'Химии, технологии электрохимических производств и материалов электронной техники', N'ХТиТ');
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                      FACULTY)
						 values  (N'ЭТиМ',    N'экономической теории и маркетинга',                              N'ИЭФ');   
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                      FACULTY)
						 values  (N'МиЭП',   N'Менеджмента и экономики природопользования',                      N'ИЭФ');    
------------------------------------------------------------------------------------------------------------------------        - DROP  TABLE TEACHER
CREATE TABLE TEACHER
 ( 
	TEACHER       NVARCHAR(10) NOT  NULL,
	TEACHER_NAME  NVARCHAR(50), 
	PULPIT        NVARCHAR(10) NOT NULL, 
	CONSTRAINT PK_TEACHER  PRIMARY KEY(TEACHER), 
	CONSTRAINT FK_TEACHER_PULPIT FOREIGN   KEY(PULPIT)   REFERENCES PULPIT(PULPIT)
 ) ;
 
go 
delete  TEACHER;
insert into  TEACHER    (TEACHER,   TEACHER_NAME, PULPIT )
											 values  (N'СМЛВ',    N'Смелов Владимир Владиславович',  N'ИСиТ');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											 values  (N'АКНВЧ',    N'Акунович Станислав Иванович',  N'ИСиТ');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											 values  (N'КЛСНВ',    N'Колесников Леонид Валерьевич',  N'ИСиТ');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											 values  (N'ГРМН',    N'Герман Олег Витольдович',  N'ИСиТ');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											 values  (N'ЛЩНК',    N'Лащенко Анатолий Пвалович',  N'ИСиТ');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											 values  (N'БРКВЧ',    N'Бракович Андрей Игорьевич',  N'ИСиТ');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											 values  (N'ДДК',     N'Дедко Александр Аркадьевич',  N'ИСиТ');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											 values  (N'КБЛ',     N'Кабайло Александр Серафимович',  N'ИСиТ');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											 values  (N'УРБ',     N'Урбанович Павел Павлович',  N'ИСиТ');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											 values  (N'РМНК',     N'Романенко Дмитрий Михайлович',  N'ИСиТ');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											 values  (N'ПСТВЛВ',  N'ПусТОВалова Наталия Николаевна', N'ИСиТ' );
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											 values  (N'?',     N'Неизвестный',  N'ИСиТ');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											values  (N'ГРН',     N'Гурин Николай Иванович',  N'ИСиТ');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											 values  (N'ЖЛК',     N'Жиляк Надежда Александровна',  N'ИСиТ');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											 values  (N'БРТШВЧ',   N'Барташевич Святослав Александрович',  N'ПОиСОИ');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											 values  (N'ЮДНКВ',   N'Юденков Виктор Степанович',  N'ПОиСОИ');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											 values  (N'БРНВСК',   N'Барановский Станислав Иванович',  N'ЭТиМ');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											 values  (N'НВРВ',   N'Неверов Александр Васильевич',  N'МиЭП');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											 values  (N'РВКЧ',   N'Ровкач Андрей Иванович',  N'ОВ');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											 values  (N'ДМДК', N'Демидко Марина Николаевна',  N'ЛПиСПС');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											 values  (N'МШКВСК',   N'Машковский Владимир Петрович',  N'ЛУ');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											 values  (N'ЛБХ',   N'Лабоха Константин Валентинович',  N'ЛВ');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											 values  (N'ЗВГЦВ',   N'Звягинцев Вячеслав Борисович',  N'ЛЗиДВ'); 
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											 values  (N'БЗБРДВ',   N'Безбородов Владимир Степанович',  N'ОХ'); 
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											 values  (N'ПРКПЧК',   N'Прокопчук Николай Романович',  N'ТНХСиППМ'); 
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											 values  (N'НСКВЦ',   N'Насковец Михаил Трофимович',  N'ТЛ'); 
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											 values  (N'МХВ',   N'Мохов Сергей Петрович',  N'ЛМиЛЗ'); 
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											 values  (N'ЕЩНК',   N'Ещенко Людмила Семеновна',  N'ТНВиОХТ'); 
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
											 values  (N'ЖРСК',   N'Жарский Иван Михайлович',  N'ХТЭПиМЭЕ'); 
---------------------------------------------------------------------------------------------------------------------
-- DROP TABLE SUBJECT 
CREATE TABLE SUBJECT
		(
		 SUBJECT      NVARCHAR(10)     NOT NULL, 
		 SUBJECT_NAME NVARCHAR(50)  NOT NULL,
		 PULPIT       NVARCHAR(10)     NOT NULL,  
		 CONSTRAINT PK_SUBJECT PRIMARY KEY(SUBJECT),
		 CONSTRAINT FK_SUBJECT_PULPIT FOREIGN  KEY(PULPIT)  REFERENCES PULPIT(PULPIT)
		);
go
delete SUBJECT;
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
											 values (N'СУБД',   N'Системы управления базами данных',                   N'ИСиТ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT)
											 values (N'БД',     N'Базы данных',                                        N'ИСиТ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
											 values (N'ИНФ',    N'Информацтонные технологии',                          N'ИСиТ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
											 values (N'ОАиП',  N'Основы алгоритмизации и программирования',            N'ИСиТ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
											 values (N'ПЗ',     N'Представление знаний в компьютерных системах',       N'ИСиТ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
											 values (N'ПСП',    N'Пограммирование сетевых приложений',                 N'ИСиТ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
											 values (N'МСОИ',     N'Моделирование систем обработки информации',        N'ИСиТ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
											 values (N'ПИС',     N'Проектирование информационных систем',              N'ИСиТ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
											 values (N'КГ',      N'Компьютерная геометрия ',                           N'ИСиТ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
											 values (N'ПМАПЛ',   N'Полиграфические машины, автоматы и поточные линии', N'ПОиСОИ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
											 values (N'КМС',     N'Компьютерные мультимедийные системы',               N'ИСиТ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
											 values (N'ОПП',     N'Организация полиграфического производства',         N'ПОиСОИ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,                            PULPIT)
							 values (N'ДМ',   N'Дискретная матеатика',                     N'ИСиТ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,                             PULPIT )
							 values (N'МП',   N'Математисеское программирование',          N'ИСиТ');  
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,                             PULPIT )
							 values (N'ЛЭВМ', N'Логические основы ЭВМ',                     N'ИСиТ');                   
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,                             PULPIT )
							 values (N'ООП',  N'Объектно-ориентированное программирование', N'ИСиТ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
											 values (N'ЭП',     N'Экономика природопользования',                       N'МиЭП');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
											 values (N'ЭТ',     N'Экономическая теория',                               N'ЭТиМ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
											 values (N'БЛЗиПсOO',N'Биология лесных зверей и птиц с осн. охоТОВ.',      N'ОВ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
											 values (N'ОСПиЛПХ',N'Основы садовопаркового и лесопаркового хозяйства',  N'ЛПиСПС');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
											 values (N'ИГ',     N'Инженерная геодезия ',                              N'ЛУ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
											 values (N'ЛВ',    N'Лесоводство',                                        N'ЛЗиДВ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
											 values (N'ОХ',    N'Органическая химия',                                 N'ОХ');   
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
											 values (N'ТРИ',    N'Технология резиновых изделий',                      N'ТНХСиППМ'); 
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
											 values (N'ВТЛ',    N'Водный транспорт леса',                             N'ТЛ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
											 values (N'ТиОЛ',   N'Технология и оборудование лесозагоТОВок',           N'ЛМиЛЗ'); 
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
											 values (N'ТОПИ',   N'Технология обогащения полезных ископаемых ',        N'ТНВиОХТ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
											 values (N'ПЭХ',    N'Прикладная электрохимия',                           N'ХТЭПиМЭЕ');          
---------------------------------------------------------------------------------------------------------------------
-- DROP TABLE AUDITORIUM_TYPE 
create table AUDITORIUM_TYPE 
(
	AUDITORIUM_TYPE   NVARCHAR(10) constraint AUDITORIUM_TYPE_PK  primary key,  
	AUDITORIUM_TYPENAME  NVARCHAR(30) constraint AUDITORIUM_TYPENAME_NOT_NULL not null         
);
go
delete AUDITORIUM_TYPE;
insert into AUDITORIUM_TYPE   (AUDITORIUM_TYPE,   AUDITORIUM_TYPENAME )
											 values  (N'ЛК',   N'Лекционная');
insert into AUDITORIUM_TYPE   (AUDITORIUM_TYPE,   AUDITORIUM_TYPENAME )
											 values  (N'ЛБ-К',   N'Компьютерный класс');
insert into AUDITORIUM_TYPE   (AUDITORIUM_TYPE,   AUDITORIUM_TYPENAME )
											 values  (N'ЛК-К', N'Лекционная с уст. компьютерами');
insert into AUDITORIUM_TYPE   (AUDITORIUM_TYPE,   AUDITORIUM_TYPENAME )
											 values  (N'ЛБ-X', N'Химическая лаборатория');
insert into AUDITORIUM_TYPE   (AUDITORIUM_TYPE,   AUDITORIUM_TYPENAME )
											 values  (N'ЛБ-СК', N'Спец. компьютерный класс');
---------------------------------------------------------------------------------------------------------------------
-- DROP TABLE AUDITORIUM 
create table AUDITORIUM 
(
 AUDITORIUM           NVARCHAR(10) primary key,  -- код аудитории
 AUDITORIUM_NAME      NVARCHAR(200),          -- аудитория 
 AUDITORIUM_CAPACITY  INTEGER,              -- вместимость
 AUDITORIUM_TYPE      NVARCHAR(10) not null      -- тип аудитории
											references AUDITORIUM_TYPE(AUDITORIUM_TYPE)  
);
go
delete  AUDITORIUM;
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
											 values  (N'206-1',   N'206-1', N'ЛБ-К', 15);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY)
											 values  (N'301-1',   N'301-1', N'ЛБ-К', 15);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
											 values  (N'236-1',   N'236-1', N'ЛК',   60);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
											 values  (N'313-1',   N'313-1', N'ЛК',   60);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
											 values  (N'324-1',   N'324-1', N'ЛК',   50);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
											 values  (N'413-1',   N'413-1', N'ЛБ-К', 15);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
											 values  (N'423-1',   N'423-1', N'ЛБ-К', 90);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
											 values  (N'408-2',   N'408-2', N'ЛК',  90);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
											 values  (N'103-4',   N'103-4', N'ЛК',  90);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
											 values  (N'105-4',   N'105-4', N'ЛК',  90);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
											 values  (N'107-4',   N'107-4', N'ЛК',  90);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
											 values  (N'110-4',   N'110-4', N'ЛК',  30);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
											 values  (N'111-4',   N'111-4', N'ЛК',  30);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
											values  (N'114-4',   N'114-4', N'ЛК-К',  90 );
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
											 values (N'132-4',   N'132-4', N'ЛК',   90);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
											 values (N'02Б-4',   N'02Б-4', N'ЛК',   90);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
											 values (N'229-4',   N'229-4', N'ЛК',   90);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
											 values  (N'304-4',   N'304-4',N'ЛБ-К', 90);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
											 values  (N'314-4',   N'314-4', N'ЛК',  90);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
											 values  (N'320-4',   N'320-4', N'ЛК',  90);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
											 values  (N'429-4',   N'429-4', N'ЛК',  90);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
												values  (N'?',   N'???', N'ЛК',  90);
-----------------------------------------------------------------------------------------------------------------------
