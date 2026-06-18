# 第7章：定时器应用 博客文章实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建第7章定时器应用的博客文章，记录定时器中断和闹钟功能的学习过程

**Architecture:** 单篇博客文章，包含2个项目的详细介绍，遵循设计规范中的文章结构

**Tech Stack:** Markdown, 51单片机, C语言

---

## 文件结构

- Create: `posts/keil-chapter-7.md`

---

### Task 1: 创建文章文件并添加 Frontmatter

**Files:**
- Create: `posts/keil-chapter-7.md`

- [ ] **Step 1: 创建文章文件并添加 Frontmatter**

```markdown
---
title: "第7章：定时器应用 - 从中断到闹钟的学习记录"
date: "2026-06-18 15:00:00"
tags: ["单片机", "51单片机", "定时器", "中断", "嵌入式", "C语言"]
mood: "😊"
cover: ""
description: "记录51单片机定时器应用的学习过程，包括定时器中断和闹钟等实验"
---
```

- [ ] **Step 2: 提交**

```bash
git add posts/keil-chapter-7.md
git commit -m "feat: 创建第7章定时器应用博客文章并添加frontmatter"
```

---

### Task 2: 添加引言部分

**Files:**
- Modify: `posts/keil-chapter-7.md`

- [ ] **Step 1: 添加引言内容**

```markdown
## 引言

定时器是单片机的重要功能，可以实现精确的时间控制。本章将学习：
- 定时器的工作原理
- 定时器中断的使用方法
- 定时器的实际应用（闹钟）

本章将从定时器中断控制LED流水灯开始，学习如何实现一个简单的闹钟。

## 项目列表

1. **7-1 按键控制LED流水灯**：学习定时器中断的基本使用
2. **7-2 定时器闹钟**：掌握定时器的实际应用
```

- [ ] **Step 2: 提交**

```bash
git add posts/keil-chapter-7.md
git commit -m "docs: 添加第7章引言和项目列表"
```

---

### Task 3: 添加项目1（7-1按键控制led流水灯）

**Files:**
- Modify: `posts/keil-chapter-7.md`

- [ ] **Step 1: 添加项目1内容**

```markdown
## 项目1：7-1 按键控制LED流水灯

### 项目目标
使用定时器中断实现LED流水灯，通过按键控制流水方向。

### 代码解析

**main.c（主程序）：**
```c
/**
 * CPU: 89C52
 * Freq: 12MHz
*/

#include <reg52.h>      // 包含51单片机寄存器定义头文件
#include "timer0.h"     // 包含定时器0模块头文件
#include "key.h"        // 包含按键检测模块头文件

// 循环左移宏定义
#define _crol_(val, n) (((val) << (n)) | ((val) >> (8 - (n))))
// 循环右移宏定义
#define _cror_(val, n) (((val) >> (n)) | ((val) << (8 - (n))))

unsigned char keynum, ledmode;  // 按键编号和LED模式

void main()
{
    P2 = 0xfe;          // 初始状态，点亮第一个LED
    timer0_init();      // 初始化定时器0
    while (1)
    {
        keynum = key(); // 获取按键编号
        if (keynum != 0) { // 如果有按键按下
            if (keynum == 1) { // 如果是按键1
                ledmode++;     // 模式加1
                if (ledmode >= 2) { // 如果模式超过2
                    ledmode = 0;    // 重置为0
                }
            }
        }
    }
}

// 定时器0中断服务函数
void timer0_rountine() interrupt 1 {
    static unsigned int count;  // 静态变量，保持计数值
    TL0 = 0x66;         // 设置定时初值低字节
    TH0 = 0xFC;         // 设置定时初值高字节
    count++;            // 计数加1
    if (count >= 1000) { // 如果计数达到1000（约1秒）
        count = 0;       // 重置计数
        if (ledmode == 0) { // 如果是模式0
            P2 = _crol_(P2, 1); // LED左移
        }
        if (ledmode == 1) { // 如果是模式1
            P2 = _cror_(P2, 1); // LED右移
        }
    }
}
```

**代码解释：**
- `timer0_init()`：初始化定时器0，设置定时初值和中断
- `timer0_rountine() interrupt 1`：定时器0中断服务函数
- `_crol_`和`_cror_`：循环左移和右移宏定义
- 静态变量`count`用于计数，实现约1秒的定时

### 关键知识点
1. **定时器工作原理**：通过计数器实现定时功能
2. **中断服务函数**：定时器触发中断时执行的函数
3. **定时初值计算**：根据晶振频率计算定时初值
4. **循环移位操作**：使用宏定义实现循环移位

### 遇到的问题和解决方法
**问题**：定时时间不准确，LED闪烁速度不对。

**解决**：定时初值需要根据晶振频率精确计算。对于12MHz晶振，定时1ms的初值为0xFC66。如果使用11.0592MHz晶振，需要重新计算初值。可以通过示波器或计时器校准定时时间。
```

