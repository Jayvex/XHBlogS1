# 第3章：按键控制 博客文章实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建第3章按键控制的博客文章，记录独立按键控制LED的学习过程

**Architecture:** 单篇博客文章，包含4个项目的详细介绍，遵循设计规范中的文章结构

**Tech Stack:** Markdown, 51单片机, C语言

---

## 文件结构

- Create: `posts/keil-chapter-3.md`

---

### Task 1: 创建文章文件并添加 Frontmatter

**Files:**
- Create: `posts/keil-chapter-3.md`

- [ ] **Step 1: 创建文章文件并添加 Frontmatter**

```markdown
---
title: "第3章：按键控制 - 从亮灭到移位的学习记录"
date: "2026-06-18 11:00:00"
tags: ["单片机", "51单片机", "按键", "嵌入式", "C语言"]
mood: "😊"
cover: ""
description: "记录51单片机按键控制的学习过程，包括独立按键控制LED亮灭、状态切换、二进制显示和移位等实验"
---
```

- [ ] **Step 2: 提交**

```bash
git add posts/keil-chapter-3.md
git commit -m "feat: 创建第3章按键控制博客文章并添加frontmatter"
```

---

### Task 2: 添加引言部分

**Files:**
- Modify: `posts/keil-chapter-3.md`

- [ ] **Step 1: 添加引言内容**

```markdown
## 引言

按键控制是单片机交互的基础，通过按键可以实现人机交互。本章将学习：
- 独立按键的检测方法
- 按键消抖的原理和实现
- 按键状态切换和移位控制

本章将从最简单的按键控制LED亮灭开始，逐步实现状态切换、二进制显示和移位控制。

## 项目列表

1. **3-1 独立按键控制LED亮灭**：学习按键检测和基本控制
2. **3-2 独立按键控制LED状态**：掌握按键消抖和状态切换
3. **3-3 独立按键控制LED显示二进制**：理解按键计数和二进制显示
4. **3-4 独立按键控制LED移位**：学习按键控制LED移位操作
```

- [ ] **Step 2: 提交**

```bash
git add posts/keil-chapter-3.md
git commit -m "docs: 添加第3章引言和项目列表"
```

---

### Task 3: 添加项目1（3-1独立按键控制LED亮灭）

**Files:**
- Modify: `posts/keil-chapter-3.md`

- [ ] **Step 1: 添加项目1内容**

```markdown
## 项目1：3-1 独立按键控制LED亮灭

### 项目目标
通过独立按键控制LED的亮灭，学习按键检测的基本方法。

### 代码解析
```c
#include <REGX52.H>  // 包含51单片机寄存器定义头文件

void main() {
	while(1){                    // 主循环
		if(P3_1 == 0){          // 检测P3.1引脚是否为低电平（按键按下）
			P2_0 = 0;           // 如果按键按下，点亮LED（P2.0输出低电平）
		}else{
			P2_0 = 1;           // 如果按键松开，熄灭LED（P2.0输出高电平）
		}
	}
}
```

**代码解释：**
- `P3_1 == 0`：检测P3.1引脚是否为低电平，按键按下时通常为低电平
- `P2_0 = 0`：设置P2.0引脚为低电平，点亮LED
- `P2_0 = 1`：设置P2.0引脚为高电平，熄灭LED

### 关键知识点
1. **按键检测**：通过读取引脚电平判断按键状态
2. **引脚位操作**：使用P3_1、P2_0等位变量控制单个引脚
3. **实时控制**：按键状态直接影响LED状态，实现实时控制

### 遇到的问题和解决方法
**问题**：按键检测不稳定，LED会闪烁。

**解决**：这是因为按键存在机械抖动，需要添加消抖处理。在下一个项目中，我将学习如何通过延时消抖来解决这个问题。
```

- [ ] **Step 2: 提交**

```bash
git add posts/keil-chapter-3.md
git commit -m "docs: 添加第3章项目1（3-1独立按键控制LED亮灭）"
```

---

### Task 4: 添加项目2（3-2独立按键控制LED状态）

**Files:**
- Modify: `posts/keil-chapter-3.md`

- [ ] **Step 1: 添加项目2内容**

