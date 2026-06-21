---
title: "第10章：DS1302时钟 - 实时时钟芯片的学习记录"
date: "2026-06-18 18:00:00"
tags: ["单片机", "51单片机", "DS1302", "实时时钟", "嵌入式", "C语言"]
mood: "😊"
cover: ""
description: "记录51单片机DS1302实时时钟芯片的学习过程，包括DS1302的初始化、读写操作和可调时钟实现"
---

## 引言

DS1302是一款实时时钟芯片，可以提供精确的时钟功能。本章将学习：
- DS1302的工作原理和通信协议
- DS1302的初始化和读写操作
- DS1302的时间设置和读取函数封装
- 按键控制的时间设置功能

## 项目列表

1. **10-1 DS1302时钟**：学习DS1302的初始化和读写操作，实现完整时间显示
2. **10-2 DS1302可调时钟**：实现按键切换模式、调整时间、字段闪烁显示

## 项目1：10-1 DS1302时钟

### 项目目标
使用DS1302实时时钟芯片，实现年月日时分秒的完整时钟显示功能。

### 代码解析

**DS1302.h（头文件）：**
```c
#ifndef __DS1302_H__
#define __DS1302_H__

extern unsigned char DS1302_Time[];   // 时间数据数组

void DS1302_Init(void);
void DS1302_WriteByte(unsigned char Command, unsigned char Data);
unsigned char DS1302_ReadByte(unsigned char Command);
void DS1302_SetTime(void);
void DS1302_ReadTime(void);

#endif
```

**DS1302.c（驱动实现）：**
```c
#include <reg52.h>

// DS1302 引脚定义
#define DS1302_SCLK P36   // 串行时钟线
#define DS1302_CE P35     // 片选线（复位线）
#define DS1302_IO P34     // 数据输入/输出线

// DS1302 寄存器地址定义
#define DS1302_Second 0x80  // 秒寄存器
#define DS1302_Minute 0x82  // 分寄存器
#define DS1302_Hour 0x84    // 时寄存器
#define DS1302_Date 0x86    // 日寄存器
#define DS1302_Month 0x88   // 月寄存器
#define DS1302_Day 0x8a     // 星期寄存器
#define DS1302_Year 0x8c    // 年寄存器
#define DS1302_WP 0x8e      // 写保护寄存器

// 时间缓存数组：年、月、日、时、分、秒、星期
unsigned char DS1302_Time[] = {26, 6, 19, 17, 5, 55, 5};

/**
 * @brief 初始化 DS1302
 *        将 CE 和 SCLK 置低，使 DS1302 进入空闲状态
 */
void DS1302_Init(void) {
    DS1302_CE = 0;
    DS1302_SCLK = 0;
}

/**
 * @brief 向 DS1302 写入一字节数据
 * @param Command 命令字节（含寄存器地址和写标志）
 * @param Data    要写入的数据
 */
void DS1302_WriteByte(unsigned char Command, unsigned char Data) {
    DS1302_CE = 1;  // 拉高 CE 启动通信
    unsigned char i;
    // 发送命令字节（低位在前）
    for (i = 0; i < 8; i++) {
        DS1302_IO = Command & (0x01 << i);
        DS1302_SCLK = 1;  // 产生时钟上升沿，写入数据
        DS1302_SCLK = 0;
    }
    // 发送数据字节（低位在前）
    for (i = 0; i < 8; i++) {
        DS1302_IO = Data & (0x01 << i);
        DS1302_SCLK = 1;
        DS1302_SCLK = 0;
    }
    DS1302_CE = 0;  // 拉低 CE 结束通信
}

/**
 * @brief 从 DS1302 读取一字节数据
 * @param Command 命令字节（含寄存器地址，函数内部会自动置位读标志）
 * @return 读取到的数据
 */
unsigned char DS1302_ReadByte(unsigned char Command) {
    unsigned char i, Data = 0x00;
    Command |= 0x01;    // 将命令字节最低位置 1，表示读操作
    DS1302_CE = 1;      // 拉高 CE 启动通信
    // 发送命令字节（低位在前）
    for (i = 0; i < 8; i++) {
        DS1302_IO = Command & (0x01 << i);
        DS1302_SCLK = 0;
        DS1302_SCLK = 1;
    }
    // 读取数据字节（低位在前）
    for (i = 0; i < 8; i++) {
        DS1302_SCLK = 1;
        DS1302_SCLK = 0;  // 产生时钟下降沿，DS1302 输出数据
        if (DS1302_IO != 0) {
            Data |= (0x01 << i);  // 若 IO 为高，则对应位置 1
        }
    }
    DS1302_CE = 0;   // 拉低 CE 结束通信
    DS1302_IO = 0;   // 释放 IO 线
    return Data;
}

/**
 * @brief 设置 DS1302 的时间
 *        将 DS1302_Time 数组中的时间写入 DS1302 芯片
 */
void DS1302_SetTime(void) {
    DS1302_WriteByte(DS1302_WP, 0x00);  // 关闭写保护
    // 写入各时间寄存器（十进制转 BCD 码）
    DS1302_WriteByte(DS1302_Year, DS1302_Time[0] / 10 * 16 + DS1302_Time[0] % 10);
    DS1302_WriteByte(DS1302_Month, DS1302_Time[1] / 10 * 16 + DS1302_Time[1] % 10);
    DS1302_WriteByte(DS1302_Date, DS1302_Time[2] / 10 * 16 + DS1302_Time[2] % 10);
    DS1302_WriteByte(DS1302_Hour, DS1302_Time[3] / 10 * 16 + DS1302_Time[3] % 10);
    DS1302_WriteByte(DS1302_Minute, DS1302_Time[4] / 10 * 16 + DS1302_Time[4] % 10);
    DS1302_WriteByte(DS1302_Second, DS1302_Time[5] / 10 * 16 + DS1302_Time[5] % 10);
    DS1302_WriteByte(DS1302_Day, DS1302_Time[6] / 10 * 16 + DS1302_Time[6] % 10);
    DS1302_WriteByte(DS1302_WP, 0x80);  // 开启写保护
}

/**
 * @brief 读取 DS1302 的时间
 *        从 DS1302 芯片读取时间数据并存入 DS1302_Time 数组
 */
void DS1302_ReadTime(void) {
    unsigned char Temp;
    // 读取各时间寄存器（BCD 码转十进制）
    Temp = DS1302_ReadByte(DS1302_Year);
    DS1302_Time[0] = Temp / 16 * 10 + Temp % 16;
    Temp = DS1302_ReadByte(DS1302_Month);
    DS1302_Time[1] = Temp / 16 * 10 + Temp % 16;
    Temp = DS1302_ReadByte(DS1302_Date);
    DS1302_Time[2] = Temp / 16 * 10 + Temp % 16;
    Temp = DS1302_ReadByte(DS1302_Hour);
    DS1302_Time[3] = Temp / 16 * 10 + Temp % 16;
    Temp = DS1302_ReadByte(DS1302_Minute);
    DS1302_Time[4] = Temp / 16 * 10 + Temp % 16;
    Temp = DS1302_ReadByte(DS1302_Second);
    DS1302_Time[5] = Temp / 16 * 10 + Temp % 16;
    Temp = DS1302_ReadByte(DS1302_Day);
    DS1302_Time[6] = Temp / 16 * 10 + Temp % 16;
}
```

