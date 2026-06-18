# 第9章：LED点阵屏 博客文章实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建第9章LED点阵屏的博客文章，记录LED点阵屏显示图形和动画的学习过程

**Architecture:** 单篇博客文章，包含2个项目的详细介绍，遵循设计规范中的文章结构

**Tech Stack:** Markdown, 51单片机, C语言

---

## 文件结构

- Create: `posts/keil-chapter-9.md`

---

### Task 1: 创建文章文件并添加 Frontmatter

**Files:**
- Create: `posts/keil-chapter-9.md`

- [ ] **Step 1: 创建文章文件并添加 Frontmatter**

```markdown
---
title: "第9章：LED点阵屏 - 从图形到动画的学习记录"
date: "2026-06-18 17:00:00"
tags: ["单片机", "51单片机", "LED点阵", "显示动画", "嵌入式", "C语言"]
mood: "😊"
cover: ""
description: "记录51单片机LED点阵屏的学习过程，包括显示图形和显示动画等实验"
---
```

- [ ] **Step 2: 提交**

```bash
git add posts/keil-chapter-9.md
git commit -m "feat: 创建第9章LED点阵屏博客文章并添加frontmatter"
```

---

### Task 2: 添加引言部分

**Files:**
- Modify: `posts/keil-chapter-9.md`

- [ ] **Step 1: 添加引言内容**

```markdown
## 引言

LED点阵屏是单片机常用的显示设备，可以显示图形和动画。本章将学习：
- LED点阵屏的工作原理
- 74HC595移位寄存器的使用
- LED点阵屏的动态扫描显示

本章将从显示静态图形开始，学习如何实现简单的动画效果。

## 项目列表

1. **9-1 LED点阵屏显示图形**：学习LED点阵屏的基本显示方法
2. **9-2 LED点阵屏显示动画**：掌握LED点阵屏的动画显示技术
```

- [ ] **Step 2: 提交**

```bash
git add posts/keil-chapter-9.md
git commit -m "docs: 添加第9章引言和项目列表"
```

---

### Task 3: 添加项目1（9-1led点阵屏显示图形）

**Files:**
- Modify: `posts/keil-chapter-9.md`

- [ ] **Step 1: 添加项目1内容**

```markdown
## 项目1：9-1 LED点阵屏显示图形

### 项目目标
在LED点阵屏上显示静态图形，学习74HC595的使用。

### 代码解析

**main.c（主程序）：**
```c
/**
 * CPU: 89C52
 * Freq: 12MHz
*/

#include <reg52.h>      // 包含51单片机寄存器定义头文件
#include "delay.h"      // 包含延时函数模块头文件

// 74HC595引脚定义
#define RCK P35         // RCLK，锁存时钟
#define SCK P36         // SRCLK，移位时钟
#define SER P34         // SER，串行数据

#define matrixled P0    // LED点阵屏端口

/**
 * 向74HC595移位寄存器写入一个字节
 * @param byte 要写入的字节数据
 */
void _74HC595_writeByte(unsigned char byte) {
    unsigned char i;
    for (i = 0; i < 8; i++) {
        SER = byte & (0x80 >> i);  // 逐位发送数据
        SCK = 1;                   // 移位时钟上升沿
        SCK = 0;                   // 移位时钟下降沿
    }
    RCK = 1;                       // 锁存时钟上升沿
    RCK = 0;                       // 锁存时钟下降沿
}

/**
 * 在LED点阵屏上显示一列数据
 * @param column 列号（0-7）
 * @param num 该列的显示数据
 */
void matrixled_showColumn(unsigned char column, unsigned char num) {
    _74HC595_writeByte(num);       // 发送行数据
    matrixled = ~(0x80 >> column); // 选择列
    delay(1);                      // 短暂延时
    matrixled = 0xff;              // 关闭显示
}

void main()
{
    SCK = 0;  // 初始化移位时钟
    RCK = 0;  // 初始化锁存时钟
    while (1)
    {
        // 显示预设图形（笑脸）
        matrixled_showColumn(0, 0x3c);
        matrixled_showColumn(1, 0x42);
        matrixled_showColumn(2, 0xa9);
        matrixled_showColumn(3, 0x85);
        matrixled_showColumn(4, 0x85);
        matrixled_showColumn(5, 0xa9);
        matrixled_showColumn(6, 0x42);
        matrixled_showColumn(7, 0x3c);
    }
}
```

**代码解释：**
- `_74HC595_writeByte()`：向74HC595写入一个字节，通过串行数据线逐位发送
- `matrixled_showColumn()`：显示一列数据，先发送行数据，再选择列
- 74HC595是串行输入并行输出的移位寄存器，用于扩展IO口
- 通过动态扫描方式显示8x8点阵图形

### 关键知识点
1. **74HC595工作原理**：串行输入并行输出，用于扩展IO口
2. **动态扫描显示**：逐列扫描显示，利用人眼视觉暂留效应
3. **点阵编码**：将图形转换为二进制数据

### 遇到的问题和解决方法
**问题**：LED点阵屏显示不清晰或有残影。

**解决**：检查以下几点：
1. 确认74HC595连接正确
2. 调整延时时间，确保扫描速度足够快
3. 在切换列前先关闭显示（matrixled=0xff）
4. 检查点阵编码是否正确
```

