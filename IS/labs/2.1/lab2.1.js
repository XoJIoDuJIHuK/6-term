function BCD2(a, b) { //по примеру 14
	if (!b) {
		return a
	}
	return BCD2(b, a % b)
}
function BCD3(a, b, c) {
	return BCD2(BCD2(a, b), c);
}

function isPrime(n) {
	if (n < 2) {
		return false
	}
	for (let i = 2; i <= Math.sqrt(n); i++) {
		if (n % i === 0) {
			return false
		}
	}
	return true
}

function countPrimes(maxNumber) {
	let count = 0
	for (let i = 2; i <= maxNumber; i++) {
		if (isPrime(i)) {
			count++
		}
	}
	return count
}

function getDivisors(n, primes) {
	const ret = []
	for (let prime of primes) {
		while (n > 1 && n % prime === 0) {
			ret.push(prime)
			n /= prime
		}
	}
	return ret
}

function task1(start, end) {
	console.log(`[${start}; ${end}]`)
	const finalCount = countPrimes(end) - countPrimes(start - 1)
	const expectedCount = (end / Math.log(end)) - ((start - 1) / Math.log(start - 1))
	console.log(`got number: ${finalCount} ${finalCount < expectedCount ? '<' : finalCount > expectedCount ? '>' : '='} ${expectedCount}`)
}

function Eratosthenes(n, m) {
	const isPrime = new Array(m + 1).fill(true);
	isPrime[0] = isPrime[1] = false;

	for (let i = 2; i <= Math.sqrt(m); i++) {
		if (isPrime[i]) {
			for (let j = i * i; j <= m; j += i) {
				isPrime[j] = false;
			}
		}
	}

	const primes = [];
	for (let i = n; i <= m; i++) {
		if (isPrime[i]) {
			primes.push(i);
		}
	}

	return primes;
}

//вариант 13
const m = 379
const n = 411

console.log('task1')
task1('2, n', 2, n)
task1('m, n', m, n)

console.log('task2')
const primes = Eratosthenes(2, n)
console.log('2, n', primes)
console.log('n, m', Eratosthenes(m, n))

console.log('divisors n', getDivisors(n, primes))
console.log('divisors m', getDivisors(m, primes))
console.log('is prime m | n?', isPrime(m | n))
console.log('bcd m, n', BCD2(m, n))


//n=3780 (2^2*3^3*5*7)