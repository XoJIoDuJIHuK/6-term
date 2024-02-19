# -*- coding: utf-8 -*-

from math import log2
import sys
import os
from pandas import DataFrame
from matplotlib import pyplot as plt

engAlphabet = 'abcdefghijklmnopqrstuvwxyz'
rusAlphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'
binAlphabet = '01'

def entropySh(frequencies):
    result = 0
    for freq in filter(lambda x: x != 0, frequencies):
        result += freq * log2(freq)
    return -result


def entropyH(n):
    return log2(n)


def conditional_entropy(p, q):
    return (-p * log2(p) if p != 0 else 0) - (q * log2(q) if q != 0 else 0)


def get_frequencies(text, alph):
    return [(char, text.count(char)) for char in alph]


def get_probabilities(n, frequencies):
    return [round(item[1] / n, 2) for item in frequencies]


def effective_entropy(entropy, err_chance):
    con_ent = conditional_entropy(1 - err_chance, err_chance)
    return 1 - con_ent


def get_filtered_text(alph, text):
    return list(filter(lambda x: x in alph, text.lower()))


def get_alphabet(lang):
    return engAlphabet if lang == 'eng' else rusAlphabet if lang == 'rus' else binAlphabet


def create_gistogram(data, header):
    df = DataFrame(data, columns=['Character', 'Number'])
    plt.bar(df['Character'], df['Number'])
    plt.xlabel('Character')
    plt.ylabel('Number')
    plt.title(header)
    plt.show()


def to_ascii(s):
    return ''.join(format(ord(c), '08b') for c in s)


def get_information_amount(entropy, k):
    return entropy * float(k)


def task1(lang: str, text: str):
    alph = get_alphabet(lang)
    filtered_text = get_filtered_text(alph, text)
    frequencies = get_frequencies(filtered_text, alph)
    create_gistogram(data=frequencies, header=text)
    return entropySh(get_probabilities(frequencies=frequencies, n=len(filtered_text)))


def task2(text: str):
    return task1('bin', to_ascii(text))


def task3(name, bin_name):
    print('кириллица', get_information_amount(task1('rus', name), 
                                              len(get_filtered_text(get_alphabet('rus'), name))))
    print('бинарный алфавит', get_information_amount(task2(bin_name),
                                              len(get_filtered_text(get_alphabet('bin'), bin_name))))
    

def task3_patched(entropy, text):
    print(text, get_information_amount(entropy=entropy, k=len(text)))


def task4(name, bin_name, entropy_source, entropy_binary, err_chance):
    print('кириллица', get_information_amount(effective_entropy(entropy_source, err_chance), len(name)))
    print('бинарный алфавит', get_information_amount(effective_entropy(entropy_binary, err_chance), len(bin_name)))


def main():
    if len(sys.argv) < 2:
        return
    task = sys.argv[1]
    name = 'Точило Олег Вячеславович'
    bin_name = to_ascii(name)
    if task == '1':
        if len(sys.argv) < 4:
            print('введите язык и текст')
            return
        print('задание 1')
        lang, text = sys.argv[2], sys.argv[3]
        if os.path.exists(text):
            with open(text, 'rb') as file:
                text = str(file.read())
        print('энтропия', task1(lang, text))
    elif task == '2':
        if len(sys.argv) < 3:
            print('введите текст')
            return
        print('задание 2')
        text = sys.argv[2]
        print('энтропия', task2(text))
    elif task == '3':
        print('задание 3')
        # task3(name, bin_name)
        entropy_source, entropy_binary, text = float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
        print('source', end=' ')
        task3_patched(entropy=entropy_source, text=text)
        print('ascii', end=' ')
        task3_patched(entropy=entropy_binary, text=to_ascii(text))
    elif task == '4':
        entropy_source, entropy_binary, text = float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
        print('задание 4')
        for chance in [0.1, 0.5, 1]:
            print('вероятность ошибки: ', chance)
            task4(text, bin_name, entropy_source, entropy_binary, chance)
    else:
        print('инвалид параметерс')


main()