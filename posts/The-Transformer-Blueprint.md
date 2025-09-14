---
title: "The Transformer Blueprint"
date: "2023-11-09"
excerpt: ""
tags: ["Notes", "Paper", "AI"]
author: "Ed"
---

## Predecessors

### MLP

Due to their feedforward design, they can not preserve the order of information in a sequence. Sequence data lose meaning when the order of the data is lost. Thus, the inability of MLPs to preserve order of information make them unsuitable for sequence modelling.

Also, MLPs takes lots of paramaters which is another undesired property a neural network can have.

### CNN

Most known for processing images and other modalities such as texts and videos.

### RNN

## Transformer

### Encoder

Encoder transforms input sequence into compressed representation.

Each encoder block has 3 main layers which are multi-head attention(MHA), layer norm, and MLPs(or feedforward according to the paper).

### Decoder

Pretty much the same as encoder except additional multi-head attention that operated over the output of the encoder.

decoder is highly similar to encoder except that the self-attention in decoder is masked to prevent the model to look at subsequent tokens when generating current token.

The goal of the decoder is to fuse encoder output with the target sequence and to make predictions(or to predict the next token).

Decoder is also typically repeated the same times as encoder.

### Attention

In essence, attention is a mechanism that can allow the neural network to pay more attention to the part of input data that contains meaningful information and pay less attention to the rest of the input.

### Multi-Head Attention

Multi-head attention is basically multiple independent attentions computed over linearly projected QKV vectors.

it doesn’t increase the overall computation cost because the dimension of each head is oneth of number of heads(i.e, heads in base transformer is 8) of the overall model dimension(ie, 512).

computing multiple attentions in parallel allows the model to “jointly attend to information from different representation subspaces at different positions.”

### Embeddings

These embedding layers convert input or output tokens into dense vectors of a fixed size, essentially mapping each token in a sequence to a specific dense vector.

Utilizing embeddings is a standard practice in language modeling due to the semantic depth they provide. With these embedded token vectors, those bearing similar semantic meanings tend to align in the same direction.

### Positional Encodings

serve as integral components in the initial stages of both the encoder and decoder within a Transformer model. They are used to preserve the order of tokens in a sequence.

This stems from the inherent permutation invariance of the attention mechanism, whereby modifying the order of tokens does not alter the output weighted values[4](https://deeprevision.github.io/posts/001-transformer/#fn4). Consequently, the attention mechanism, on its own, lacks awareness of the token order. As the transformer architecture does not incorporate any other recurrence methods, positional encodings are introduced to equip the model with positional awareness of the tokens in the sequence.

In essence, without positional encodings, a Transformer would indeed exhibit permutation invariance. However, such a design would fall short for tasks where sequence order holds significance, as is the case for most NLP tasks.

### Residual Connections

Residual connections alleviate unstable gradient problems and they help the model to converge faster.

> residual connections carry positional information to higher layers, among other information.

### Layer Normalization

Layer normalization significantly reduces the training time by normalizing the activations of a layer with the layer mean and variance.

Unlike batch normalization([Ioffe and Szegedy 2015](https://deeprevision.github.io/posts/001-transformer/#ref-ioffe2015batch)) that normalizes each layer with mean and variance computed over the mini-batch, layer norm just normalizes each layer with the mean and variance of each activation.

Layer normalization maintains similar behavior during both training and testing phases, unlike batch normalization which exhibits different behaviors in these two stages.

2 kinds:

- Post-LN
- Pre-LN

### Linear and Softmax Layers

The linear layer after decoder takes the decoded activations and project them to the size of the vocabulary. This linear layer will basically produce logits. The softmax layer will take those logits and turn them into next-token probabilities. The next predicted token will be basically the argmax of softmax output.

## Pros

- 每个输出 token 都可以直接访问输入序列的所有 token，从而保存了整体语境
  - 传统 RNN（LSTM、GRU）都存在 long-term dependencies 的问题，导致模型保留信息的能力随时间弱化
  - CNN 的感知域是本地的且依赖于 kernel size，导致语境的损失
- 可以并行处理输入序列的所有 token
- 一定程度的可解释性，因为 attention 高亮了对于生成特定输出最重要的输入序列部分
- 在 NLP 等领域达到 SOTA

## Cons

- 某些种类 attention 的内存消耗、计算代价达到输入序列长度的平方
  - 诸如 sparse attention, local attention 等策略被提出来应对这一点
- 仍需要根据特定任务采用顺序方法：transformers 逐个生成输出标记，并持续进行迭代过程，直到完整产生所需的输出序列为止
- 可解释性不够强

## Training

LLMs 的训练过程大体一致：暴露给大量仔细筛选过的文本数据（来自书籍、文章、代码、网站......），自监督学习，因为不可能给那么大量的数据打标签，但这需要巧妙地实施训练目标，因为没有参考的真实结果，所以大多数 LLMs 使用 NTP（下一个令牌预测）或 MLM（掩码语言建模）作为常见训练目标。

经过预训练，模型可通过零样本学习或少样本学习等技术来生成文本，二者都是 ICL（上下文学习）的例子，ICL 指的是 LLM 能够利用语义先验知识生成连贯的文本，并且不需要进行任何参数更新。ICL 在简单任务上表现优秀，但在复杂一些的任务（不能简单地用 prompts 描述的各种下游任务，如数学、医学、科学）表现不佳，这时就需要用下游数据集 fine-tune 基础 LLMs。

## Encoder-only LLMs

Encoder-only LLMs are typically used for NLP discriminative tasks such as text classification and sentiment analysis.

finetune on various downstream tasks with additional task-specific head.

## Decoder-only LLMs

Decoder LLMs are trained with next token prediction objective. As a result, they can only generate one token at time or autoregressively. Overally, decoder models are used in generative tasks.