**main.c（主程序）：**
```c
/**
 * CPU: 89C52
 * Freq: 12MHz
*/

#include <reg52.h>
#include "LCD1602.h"
#include "DS1302.h"

void main()
{
    LCD_Init();
    DS1302_Init();
    LCD_ShowString(1, 1, "  -  -  ");   // 第一行显示年-月-日格式
    LCD_ShowString(2, 1, "  :  :  ");   // 第二行显示时:分:秒格式

    DS1302_SetTime();                    // 初始写入时间
   while (1)
    {
        DS1302_ReadTime();               // 读取当前时间
        LCD_ShowNum(1, 1, DS1302_Time[0], 2);   // 显示年
        LCD_ShowNum(1, 4, DS1302_Time[1], 2);   // 显示月
        LCD_ShowNum(1, 7, DS1302_Time[2], 2);   // 显示日
        LCD_ShowNum(2, 1, DS1302_Time[3], 2);   // 显示时
        LCD_ShowNum(2, 4, DS1302_Time[4], 2);   // 显示分
        LCD_ShowNum(2, 7, DS1302_Time[5], 2);   // 显示秒
    }
}
```

**代码解释：**
- `DS1302_Time[]`：存储时间数据的数组，格式为{年, 月, 日, 时, 分, 秒, 星期}
- `DS1302_SetTime()`：将数组中的时间写入DS1302芯片
- `DS1302_ReadTime()`：从DS1302读取时间并存入数组
- BCD码转换：写入时 `十进制/10*16+十进制%10`，读取时 `BCD/16*10+BCD%16`

