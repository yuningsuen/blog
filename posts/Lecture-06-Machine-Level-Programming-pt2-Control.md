---
title: "Lecture 06 Machine-Level Programming pt2 Control"
date: "2023-03-29"
excerpt: ""
tags: ["Notes", "Tech", "CSAPP 15-213"]
author: "Ed"
---

# Control: Condition codes

The basis of how conditional operations work.

There're 8 condition codes (essentially 8 single-bit registers), while this course'll only cover 4 of 'em:

- CF: Carry Flag. Refers to overflow of unsigned.
- OF: Overflow Flag. Refers to overflow of signed.
- SF: Sign Flag. Refers to the MSB (for signed).
- ZF: Zero Flag. Set if the value computed is 0.

Implicitly set (think of it as side effect) by arithmetic operations.
Explicitly set by Compare Instruction (cmpq) & Test Instruction (testq)
Exception: Not set by leaq.

Overflow:

- add 2 positive and get a negative result: positive overflow
- add 2 negative and get a positive result: negative overflow
- can't overflow if the 2 operands are of opposite signs

Instructions that end up with a 'q' refers to operations on 64-bit words a.k.a. quadword.

## Reading Condition Codes

SetX Instructions:

- Set low-order byte of destination to 0 or 1 based on combinations of condition codes
- Does not alter remaining 7 bytes

# Conditional branches

jX Instructions:

- Jump to different part of code depending on condition codes
- Labels. e.g. `jle .L4 \*...*\ .L4: \*...*\`

Conditional Move:

- What is it?
  - Compute the results for both situations
  - Decide which to use according to the condition
- Why bother?
  - Branches are very disruptive to instruction flow through pipelines
  - Conditional moves do not require control transfer
- Both values get computed
- Only makes sense when computations are very simple
- May have undesirable effects. E.g. null pointer dereference
- Must be side-effect free

# Loops

How to turn do-while, while, and for loop into assembly code and converge them into each other.

# Switch Statements
