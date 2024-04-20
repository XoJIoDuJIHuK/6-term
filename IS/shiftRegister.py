initial_state = '100101'
step = 0
state = initial_state
while True:
    new_first_digit = '0' if state[0] == state[5] else '1' 
    state = new_first_digit + state[:-1]
    step += 1
    print(step, state)
    if state == initial_state:
        break