### 关键知识点
1. **DS1302工作原理**：了解DS1302的引脚和通信协议
2. **BCD码**：DS1302使用BCD码存储时间数据
3. **函数封装**：将DS1302操作封装为独立的驱动模块
4. **时间数组**：使用统一的数组存储时间数据，方便读写操作

### 遇到的问题和解决方法
**问题**：DS1302读取的时间数据不正确。

**解决**：检查以下几点：
1. 确认DS1302连接正确
2. 检查BCD码转换是否正确
3. 确认写保护已关闭
4. 检查时钟是否已启动

---

## 项目2：10-2 DS1302可调时钟

### 项目目标
在DS1302时钟的基础上，增加按键设置功能，支持切换显示/设置模式、调整时间、字段闪烁显示。

### 功能说明
- **按键1**：切换显示模式和设置模式
- **按键2**：在设置模式下切换选中字段（年→月→日→时→分→秒→循环）
- **按键3**：选中字段值 +1（含日期合法性校验）
- **按键4**：选中字段值 -1（含日期合法性校验）
- **闪烁显示**：设置模式下，选中字段会周期性闪烁

### 代码解析

**key.h / key.c（按键模块）：**
```c
// 独立按键扫描函数
#include <reg52.h>
#include "delay.h"

unsigned char key() {
    unsigned char keynumber = 0;
    if (P31 == 0) {           // 按键1
        delay(20);
        while(P31 == 0);
        delay(20);
        keynumber = 1;
    }
    if (P30 == 0) {           // 按键2
        delay(20);
        while(P30 == 0);
        delay(20);
        keynumber = 2;
    }
    if (P32 == 0) {           // 按键3
        delay(20);
        while(P32 == 0);
        delay(20);
        keynumber = 3;
    }
    if (P33 == 0) {           // 按键4
        delay(20);
        while(P33 == 0);
        delay(20);
        keynumber = 4;
    }
    return keynumber;
}
```

**timer0.h / timer0.c（定时器模块）：**
```c
#include <reg52.h>

// 定时器0初始化函数，1毫秒@12MHz
void timer0_init()
{
    TMOD &= 0xF0;      // 设置定时器模式
    TMOD |= 0x01;      // 设置定时器模式
    TL0 = 0x66;        // 设置定时初值（低字节）
    TH0 = 0xFC;        // 设置定时初值（高字节）
    TF0 = 0;           // 清除TF0标志
    TR0 = 1;           // 定时器0开始计时
    ET0 = 1;           // 使能定时器0中断
    EA = 1;            // 使能总中断
    PT0 = 0;           // 定时器0中断优先级为低
}
```

