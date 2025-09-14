---
title: "Lecture 05 Machine-Level Programming pt1 Basics"
date: "2023-03-17"
excerpt: ""
tags: ["Notes", "Tech", "CSAPP 15-213"]
author: "Ed"
---

# History of Intel processors and architectures

CISC vs. RISC

# C, assembly, machine code

## Definitions

- Architecture: (also ISA: Instruction Set Architecture) The parts of a processor design that one needs to understand or write assembly/machine code. E.g. instruction set specification, registers.
- Microarchitecture: Implement of the architecture. E.g. cache sizes and core frequency.
- Code Forms
  - Machine Code: The byte-level programs that a processor executes.
  - Assembly Code: A text representation of machine code.
- Example ISAs
  - Intel: x86, IA32, Itanium, x86-64
  - ARM

## Assembly/Machine Code View

Cache is not visible in terms of programs:

- no instructions to manipulate the cache
- no way to directly access the cache

## Turning C into Object Code

"-S" means stop after this single step, which turns .c into .s file.

## Assembly Characteristics

### Data Types

- Integer data of 1, 2, 4, or 8 bytes
  - Data values
  - Addresses (untyped pointers)
- Floating point data of 4, 8, or 10 bytes
- Codes are byte sequences that encode a series of instructions
- No aggregate types such as arrays or structures
  - Just contiguously allocated bytes in memory

### Operations

Each instruction typically does one thing.

- Perform arithmetic function on register or memory data
- Transfer data between memory and register
  - Load data from memory into register
  - Store register data into memory
- Transfer control
  - Unconditional jumps to/from procedures
  - Conditional branches

quad word refers to 64bit. (a word = 2 bytes)

All the names of variables are completely lost at the assembly/machine code level.

Anything that can be interpreted as executable code can be disassembled.

Disassembler examines bytes and reconstructs assembly s?..

# Assembly Basics: Registers, operands, move

## x86-64 Integer Registers

8 registers given by name, and 8 given by number.

%rax refers to 64 bits, while %eax refers to 32 bits.

%rsp is special. It's called the stack pointer, and it's for special purpose.

The number of registers doubled from IA32 to x86-64.

## Operands

The scale factor is up to the data type. E.g. int is of 4 bytes.

# Arithmetic & logical operations

The code that gets generated (a.k.a. the assembly code) will correctly implement the function. But it might not exactly replicate at a low level the exact sequence of operations you specified at a high level.
