import math
import tkinter as tk

def rsa(initial_state, a, c, n):
    xi = initial_state
    while True:
        xi = (a * xi + c) % n
        yield xi

gen = rsa(1, 421, 1663, 7875)
for i in range(20):
    print(next(gen))

root = tk.Tk()
root.title("Генертор")

def render_cipher():
    try:
        result_label.config(text=f"{next(gen)}")
    except ValueError:
        result_label.config(text="Invalid input. Please enter a valid string")

calculate_button = tk.Button(root, text="Следующий", command=render_cipher)
calculate_button.pack()
result_label = tk.Label(root, text="")
result_label.pack()
root.mainloop()

# rsa - e взаимно простое с (p-1)(q-1), n = pq, xi-1^emodn
# bbs - p === q === 3mod4 xi-1^2modn, берётся младший бит