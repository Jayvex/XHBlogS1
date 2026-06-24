---
title: "Claude-code的安装与接入DeepSeek大模型"
date: "2026-06-16 12:00:00"
tags: ["Claude-code", "DeepSeek"]
mood: "😊"
cover: ""
---

## Claude-code的安装

## 前提条件

1、需要安装 [Node.js 18 或更新版本环境](https://nodejs.org/en/download/)。

2、Windows 用户还需安装 [Git for Windows](https://git-scm.com/install/windows)。

## 安装命令

```
//命令行输入下面的命令
npm i -g @anthropic-ai/claude-code@latest    //全局安装Claude-code
//运行如下命令，查看安装结果，若显示版本号则表示安装成功
claude --version
```

## DeepSeek API Key的获取

打开[DeepSeek开放平台](https://platform.deepseek.com/)。
登录之后，点击充值。

## DeepSeek充值

![DeepSeek充值](https://github.com/Jayvex/picx-images-hosting/raw/master/blog/image.51etaxlwsm.png)

点击API keys，点击创建API key，在弹出的窗口上点击复制API key(一定要保存好，key只有在第一次新建的时候才能复制)。

## 创建API key

![创建API key](https://github.com/Jayvex/picx-images-hosting/raw/master/blog/image.mqjdj1g6.webp)

## 环境变量配置

手动修改配置文件在 ~/.claude目录下新建settings.json 。

在里面配置环境变量参数，配置完保存关闭即可。

## 配置环境变量

```
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.deepseek.com/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "<你的 DeepSeek API Key>",   //在这里填写你的DeepSeek API Key（尖括号要一起删掉）
    "ANTHROPIC_MODEL": "deepseek-v4-pro[1m]",
    "ANTHROPIC_REASONING_MODEL": "deepseek-v4-pro[1m]",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "deepseek-v4-pro[1m]",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-v4-pro[1m]",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek-v4-flash",
    "CLAUDE_CODE_SUBAGENT_MODEL": "deepseek-v4-flash",
    "CLAUDE_CODE_EFFORT_LEVEL": "max",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
    "API_TIMEOUT_MS": "3000000"
  }
}
```

### 启动claude-code并查看状态

## 启动Claude

```
//命令行输入下面的命令
claude        //启动claude-code
//在Claude对话框输入 /status
//列表中Model后显示Default(DeepSeek-V4-XXX)即为成功
```


## 分割线

---

## 总结

完成以上步骤你就可以愉快的使用Claude了。

---

**感谢阅读！** 🎉
