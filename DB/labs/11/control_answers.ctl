LOAD DATA
INFILE 'D:\6-term\DB\labs\11\answers_oracle.csv'
APPEND
INTO TABLE table_answers
FIELDS TERMINATED BY ";"
(
  commentary "UPPER(:commentary)",
  rigth_float "ROUND(:rigth_float,1)",
  update_date DATE "dd/mm/yyyy"
)