**main.c（主程序）：**
```c
/**
 * CPU: 89C52
 * Freq: 12MHz
 *
 * DS1302 可调时钟主程序
 * 功能：LCD1602 显示年月日/时分秒，按键切换显示/设置模式
 */

#include <reg52.h>
#include "LCD1602.h"
#include "DS1302.h"
#include "key.h"
#include "timer0.h"

// 全局变量
char KeyNum;          // 按键值
char Mode;            // 模式：0-显示模式，1-设置模式
char TimeSetSelect;   // 时间设置选择位（0~5，分别对应年/月/日/时/分/秒）
char TimeSetFlash;    // 设置模式下闪烁标志，由定时器中断周期性翻转

/**
 * @brief 时间显示函数
 *        从 DS1302 读取时间并在 LCD 上显示
 *        第一行：年-月-日，第二行：时:分:秒
 */
void TimeShow(void) {
    DS1302_ReadTime();
    LCD_ShowNum(1, 1, DS1302_Time[0], 2);
    LCD_ShowNum(1, 4, DS1302_Time[1], 2);
    LCD_ShowNum(1, 7, DS1302_Time[2], 2);
    LCD_ShowNum(2, 1, DS1302_Time[3], 2);
    LCD_ShowNum(2, 4, DS1302_Time[4], 2);
    LCD_ShowNum(2, 7, DS1302_Time[5], 2);
}

/**
 * @brief 时间设置函数（设置模式下调用）
 *        按键2：切换选中字段（年→月→日→时→分→秒→循环）
 *        按键3：选中字段值 +1（含日期合法性校验）
 *        按键4：选中字段值 -1（含日期合法性校验）
 *        选中字段在定时器控制下闪烁显示
 */
void TimeSet(void) {
    /* ---- 按键2：切换选中字段 ---- */
    if (KeyNum == 2) {
        TimeSetSelect++;
        if (TimeSetSelect > 5) {
            TimeSetSelect = 0;
        }
    }

    /* ---- 按键3：数值 +1 ---- */
    if (KeyNum == 3) {
        DS1302_Time[TimeSetSelect]++;

        // 各字段上限校验
        if (DS1302_Time[0] > 99) {          // 年上限 99
            DS1302_Time[0] = 0;
        }
        if (DS1302_Time[1] > 12) {           // 月上限 12
            DS1302_Time[1] = 1;
        }
        // 根据月份校验日期
        switch(DS1302_Time[1]) {
            case 1:                         // 31 天的月份：1、3、5、7、8、10、12
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                if (DS1302_Time[2] > 31) {
                    DS1302_Time[2] = 1;
                }
                if (DS1302_Time[2] < 1) {
                    DS1302_Time[2] = 32;
                }break;
            case 2:                         // 2月：闰年 29 天，平年 28 天
                if(DS1302_Time[0] % 400 == 0) {
                    if (DS1302_Time[2] > 29) {
                        DS1302_Time[2] = 1;
                    }
                    if (DS1302_Time[2] < 1) {
                        DS1302_Time[2] = 29;
                    }
                } else {
                    if (DS1302_Time[2] > 28) {
                        DS1302_Time[2] = 1;
                    }
                    if (DS1302_Time[2] < 1) {
                        DS1302_Time[2] = 28;
                    }
                }break;
            case 4:                         // 30 天的月份：4、6、9、11
            case 6:
            case 9:
            case 11:
                if (DS1302_Time[2] > 30) {
                    DS1302_Time[2] = 1;
                }
                if (DS1302_Time[2] < 1) {
                    DS1302_Time[2] = 30;
                }break;
        }
        if (DS1302_Time[3] > 23) {           // 时上限 23
            DS1302_Time[3] = 0;
        }
        if (DS1302_Time[4] > 59) {           // 分上限 59
            DS1302_Time[4] = 0;
        }
        if (DS1302_Time[5] > 59) {           // 秒上限 59
            DS1302_Time[5] = 0;
        }
    }

    /* ---- 按键4：数值 -1 ---- */
    if (KeyNum == 4) {
        // 减到 0 时回绕到上限
        if (DS1302_Time[0] == 0 && TimeSetSelect == 0) {
            DS1302_Time[0] = 100;
        }
        if (DS1302_Time[3] == 0 && TimeSetSelect == 3) {
            DS1302_Time[3] = 24;
        }
        if (DS1302_Time[4] == 0 && TimeSetSelect == 4) {
            DS1302_Time[4] = 60;
        }
        if (DS1302_Time[5] == 0 && TimeSetSelect == 5) {
            DS1302_Time[5] = 60;
        }
        DS1302_Time[TimeSetSelect]--;
        // 月份下限校验
        if (DS1302_Time[1] < 1) {
            DS1302_Time[1] = 12;
        }
        // 根据月份校验日期
        switch(DS1302_Time[1]) {
            case 1:                         // 31 天的月份
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                if (DS1302_Time[2] < 1) {
                    DS1302_Time[2] = 31;
                }
                if (DS1302_Time[2] > 31) {
                    DS1302_Time[2] = 1;
                }break;
            case 2:                         // 2月
                if(DS1302_Time[0] % 400 == 0) {
                    if (DS1302_Time[2] < 1) {
                        DS1302_Time[2] = 29;
                    }
                    if (DS1302_Time[2] > 29) {
                        DS1302_Time[2] = 1;
                    }
                } else {
                    if (DS1302_Time[2] < 1) {
                        DS1302_Time[2] = 28;
                    }
                    if (DS1302_Time[2] > 28) {
                        DS1302_Time[2] = 1;
                    }
                }break;
            case 4:                         // 30 天的月份
            case 6:
            case 9:
            case 11:
                if (DS1302_Time[2] < 1) {
                    DS1302_Time[2] = 30;
                }
                if (DS1302_Time[2] > 30) {
                    DS1302_Time[2] = 1;
                }break;
        }
    }

    /* ---- 闪烁显示：选中字段在闪烁标志下显示空格 ---- */
    if (TimeSetSelect == 0 && TimeSetFlash == 1) {
        LCD_ShowString(1, 1, "  ");
    }else {
        LCD_ShowNum(1, 1, DS1302_Time[0], 2);
    }
    if (TimeSetSelect == 1 && TimeSetFlash == 1) {
        LCD_ShowString(1, 4, "  ");
    }else {
        LCD_ShowNum(1, 4, DS1302_Time[1], 2);
    }
    if (TimeSetSelect == 2 && TimeSetFlash == 1) {
        LCD_ShowString(1, 7, "  ");
    }else {
        LCD_ShowNum(1, 7, DS1302_Time[2], 2);
    }
    if (TimeSetSelect == 3 && TimeSetFlash == 1) {
        LCD_ShowString(2, 1, "  ");
    }else {
        LCD_ShowNum(2, 1, DS1302_Time[3], 2);
    }
    if (TimeSetSelect == 4 && TimeSetFlash == 1) {
        LCD_ShowString(2, 4, "  ");
    }else {
        LCD_ShowNum(2, 4, DS1302_Time[4], 2);
    }
    if (TimeSetSelect == 5 && TimeSetFlash == 1) {
        LCD_ShowString(2, 7, "  ");
    }else {
        LCD_ShowNum(2, 7, DS1302_Time[5], 2);
    }
}

/**
 * @brief 主函数
 *        初始化 LCD、DS1302、定时器，显示时间分隔符
 *        循环检测按键：
 *          - 按键1：切换显示/设置模式
 *          - 显示模式：不断刷新时间
 *          - 设置模式：进入时间设置（退出时保存时间到 DS1302）
 */
void main()
{
    LCD_Init();
    DS1302_Init();
    timer0_init();
    // 显示固定分隔符
    LCD_ShowString(1, 1, "  -  -  ");   // 年-月-日
    LCD_ShowString(2, 1, "  :  :  ");   // 时:分:秒

    DS1302_SetTime();                    // 初始写入时间
   while (1)
    {
        KeyNum = key();
        if (KeyNum == 1) {               // 按键1：模式切换
            if (Mode == 0) {
                Mode = 1;                // 显示→设置
            }else {
                Mode = 0;                // 设置→显示，保存时间
                DS1302_SetTime();
            }
        }
        switch (Mode) {
            case 0:
                TimeShow();              // 显示模式
                break;
            case 1:
                TimeSet();               // 设置模式
                break;
        }
    }
}

/**
 * @brief 定时器0中断服务函数
 *        每 500 次中断（约 500ms）翻转 TimeSetFlash 标志
 *        TimeSet 函数利用此标志实现设置模式下选中字段的闪烁效果
 *        定时初值：0xFC66（定时 1ms @12MHz）
 */
void timer0_rountine() interrupt 1 {
    static unsigned int count;
    TL0 = 0x66;      // 设置定时初值（低字节）
    TH0 = 0xFC;      // 设置定时初值（高字节）
    count++;
    if (count >= 500) {
        count = 0;
        TimeSetFlash = !TimeSetFlash;    // 翻转闪烁标志
    }
}
```