```markdown
## 项目2：3-2 独立按键控制LED状态

### 项目目标
通过按键切换LED状态，掌握按键消抖和状态切换。

### 代码解析
```c
#include <REGX52.H>  // 包含51单片机寄存器定义头文件

// 延时函数，用于按键消抖（11.0592MHz晶振）
void Delay(unsigned int xms)		//@11.0592MHz
{
	unsigned char i, j;
	while(xms) {
		i = 2;
		j = 199;
		do
		{
			while (--j);
		} while (--i);
		xms--;
	}
}

void main() {
	while(1) {
		if(P3_1 == 0) {          // 检测按键是否按下
			Delay(20);            // 延时20ms进行消抖
			while(P3_1 == 0);     // 等待按键松开
			Delay(20);            // 松开后再次消抖
			P2_0 = ~P2_0;         // 翻转LED状态
		}
	}
}
```

**代码解释：**
- `Delay(20)`：延时20ms进行按键消抖，消除机械抖动
- `while(P3_1 == 0)`：等待按键松开，防止重复触发
- `P2_0 = ~P2_0`：翻转P2.0引脚状态，实现LED状态切换

### 关键知识点
1. **按键消抖**：通过延时消除按键机械抖动，提高检测稳定性
2. **状态切换**：使用取反操作`~`实现状态翻转
3. **等待松开**：防止按键按住时重复触发

### 遇到的问题和解决方法
**问题**：按键按下一次，LED状态切换多次。

**解决**：这是因为没有等待按键松开。添加`while(P3_1 == 0)`等待按键松开，可以确保每次按键只触发一次状态切换。
```

- [ ] **Step 2: 提交**

```bash
git add posts/keil-chapter-3.md
git commit -m "docs: 添加第3章项目2（3-2独立按键控制LED状态）"
```

---

### Task 5: 添加项目3（3-3独立按键控制LED显示二进制）

**Files:**
- Modify: `posts/keil-chapter-3.md`

- [ ] **Step 1: 添加项目3内容**

```markdown
## 项目3：3-3 独立按键控制LED显示二进制

### 项目目标
通过按键计数，用LED显示二进制数值。

### 代码解析
```c
#include <REGX52.H>  // 包含51单片机寄存器定义头文件

// 延时函数，用于按键消抖（11.0592MHz晶振）
void Delay(unsigned int xms)		//@11.0592MHz
{
	unsigned char i, j;
	while(xms){
		i = 2;
		j = 199;
		do
		{
			while (--j);
		} while (--i);
		xms--;
	}
}

void main() {
	unsigned char lednum = 0;  // LED计数变量，记录按键次数
	while(1) {
		if(P3_1 == 0) {          // 检测按键是否按下
			Delay(20);            // 延时20ms进行消抖
			while(P3_1 == 0);     // 等待按键松开
			Delay(20);            // 松开后再次消抖
			
			lednum++;             // 计数加1
			P2 = ~lednum;         // 将计数值取反后输出到P2端口
		}
	}
}
```

**代码解释：**
- `unsigned char lednum = 0`：定义8位无符号字符变量，用于记录按键次数
- `lednum++`：每次按键按下，计数值加1
- `P2 = ~lednum`：将计数值取反后输出，因为LED低电平点亮

### 关键知识点
1. **变量计数**：使用变量记录按键次数
2. **二进制显示**：将计数值以二进制形式显示在LED上
3. **取反操作**：因为LED低电平点亮，所以需要取反输出

### 遇到的问题和解决方法
**问题**：不理解为什么需要取反操作。

**解决**：在51单片机中，通常0表示低电平（点亮LED），1表示高电平（熄灭LED）。如果直接输出lednum，LED会显示二进制的补码。使用`~lednum`取反后，LED显示的就是正常的二进制表示。
```

- [ ] **Step 2: 提交**

```bash
git add posts/keil-chapter-3.md
git commit -m "docs: 添加第3章项目3（3-3独立按键控制LED显示二进制）"
```

---

### Task 6: 添加项目4（3-4独立按键控制LED移位）

**Files:**
- Modify: `posts/keil-chapter-3.md`

