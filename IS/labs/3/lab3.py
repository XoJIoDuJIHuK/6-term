from base64 import b64encode
import os
import lab1

def read_file(path):
    with open(path, 'rb') as file:
        result = file.read()
    return result


def string_to_base64(path):
    s = path.encode('utf-8')
    if os.path.exists(path):
        s = read_file(path)
    return b64encode(s).decode("utf-8")


def surplus(text):
    lang = 'eng'
    aplhabet = lab1.get_alphabet(lang)
    filtered_text = lab1.get_filtered_text(alph=aplhabet, text=text)
    frequencies = lab1.get_frequencies(text=filtered_text, alph=aplhabet)
    entropyShenon = lab1.entropySh(lab1.get_probabilities(frequencies=frequencies, n=len(filtered_text)))
    entropyHartley = lab1.entropyH(len(filtered_text))
    return (entropyHartley - entropyShenon/ entropyHartley)


def to_string(bit_param):
    binary_string = ""
    
    for byte in bit_param:
        binary_byte = bin(byte)[2:].zfill(8)
        binary_string += binary_byte
    
    return binary_string


def xor(a, b):
    if len(a) < len(b):
        a = b'\0' * (len(b) - len(a)) + a
    elif len(b) < len(a):
        b = b'\0' * (len(a) - len(b)) + b
    return bytes(x ^ y for x, y in zip(a, b))

print('task 1')
text = str(read_file('/home/xojiodujihuk/6-term/IS/labs/3/lab3.py'))
print(text)
based_text = string_to_base64(text)
print(based_text)

print('task 2')
print('entropy a', lab1.task1(lang='eng', text=text))
print('entropy b', lab1.task1(lang='eng', text=based_text))
print(f'surplus a {surplus(text) * 100}%')
print(f'surplus b {surplus(based_text) * 100}%')

print('task 3')
name = 'Oleg'
last_name = 'Tochilo'
print(to_string(name.encode('ascii')))
print(to_string(last_name.encode('ascii')))
print(to_string(xor(name.encode('ascii'), last_name.encode('ascii'))))
print(to_string(xor(string_to_base64(name).encode('utf-8'), string_to_base64(last_name).encode('utf-8'))))