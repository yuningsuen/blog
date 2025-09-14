---
title: "Lecture 02&03 Bit, Bytes and Integers"
date: "2023-02-14"
excerpt: ""
tags: ["Notes", "Tech", "CSAPP 15-213"]
author: "Ed"
---

# Unsigned & Two's Complement

The most significant bit a.k.a. MSB has different weight in the two cases: $2^{w-1}$ in unsigned case and $-2^{w-1}$ in two's complement case.

If there is a mix of signed & unsigned in a single expression, signed values implicitly cast to unsigned values.

# Addition

## Unsigned Addition

- Addition mod $2^w$
- Mathematical addition + possible subtraction of $2^w$ (which equals mod $2^w$)

### Overflow

Only one kind of overflow.

## Two's Complement Addition

TAdd and UAdd have identical bit-level addition behavior: normal addition followed by truncate, same operation on bit level.

- Modified addition mod $2^w$ (result in proper range)
- Mathematical addition + possible addition or subtraction of $2^w$ (which equals mod $2^w$)

### Overflow

- True sum requires $w+1$ bits to represent
- Drop off MSB
- Treat remaining bits as 2's comp. integer
- Two kinds of overflow: positive and negative

# Multiplication

## Unsigned Multiplication

- Multiplication mod $2^w$
- True product requires up to $2w$ bits
- UMult discards the high order $w$ bits
- $UMult_w (u,v)=u\cdot v\ mod \ 2^w$

## Two's Complement Multiplication

- Modified multiplication mod $2^w$ (result in proper range)

# Shifting

## Power-of-2 Multiply with Shift

- $u<<k==u*2^k$
- Both signed and unsigned.
- Shift operation is way more faster than multiplication.

## Power-of-2 Divide with Shift

### Unsigned

- $u>>k==\lfloor u/2^k\rfloor$
- Uses logical shift.

### Signed

- Positive case: $u>>k==\lfloor u/2^k\rfloor$
- Negative case: $u>>k==\lceil u/2^k\rceil$
- To fix the ceil/floor asymmetry, in negative cases, a little trick is to add 1 to the lowest bit before the shift.
- Uses arithmetic shift.

# Counting Down with Unsigned

It's easy to make mistakes like this:

```c
unsigned i;
for(i = cnt - 2; i >= 0; i--)
	...
```

The loop is infinite and will never end.

And can be very subtle like this:

```c
#define DELTA sizeof(int)
int i;
for(i = cnt - 2; i - DELTA >= 0; i--)
	...
```

Since sizeof(int) is of size_t type which is an unsigned long integer.

Instead, proper way to use unsigned as loop index:

```c
unsigned i;
for(i = cnt - 2; i < cnt; i--)
	...
```

Even better:

```c
size_t i;
for(i = cnt - 2; i < cnt; i--)
	...
```

Datatype size_t defined as unsigned value with length == word size.

# When to use unsigned?

- When performing modular arithmetic which is the way most encryption algorithms work
  - Multiprecision arithmetic
- When using bits to represent sets instead of numbers.
  - Logical right shift, no sign extension.

# Representations in Memory, Pointers, Strings

## Byte Ordering

- Big Endian
  - Least significant byte has highest address
- Little Endian: ARM, x86
  - Least significant byte has lowest address

## Representing Strings

Strings in C:

- Represented by array of characters
- Each char encoded in ASCII format
  - Standard 7-bit encoding of character set
- String should be null-terminated
  - Final char a.k.a. null-terminator = 0
- Same on all machines
