import time
import tkinter as tk

def RC4crypt(data, key):
    """RC4 algorithm"""
    x = 0
    start = time.time_ns()
    box = list(range(256))
    for i in range(256):
        x = (x + box[i] + key[i % len(key)]) % 256
        box[i], box[x] = box[x], box[i]
    print('time measured: ', time.time_ns() - start)
    x = y = 0
    out = []
    for char in data: 
        x = (x + 1) % 256
        y = (y + box[x]) % 256
        box[x], box[y] = box[y], box[x]
        out.append(chr(ord(char) ^ box[(box[x] + box[y]) % 256]))
    return ''.join(out)

key = [20, 21, 22, 23, 60, 61]
encrypted = RC4crypt('aleh is my favourite dochenka', key)
print()
print(encrypted)
decrypted = RC4crypt(encrypted, key)
print(decrypted)

root = tk.Tk()
root.title("RC4")

def render_cipher():
    try:
        input_value = entry.get()
        ciphered = RC4crypt(input_value, key)
        deciphered = RC4crypt(ciphered, key)
        result_label.config(text=f"Ciphered: {ciphered}\nDeciphered: {deciphered}")
    except ValueError:
        result_label.config(text="Invalid input. Please enter a valid string")

entry = tk.Entry(root)
entry.pack()
calculate_button = tk.Button(root, text="Зашифровать", command=render_cipher)
calculate_button.pack()
result_label = tk.Label(root, text="")
result_label.pack()
# root.mainloop()