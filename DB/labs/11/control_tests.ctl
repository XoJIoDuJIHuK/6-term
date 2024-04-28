LOAD DATA
INFILE 'D:\6-term\DB\labs\11\tests_oracle.csv'
APPEND
INTO TABLE table_tests
FIELDS TERMINATED BY ";"
(
  got_answer "UPPER(:got_answer)",
  success_rate "ROUND(:success_rate,1)",
  test_date DATE "dd/mm/yyyy"
)