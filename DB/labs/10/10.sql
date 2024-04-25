drop tablespace lob_tdb including contents and datafiles;
drop DIRECTORY dfile_dir;
CREATE TABLESPACE lob_tdb DATAFILE '/home/oracle/db_labs/10/log_tbs.dbf' SIZE 100M;
create DIRECTORY dfile_dir as '/home/oracle/db_labs/10/BFILE';

CREATE USER lob_user IDENTIFIED BY password;

GRANT CREATE SESSION, create tablespace, CREATE TABLE, create any directory, drop any directory TO lob_user;
GRANT READ, WRITE ON DIRECTORY dfile_dir TO lob_user;

ALTER USER lob_user QUOTA UNLIMITED ON lob_tdb;

drop table lob_table;
create table lob_table (
    FOTO BLOB,
    PDF BFILE
) tablespace lob_tdb;

insert into lob_table values (BFILENAME('dfile_dir', '1.jpg'), bfilename('dfile_dir', '1.pdf'));