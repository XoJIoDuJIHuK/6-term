from collections import namedtuple

Rotor = namedtuple('Rotor', ['notch', 'wheel', 'offset'])
alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
N = len(alphabet)

class EnigmaCipher:
	def __init__(self):
		self.rotors = [Rotor('A', 'JPGVOUMFYQBENHZRDKASXLICTW', 0), 
					   Rotor('B', 'ESOVPZJAYQUIRHXLNFTGKDCMWB', 1), 
					   Rotor('C', 'AJDKSIRUXBLHWTMCQGZNPYFVOE', 2)]
		self.reflector = Rotor('R', 'AYBRCUDHEQFSGLIPJXKNMOTZVW', 0)
		self.rotor_order = [0, 1, 2]
		self.rotor_positions = [0, 0, 0]
		self.rotation_scheme = [1, 2, 2]

		self.rotor_positions[self.rotor_order[0]] = (self.rotor_positions[self.rotor_order[0]] + 1) % N
		self.rotor_positions[self.rotor_order[1]] = (self.rotor_positions[self.rotor_order[1]] + 1) % N
		self.rotor_positions[self.rotor_order[2]] = (self.rotor_positions[self.rotor_order[2]] + 1) % N

	def encrypt(self, plaintext):
		plaintext = plaintext.upper()
		encrypted_text = ''
		for char in plaintext:
			if char in alphabet:
				encrypted_char = char
				for rotor_index in self.rotor_order:
					self.rotor_positions[rotor_index] = (self.rotor_positions[rotor_index] + self.rotation_scheme[rotor_index]) % N
					encrypted_char = self.rotors[rotor_index].wheel[(alphabet.index(encrypted_char) + 
													self.rotor_positions[rotor_index]) % N]
				reflector_index = self.reflector.wheel.index(encrypted_char)
				encrypted_char = self.reflector.wheel[reflector_index + 1 if reflector_index % 2 == 0 else reflector_index - 1]
				for rotor_index in self.rotor_order[::-1]:
					encrypted_char = alphabet[(self.rotors[rotor_index].wheel.index(encrypted_char) + 
								self.rotor_positions[rotor_index]) % N]
				encrypted_text += encrypted_char
			else:
				encrypted_text += char
				
		return encrypted_text
	

enigma = EnigmaCipher()
source = 'ALEH TACHYLA'
ciphered = enigma.encrypt(source)
print(source)
print(ciphered)