### 关键知识点
1. **模式切换**：通过按键在显示模式和设置模式之间切换
2. **字段选择**：按键循环选中不同的时间字段
3. **日期校验**：根据月份判断日期上限，支持闰年判断
4. **闪烁效果**：利用定时器中断实现选中字段的周期性闪烁
5. **模块化设计**：按键和定时器分别封装为独立模块

### 遇到的问题和解决方法
**问题1**：按键切换不灵敏。

**解决**：增加按键消抖延时，等待按键释放后再返回按键值。

**问题2**：日期校验不完善。

**解决**：使用switch-case语句根据月份判断日期上限，并单独处理2月的闰年情况。

---

## 总结

通过第10章的学习，我掌握了DS1302实时时钟芯片的基础知识和进阶应用：

1. **DS1302原理**：了解了DS1302的工作原理和引脚功能
2. **函数封装**：学会了将DS1302操作封装为独立的驱动模块
3. **BCD码转换**：掌握了BCD码与十进制的转换方法
4. **可调时钟**：实现了按键切换模式、调整时间、字段闪烁显示
5. **日期校验**：学会了根据月份和闰年判断日期合法性

通过本章的学习，我完成了51单片机基础实验的全部内容。从LED控制到DS1302可调时钟，我逐步掌握了单片机开发的基础知识和技能。

## 学习总结

通过这10章的学习，我掌握了：
1. **GPIO控制**：LED和按键的基本控制方法
2. **显示技术**：数码管、LCD1602、LED点阵屏的使用
3. **输入设备**：独立按键、矩阵键盘的使用
4. **定时器**：定时器中断的使用方法
5. **通信技术**：串口通信的基本方法
6. **时钟芯片**：DS1302实时时钟芯片的使用

这些知识为后续深入学习单片机开发打下了坚实的基础。
