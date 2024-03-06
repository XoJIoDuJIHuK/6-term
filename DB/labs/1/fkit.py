import math

for i in range(4):
    for j in range(5):
        print(f"insert into STAFF (NAME, PRINCIPAL, ROLE) values ('{'developer' if i < 2 else 'tester'} {i * 5 + j + 1}', {i + 2}, {4 + math.floor(i / 2)});")