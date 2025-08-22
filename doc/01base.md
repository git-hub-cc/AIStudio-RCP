### 资料
#### Chrome 扩展 API
输出文档，对Chrome 扩展 API进行分类，要求种类齐全，每一种用50字简单介绍即可，因为内容过多，分多次输出，每次1000行内容。
#### Native Messaging API
输出文档，对Native Messaging API进行分类，要求种类齐全，每一种用50字简单介绍即可，因为内容过多，分多次输出，每次1000行内容。
#### Chrome DevTools Protocol
输出文档，对Chrome DevTools Protocol进行分类，要求种类齐全，每一种用50字简单介绍即可，因为内容过多，分多次输出，每次1000行内容。
#### Progressive Web Apps (PWA) 相关API
输出文档，对Progressive Web Apps (PWA) 相关API进行分类，要求种类齐全，每一种用50字简单介绍即可，因为内容过多，分多次输出，每次1000行内容。
#### WebAssembly (Wasm)
输出文档，对WebAssembly (Wasm)进行分类，要求种类齐全，每一种用50字简单介绍即可，因为内容过多，分多次输出，每次1000行内容。
#### 可以增强的功能
chrome api可以实现哪些js实现不了的功能，比如获取其它页面的网络请求。要求维度广，要求种类齐全，每一种用50字简单介绍即可，因为内容过多，分多次输出，每次1000行内容。


### 待实现

#### **层次三：突破浏览器沙箱 (Native Messaging API)**

当 MCP 的能力需要延伸到操作系统层面时，就需要 Native Messaging。

*   **集成方式**：
    1.  在扩展中声明 `nativeMessaging` 权限。
    2.  编写一个本地主机应用程序（可以用 Python, Node.js, C# 等）。
    3.  编写一个清单文件（manifest.json）来注册这个本地应用。
    4.  扩展通过 `chrome.runtime.connectNative` 与本地应用通信。
*   **应用场景 (彻底释放想象力)**：
    *   **文件系统访问**：实现 `save_data_to_file` 命令，将抓取的数据直接保存到本地硬盘的指定位置，而不是停留在浏览器下载。
    *   **执行本地脚本**：实现 `run_local_script` 命令。例如，用 Agent 抓取数据，通过 Native Messaging 发送给一个本地 Python 脚本进行复杂的数据处理或机器学习分析，再将结果返回。
    *   **系统集成**：控制其他桌面应用、读取系统信息、与硬件设备（如串口设备）交互。

#### **层次四：高性能计算 (WebAssembly - Wasm)**

Wasm 的角色不是直接控制浏览器，而是在浏览器内部提供一个高性能的计算引擎。

*   **集成方式**：将 C++/Rust 等编写的高性能代码编译成 `.wasm` 文件，随扩展打包。在 `background.js` 或注入的脚本中加载并运行 Wasm 模块。
*   **应用场景**：
    *   **大规模数据处理**：假设你抓取了一个非常大的 JSON 或二进制文件，用 JavaScript 解析可能很慢。你可以实现一个 `parse_data_with_wasm` 命令，将数据传入 Wasm 模块进行高速解析和转换。
    *   **客户端加密/解密**：实现需要复杂加密算法的功能，Wasm 性能远超 JS。
    *   **AI/ML 推理**：在浏览器端运行一个轻量级的机器学习模型，例如对页面上的图片进行识别和分类。
