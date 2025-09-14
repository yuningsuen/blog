---
title: "Lecture 04 Floating Point"
date: "2023-02-15"
excerpt: ""
tags: ["Notes", "Tech", "CSAPP 15-213"]
author: "Ed"
---

# Background: Fractional Binary Numbers

## Representable Numbers (Limitations)

- Can only exactly represent numbers of the form $\frac{x}{2^k}$
  - Other rational numbers have repeating bit representations, such as $\frac{1}{3}==0.0101[01]_2$
- Just one setting of binary point within the $w$ bits
  - A tradeoff: bigger range of numbers, or more representable fractional numbers?

# IEEE Floating Point

Floating point is a kind of shifting binary point.

Numerical form:
$$(-1)^sM2^E$$

- Sign bit $s$ determines whether it's positive or negative
- Significand $M$ a.k.a. Mantissa normally is a fractional value in the range $[1.0,2.0)$
- Exponent $E$ weights value by power of 2

Encoding:

- MSB is the sign bit $s$
- Exp field encodes $E$ (but is not equal to $E$)
- Frac field encodes $M$ (but is not equal to $M$)

## Precision Options

- Single precision 32 bits: 1 bit for $s$, 8 bits for $E$ and 23 bits for $M$
- Double precision 64 bits: 1 bit for $s$, 11 bits for $E$ and 52 bits for $M$
- Extended precision 80 bits (intel only): 1 bit for $s$, 15 bits for $E$ and 63/64 bits for $M$

## Normalized Values

- $Exp\neq 000\dots0\ and\ Exp\neq 111\dots1$
  - So the range of Exp would be $[1,2^k-2]$
  - For example, in the single precision 32 bits case: $1\leq Exp\leq 254\Rightarrow -126\leq E\leq 127$
- Exponent coded as a biased value: $E=Exp-Bias$
  - Exp: unsigned value of Exp field
  - $Bias=2^{k-1}-1$ where $k$ is the number of exponent bits
- Significand coded with implied leading 1: $M=1.x_1x_2x_3...x_n$

## Denormalized Values

- $Exp=000\dots0$
- $E=1-Bias$ (instead of $E=0-Bias$)
  - To keep consistent with the smallest norm case
  - A nice smooth transition from denorm to norm
- Significand coded with implied leading 0: $M=0.x_1x_2x_3...x_n$

## Special Values

- $Exp=111\dots1,Frac=000\dots0$
  - Represents infinity
  - Operation that overflows
  - Both positive and negative
  - E.g., 1.0/0.0
- $Exp=111\dots1,Frac\neq000\dots0$
  - Not-a-Number a.k.a. NaN
  - When no numerical value can be determined
  - E.g., sqrt(-1)

## Distribution of Values

The distribution gets denser toward 0.

## Special Properties of the IEEE Encoding

- FP zero same as integer zero (bitwise)
- Can almost use unsigned integer comparison
  - Must first compare sign bit
  - Must consider -0 = 0
  - NaNs
  - Otherwise OK
    - Denorms vs. norms
    - Norms vs. infinity

## FP Operations: Basic Idea

- First compute exact result
- Make it fit into desired precision
  - Possibly overflow if exponent too large
  - Possibly round to fit into frac

## Rounding

Rounding modes:

- Towards 0
- Round down ($-\infty$)
- Round up ($+\infty$)
- Nearest even (default)
  - Hard to get any other kind without dropping into assembly
  - All others are statistically biased: sum of set of positive numbers will consistently be over- or under-estimated

## Rounding Binary Numbers

Binary Fractional Numbers:

- Even: when least significant bit is 0
- Half way: when bits to right of rounding position are $100\dots_2$

## FP Multiplication

$$(-1)^{s_1}M_12^{E_1}\times (-1)^{s_2}M_22^{E_2}=(-1)^{s}M2^{E}$$

- $s=s_1\bigoplus s_2$
- $M=M_1\times M_2$
- $E=E_1+E_2$
- If $M\geq2$, shift M right and increment E
- If E out of range, overflow
- Round M to fit frac precision

## FP Addition

$$(-1)^{s_1}M_12^{E_1}+(-1)^{s_2}M_22^{E_2}=(-1)^{s}M2^{E}$$

- Assume $E_1>E_2$
- s, M: result of signed align & add
- $E=E_1$
- If $M\geq 2$, shift M right, increment E
- If $M<1$, shift M left k positions, decrement E by k
- Overflow if E out of range
- Round M to fit frac precision

## Mathematical Properties of FP Addition

- Closed under addition//加法封闭性
  - But may generate infinity or NaNs
- Commutative//交换性
- But not associative//但没有结合性
  - Overflow and inexactness of rounding
  - e.g., $(3.14+1e10)-1e10=0$, whereas $3.14+(1e10-1e10)=3.14$
- 0 is additive identity//加法恒等元
- Every element has additive inverse//逆元
  - Except for infinities and NaNs
- Almost monotonicity//单调性
  - Except for infinities and NaNs
  - e.g., double d; float f; d>f -> -d<-f

## Mathematical Properties of FP Multiplication

- Closed under addition//乘法封闭性
  - But may generate infinity or NaNs
- Commutative//交换性
- But not associative//但没有结合性
  - Overflow and inexactness of rounding
  - e.g., $(1e20*1e20)*1e-20=inf$, whereas $1e20*(1e20*1e-20)=1e20$
- 1 is multiplicative identity//乘法恒等元
- Mult doesn't distribute over addition//没有分配律
  - Overflow and inexactness of rounding
  - e.g., $1e20*(1e20-1e20)=0.0$, whereas $1e20*1e20-1e20*1e20=inf$
- Almost monotonicity//单调性
  - Except for infinities and NaNs

## FP in C

- float: single precision FP, 23 bits of frac field
- double: double precision FP, 52 bits of frac field
- Casting between float, double and int changes bit representation
- float/double -> int
  - Truncates fractional part (only when double -> int)
  - Like rounding towards zero
  - Not defined when out of range or NaN: generally sets to TMin
- int -> double
  - Exact conversion, as long as int has word size of no more than 53 bits
- int -> float
  - Will round according to rounding mode