- [ ] **Step 1: 添加项目4内容**

```markdown
## 项目4：3-4 独立按键控制LED移位

### 项目目标
通过两个按键控制LED左右移位，学习移位操作和多按键处理。

### 代码解析
```c
#include <REGX52.H>  // 包含51单片机寄存器定义头文件

// 延时函数，用于按键消抖（11.0592MHz晶振）
void Delay(unsigned int xms)		//@11.0592MHz
{
	unsigned char i, j;
	while(xms){
		i = 2;
		j = 199;
		do
		{
			while (--j);
		} while (--i);
		xms--;
	}
}

unsigned char num = 0;  // 移位计数变量

void main() {
	P2 = ~0x01;  // 初始状态，点亮第一个LED
	while(1) {
		// 右移按键（P3.1）
		if(P3_1 == 0) {
			Delay(20);            // 消抖
			while(P3_1 == 0);     // 等待松开
			Delay(20);            // 松开消抖
			
			num++;                // 计数加1
			if(num >= 8) {        // 如果超过8，重置为0
				num = 0;
			}
			P2 = ~(0x01 << num);  // 将1左移num位，取反后输出
		}
		// 左移按键（P3.0）
		if(P3_0 == 0) {
			Delay(20);            // 消抖
			while(P3_0 == 0);     // 等待松开
			Delay(20);            // 松开消抖
			
			if(num <= 0) {        // 如果已经是0，重置为7
				num = 7;
			}else {
				num--;            // 计数减1
			}
			P2 = ~(0x01 << num);  // 将1左移num位，取反后输出
		}
	}
}
```

**代码解释：**
- `0x01 << num`：将1左移num位，实现移位操作
- `P2 = ~(0x01 << num)`：取反后输出，点亮对应的LED
- 两个按键分别控制右移和左移

### 关键知识点
1. **移位操作**：使用`<<`左移运算符实现LED移位
2. **多按键处理**：同时处理两个按键，实现双向控制
3. **边界处理**：移位到边界时进行重置

### 遇到的问题和解决方法
**问题**：移位操作不理解，不知道如何计算。

**解决**：`0x01 << num`表示将二进制00000001左移num位。例如，num=3时，结果为00001000（二进制），即0x08。取反后为11110111，点亮第4个LED（从0开始计数）。
```

- [ ] **Step 2: 提交**

```bash
git add posts/keil-chapter-3.md
git commit -m "docs: 添加第3章项目4（3-4独立按键控制LED移位）"
```

---

### Task 7: 添加总结部分

**Files:**
- Modify: `posts/keil-chapter-3.md`

- [ ] **Step 1: 添加总结内容**

```markdown
## 总结

通过第3章的学习，我掌握了按键控制的基础知识：

1. **按键检测**：学会了通过读取引脚电平判断按键状态
2. **按键消抖**：理解了机械抖动的原理，掌握了延时消抖的方法
3. **状态切换**：学会了使用取反操作实现状态翻转
4. **移位操作**：掌握了使用移位运算符控制LED位置
5. **多按键处理**：学会了同时处理多个按键输入

这些知识为后续学习矩阵键盘、定时器中断等内容打下了基础。

## 下一步学习

接下来将学习第4章：数码管显示，了解如何通过数码管显示数字和字符。
```

- [ ] **Step 2: 提交**

```bash
git add posts/keil-chapter-3.md
git commit -m "docs: 添加第3章总结和下一步学习"
```

---

### Task 8: 最终检查和提交

**Files:**
- Modify: `posts/keil-chapter-3.md`

- [ ] **Step 1: 检查文章完整性**

确认文章包含：
- Frontmatter（标题、日期、标签、心情、封面、描述）
- 引言部分
- 项目列表
- 4个项目的详细介绍（项目目标、代码解析、关键知识点、遇到的问题和解决方法）
- 总结部分
- 下一步学习

- [ ] **Step 2: 检查代码注释**

确认所有代码都有中文注释，即使是原代码中没有注释的部分也补充了简单注释。

- [ ] **Step 3: 最终提交**

```bash
git add posts/keil-chapter-3.md
git commit -m "feat: 完成第3章按键控制博客文章"
```
