# 第8章：串口通信 博客文章实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建第8章串口通信的博客文章，记录串口发送和接收数据的学习过程

**Architecture:** 单篇博客文章，包含2个项目的详细介绍，遵循设计规范中的文章结构

**Tech Stack:** Markdown, 51单片机, C语言

---

## 文件结构

- Create: `posts/keil-chapter-8.md`

---

### Task 1: 创建文章文件并添加 Frontmatter

**Files:**
- Create: `posts/keil-chapter-8.md`

- [ ] **Step 1: 创建文章文件并添加 Frontmatter**

```markdown
---
title: "第8章：串口通信 - 从发送到接收的学习记录"
date: "2026-06-18 16:00:00"
tags: ["单片机", "51单片机", "串口", "通信", "嵌入式", "C语言"]
mood: "😊"
cover: ""
description: "记录51单片机串口通信的学习过程，包括串口发送和接收数据等实验"
---
```

- [ ] **Step 2: 提交**

```bash
git add posts/keil-chapter-8.md
git commit -m "feat: 创建第8章串口通信博客文章并添加frontmatter"
```

---

### Task 2: 添加引言部分

**Files:**
- Modify: `posts/keil-chapter-8.md`

- [ ] **Step 1: 添加引言内容**

```markdown
## 引言

串口通信是单片机与外部设备通信的重要方式。本章将学习：
- 串口通信的基本原理
- 串口发送数据的方法
- 串口接收数据的方法

本章将从串口发送数据开始，学习如何通过串口控制LED。

## 项目列表

1. **8-1 串口向电脑发送数据**：学习串口发送数据的方法
2. **8-2 电脑通过串口控制LED**：掌握串口接收数据的方法
```

- [ ] **Step 2: 提交**

```bash
git add posts/keil-chapter-8.md
git commit -m "docs: 添加第8章引言和项目列表"
```

---

### Task 3: 添加项目1（8-1串口向电脑发送数据）

**Files:**
- Modify: `posts/keil-chapter-8.md`

- [ ] **Step 1: 添加项目1内容**

```markdown
## 项目1：8-1 串口向电脑发送数据

### 项目目标
通过串口向电脑发送数据，学习串口发送方法。

### 代码解析

**main.c（主程序）：**
```c
/**
 * CPU: 89C52
 * Freq: 12MHz
*/

#include <reg52.h>      // 包含51单片机寄存器定义头文件
#include "delay.h"      // 包含延时函数模块头文件
#include "uart.h"       // 包含串口通信模块头文件

unsigned char sec;      // 秒计数变量

void main()
{
    uart_init();        // 初始化串口
    while (1)
    {
        uart_sendbyte(sec);  // 通过串口发送秒计数值
        sec++;               // 秒计数加1
        delay(1000);         // 延时1秒
    }
}
```

**代码解释：**
- `uart_init()`：初始化串口，设置波特率和通信参数
- `uart_sendbyte()`：通过串口发送一个字节的数据
- 每秒发送一次秒计数值

### 关键知识点
1. **串口初始化**：设置波特率、数据位、停止位等参数
2. **串口发送**：通过SBUF寄存器发送数据
3. **波特率**：串口通信的速度，需要与接收端匹配

### 遇到的问题和解决方法
**问题**：串口接收端收到乱码。

**解决**：检查以下几点：
1. 确认波特率设置正确（通常为9600或115200）
2. 检查数据位、停止位、校验位设置
3. 确认串口连接正确（TX接RX，RX接TX）
4. 检查晶振频率是否与波特率计算匹配
```

- [ ] **Step 2: 提交**

```bash
git add posts/keil-chapter-8.md
git commit -m "docs: 添加第8章项目1（8-1串口向电脑发送数据）"
```

---

### Task 4: 添加项目2（8-2电脑通过串口控制LED）

**Files:**
- Modify: `posts/keil-chapter-8.md`

- [ ] **Step 1: 添加项目2内容**

```markdown
## 项目2：8-2 电脑通过串口控制LED

### 项目目标
通过串口接收电脑发送的数据，控制LED状态。

### 代码解析

**main.c（主程序）：**
```c
/**
 * CPU: 89C52
 * Freq: 12MHz
*/

#include <reg52.h>      // 包含51单片机寄存器定义头文件
#include "delay.h"      // 包含延时函数模块头文件
#include "uart.h"       // 包含串口通信模块头文件

unsigned char sec;      // 秒计数变量

void main()
{
    uart_init();        // 初始化串口
    while (1)
    {
        // 主循环为空，通过中断接收数据
    }
}

// 串口中断服务函数
void uart_routine() interrupt 4
{
    if(RI == 1) {           // 如果接收到数据
        P2 = ~SBUF;         // 将接收到的数据取反后输出到P2端口
        uart_sendbyte(SBUF); // 将接收到的数据回传给电脑
        RI = 0;             // 清除接收中断标志
    }
}
```

**代码解释：**
- `uart_routine() interrupt 4`：串口中断服务函数
- `RI == 1`：检查是否接收到数据
- `SBUF`：串口数据缓冲区，存储接收到的数据
- `P2 = ~SBUF`：将接收到的数据取反后输出到LED
- `uart_sendbyte(SBUF)`：将接收到的数据回传给电脑

### 关键知识点
1. **串口接收**：通过中断方式接收串口数据
2. **中断标志**：RI为接收中断标志，需要手动清除
3. **数据回传**：将接收到的数据回传给发送端，用于确认

### 遇到的问题和解决方法
**问题**：串口接收不到数据或接收不完整。

**解决**：检查以下几点：
1. 确认串口中断已启用（ES=1，EA=1）
2. 检查RI标志是否正确清除
3. 确认波特率与发送端匹配
4. 检查串口连接是否正确
```

- [ ] **Step 2: 提交**

```bash
git add posts/keil-chapter-8.md
git commit -m "docs: 添加第8章项目2（8-2电脑通过串口控制LED）"
```

---

### Task 5: 添加总结部分

**Files:**
- Modify: `posts/keil-chapter-8.md`

- [ ] **Step 1: 添加总结内容**

```markdown
## 总结

通过第8章的学习，我掌握了串口通信的基础知识：

1. **串口原理**：理解了串口通信的基本原理和参数设置
2. **串口发送**：学会了通过串口发送数据
3. **串口接收**：掌握了通过中断接收串口数据的方法
4. **数据回传**：学会了将接收到的数据回传给发送端

这些知识为后续学习LED点阵、DS1302时钟等内容打下了基础。

## 下一步学习

接下来将学习第9章：LED点阵屏，了解如何通过LED点阵屏显示图形和动画。
```

- [ ] **Step 2: 提交**

```bash
git add posts/keil-chapter-8.md
git commit -m "docs: 添加第8章总结和下一步学习"
```

---

### Task 6: 最终检查和提交

**Files:**
- Modify: `posts/keil-chapter-8.md`

- [ ] **Step 1: 检查文章完整性**

确认文章包含：
- Frontmatter（标题、日期、标签、心情、封面、描述）
- 引言部分
- 项目列表
- 2个项目的详细介绍（项目目标、代码解析、关键知识点、遇到的问题和解决方法）
- 总结部分
- 下一步学习

- [ ] **Step 2: 检查代码注释**

确认所有代码都有中文注释，即使是原代码中没有注释的部分也补充了简单注释。

- [ ] **Step 3: 最终提交**

```bash
git add posts/keil-chapter-8.md
git commit -m "feat: 完成第8章串口通信博客文章"
```
