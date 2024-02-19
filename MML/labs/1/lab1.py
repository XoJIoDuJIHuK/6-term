import numpy as np
filter_value = 7
print('NumPy')

# создайте двумерный массив из 20 целых случайных чисел
array = np.random.randint(low=1, high=10, size=(4, 5))

# разделите полученный массив на 2 массива
array1, array2 = np.split(array, 2)

# найдите все заданные значения в первом массиве (например, равные 6)
found_elements = np.where(array1 == filter_value)

# подсчитайте количество найденных элементов
count = len(found_elements[0])

print("Первоначальный массив:")
print(array)
print("Первый подмассив:")
print(array1)
print("Второй подмассив:")
print(array2)
print(f"\nНайденные элементы, равные {filter_value}, в первом подмассиве: {found_elements}")
print(f"Количество найденных элементов, равных {filter_value}: {count}")




import pandas as pd
print('Pandas')

# создайте объект Series из массива NumPy
array = np.array([1, 2, 3, 4, 5])
series = pd.Series(array)

# произведите с ним различные математические операции
squared = series ** 2
sum_value = series.sum()
mean_value = series.mean()

# создайте объект Dataframe из массива NumPy
data = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
df = pd.DataFrame(data)

# напишите строку заголовков в созданном Dataframe
df.columns = ['A', 'B', 'C']

# удалите любую строку
df = df.drop(1)

# удалите любой столбец
df = df.drop('B', axis=1)

# выведите размер получившегося Dataframe
shape = df.shape

# найдите все элементы равные какому-либо числу
found_elements = df[df == 5]

print("Объект Series:")
print(series)
print("\nРезультат возведения в квадрат:")
print(squared)
print("\nСумма элементов:")
print(sum_value)
print("\nСреднее значение:")
print(mean_value)

print("\nОбъект DataFrame:")
print(df)
print("\nРазмер DataFrame:")
print(shape)
print("\nНайденные элементы, равные 5:")
print(found_elements)