- [ ] **Step 2: 提交**

```bash
git add posts/keil-chapter-9.md
git commit -m "docs: 添加第9章项目1（9-1led点阵屏显示图形）"
```

---

### Task 4: 添加项目2（9-2led点阵屏显示动画）

**Files:**
- Modify: `posts/keil-chapter-9.md`

- [ ] **Step 1: 添加项目2内容**

```markdown
## 项目2：9-2 LED点阵屏显示动画

### 项目目标
在LED点阵屏上显示动画效果，学习动画显示技术。

### 代码解析

**main.c（主程序）：**
```c
/**
 * CPU: 89C52
 * Freq: 12MHz
*/

#include <reg52.h>          // 包含51单片机寄存器定义头文件
#include "matrixled.h"      // 包含LED点阵屏驱动模块头文件

// 动画数据，3帧动画，每帧8字节
unsigned char code animation[] = {
    0x3C,0x42,0xA9,0x85,0x85,0xA9,0x42,0x3C,  // 第1帧（笑脸）
    0x3C,0x42,0xA1,0x85,0x85,0xA1,0x42,0x3C,  // 第2帧（微笑）
    0x3C,0x42,0xA5,0x89,0x89,0xA5,0x42,0x3C,  // 第3帧（张嘴）
};

void main()
{
    unsigned char i, offset = 0, count = 0;  // 循环变量和偏移量
    matrixled_init();      // 初始化LED点阵屏
    while (1)
    {
        // 显示当前帧的8列数据
        for (i = 0; i < 8; i++) {
            matrixled_showColumn(i, animation[i + offset]);
        }
        count++;           // 计数加1
        if (count >= 15) { // 如果计数达到15
            count = 0;     // 重置计数
            offset += 8;   // 偏移量加8，切换到下一帧
            if (offset > 16) { // 如果偏移量超过16
                offset = 0;    // 重置为0
            }
        }
    }
}
```

**代码解释：**
- `animation[]`：存储3帧动画数据，每帧8字节
- `offset`：当前帧的偏移量，用于选择显示哪一帧
- `count`：计数器，控制动画播放速度
- 通过改变`offset`实现动画效果

### 关键知识点
1. **动画原理**：通过快速切换静态图像实现动画效果
2. **帧数据存储**：使用数组存储多帧动画数据
3. **动画速度控制**：通过计数器控制帧切换速度

### 遇到的问题和解决方法
**问题**：动画播放速度不合适。

**解决**：调整`count`的阈值，阈值越大动画越慢，阈值越小动画越快。可以根据需要调整这个值。
```

- [ ] **Step 2: 提交**

```bash
git add posts/keil-chapter-9.md
git commit -m "docs: 添加第9章项目2（9-2led点阵屏显示动画）"
```

---

### Task 5: 添加总结部分

**Files:**
- Modify: `posts/keil-chapter-9.md`

- [ ] **Step 1: 添加总结内容**

```markdown
## 总结

通过第9章的学习，我掌握了LED点阵屏显示的基础知识：

1. **74HC595使用**：学会了使用74HC595扩展IO口
2. **动态扫描显示**：掌握了LED点阵屏的动态扫描显示方法
3. **点阵编码**：学会了将图形转换为二进制数据
4. **动画显示**：掌握了通过切换帧数据实现动画效果

这些知识为后续学习DS1302时钟等内容打下了基础。

## 下一步学习

接下来将学习第10章：DS1302时钟，了解如何使用DS1302实时时钟芯片。
```

- [ ] **Step 2: 提交**

```bash
git add posts/keil-chapter-9.md
git commit -m "docs: 添加第9章总结和下一步学习"
```

---

### Task 6: 最终检查和提交

**Files:**
- Modify: `posts/keil-chapter-9.md`

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
git add posts/keil-chapter-9.md
git commit -m "feat: 完成第9章LED点阵屏博客文章"
```