- [ ] **Step 2: 提交**

```bash
git add posts/keil-chapter-7.md
git commit -m "docs: 添加第7章项目1（7-1按键控制led流水灯）"
```

---

### Task 4: 添加项目2（7-2定时器闹钟）

**Files:**
- Modify: `posts/keil-chapter-7.md`

- [ ] **Step 1: 添加项目2内容**

```markdown
## 项目2：7-2 定时器闹钟

### 项目目标
使用定时器实现闹钟功能，显示时分秒。

### 代码解析

**main.c（主程序）：**
```c
/**
 * CPU: 89C52
 * Freq: 12MHz
*/

#include <reg52.h>      // 包含51单片机寄存器定义头文件
#include "LCD1602.h"    // 包含LCD1602驱动模块头文件
#include "delay.h"      // 包含延时函数模块头文件
#include "timer0.h"     // 包含定时器0模块头文件

unsigned char sec, min, hour;  // 秒、分、时变量

void main()
{
    LCD_Init();         // 初始化LCD1602
    timer0_init();      // 初始化定时器0
    LCD_ShowString(1, 1, "clock:"); // 第1行显示"clock:"
    while (1)
    {
        // 在LCD第2行显示时分秒
        LCD_ShowNum(2, 1, hour, 2);  // 显示小时
        LCD_ShowChar(2, 3, ':');     // 显示冒号
        LCD_ShowNum(2, 4, min, 2);   // 显示分钟
        LCD_ShowChar(2, 6, ':');     // 显示冒号
        LCD_ShowNum(2, 7, sec, 2);   // 显示秒
    }
}

// 定时器0中断服务函数
void timer0_rountine() interrupt 1 {
    static unsigned int count;  // 静态变量，保持计数值
    TL0 = 0x66;         // 设置定时初值低字节
    TH0 = 0xFC;         // 设置定时初值高字节
    count++;            // 计数加1
    if (count >= 1000) { // 如果计数达到1000（约1秒）
        count = 0;       // 重置计数
        sec++;           // 秒加1
        if (sec >= 60) { // 如果秒达到60
            sec = 0;     // 秒重置为0
            min++;       // 分加1
            if (min >= 60) { // 如果分达到60
                min = 0;     // 分重置为0
                hour++;      // 时加1
                if (hour >= 24) { // 如果时达到24
                    hour = 0;    // 时重置为0
                }
            }
        }
    }
}
```

**代码解释：**
- `sec, min, hour`：分别存储秒、分、时
- 定时器中断每1秒触发一次，更新时间
- 使用LCD1602显示时分秒
- 时间达到60或24时自动重置

### 关键知识点
1. **时间计数**：使用变量记录时分秒
2. **进位逻辑**：秒到60进位到分，分到60进位到时
3. **显示格式**：使用LCD1602格式化显示时间

### 遇到的问题和解决方法
**问题**：时间显示不更新或更新不准确。

**解决**：检查以下几点：
1. 确认定时器中断是否正确触发
2. 检查定时初值是否正确
3. 确认进位逻辑是否正确
4. 检查LCD显示函数是否正常工作
```

- [ ] **Step 2: 提交**

```bash
git add posts/keil-chapter-7.md
git commit -m "docs: 添加第7章项目2（7-2定时器闹钟）"
```

---

### Task 5: 添加总结部分

**Files:**
- Modify: `posts/keil-chapter-7.md`

- [ ] **Step 1: 添加总结内容**

```markdown
## 总结

通过第7章的学习，我掌握了定时器应用的基础知识：

1. **定时器原理**：理解了定时器的工作原理和定时初值计算
2. **中断服务函数**：学会了编写定时器中断服务函数
3. **时间计数**：掌握了时分秒的计数和进位逻辑
4. **实际应用**：学会了将定时器应用于实际项目（闹钟）

这些知识为后续学习串口通信、LED点阵等内容打下了基础。

## 下一步学习

接下来将学习第8章：串口通信，了解如何通过串口与电脑进行数据传输。
```

- [ ] **Step 2: 提交**

```bash
git add posts/keil-chapter-7.md
git commit -m "docs: 添加第7章总结和下一步学习"
```

---

### Task 6: 最终检查和提交

**Files:**
- Modify: `posts/keil-chapter-7.md`

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
git add posts/keil-chapter-7.md
git commit -m "feat: 完成第7章定时器应用博客文章"
```
