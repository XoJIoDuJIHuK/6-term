- TS
	- everyday types
		- string
		- number
		- boolean
		- array
		- any
		- functions (parameters and return types)
		- objects and optional properties
		- union types (string | number)
		- type alias and interface
			- key distinction is that a type cannot be re-opened to add new properties vs an interface which is always extendable
			- ```
				interface Bear extends Animal {
					honey: boolean;
				}
			  ```
			- ```
				type Bear = Animal & { 
					honey: boolean;
				}
			  ```
		- assertions
    		- const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
    		- const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
  		- literal types (let x: 'value' = 'value'; x = 'xd'//error)
  		- enum
			```
			enum Direction {
				Up = 1, //default 0
				Down,
				Left,
				Right,
			}
			```
	- 