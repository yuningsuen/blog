---
title: "TransMIL Transformer based Correlated Multiple Instance Learning for Whole Slide Image Classification"
date: "2023-11-14"
excerpt: ""
tags: ["Notes", "Paper", "AI", "Medical Image Analysis"]
author: "Ed"
---

## Related Work

MIL 在 WSIs 的应用分为两类：实例级别 & 嵌入级别

实例级别：a CNN is first trained by assigning each instance a pseudo-label based on the bag-level label, and then the top-k instances are selected for aggregation. However, this method requires a large number of WSIs, since only a small number of instances within each slide can actually participate in the training.

嵌入级别：each patch in the entire slide is mapped to a fixed-length embedding, and then all feature embeddings are aggregated by an operator (e.g., max-pooling).

## Method

在 TransMIL 框架中，对 bag 的处理特别强调实例之间的相关性和空间信息，这是与传统 MIL 方法的一个重要区别。这种方法更好地模仿了病理学家在实际诊断中对不同区域的关联性和上下文信息的考虑。

### Overview

1. **WSI 裁剪**：每个 WSI 被裁剪成多个 patch，同时忽略掉背景部分。这些 patch 是进行后续分析的基本单元。
2. **特征向量嵌入**：利用 ResNet50 模型，将这些 patch 嵌入到特征向量中。这一步骤将原始图像数据转换为可以用于深度学习模型的数值形式。
3. **TPT 模块处理**：序列通过 TPT（Transformer Positional encoding and Tokenization）模块进行处理。这个模块包括几个关键步骤：
   - **序列的平方化**：调整序列的形状以适应模型。
   - **序列的相关性建模**：考虑不同 patch 之间的相关性。
   - **条件位置编码和本地信息融合**：结合位置信息和局部特征。
   - **深度特征聚合**：聚合提取的特征以进行更深层次的分析。
   - **T → Y 映射**：将处理后的特征映射到最终的分类标签。

**映射学习**：学习映射 X→T→Y，其中 X 是 bag space，T 是 Transformer 空间，Y 是 label 空间。即将原始图像数据（X）通过 Transformer 模型（T）转换为最终的预测标签（Y）。

### TPT module

2 Transformer layers: for aggregating morphological info
1 position encoding layer(PPEG): for encoding spatial info
