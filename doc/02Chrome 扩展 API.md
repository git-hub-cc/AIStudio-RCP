## **一、 核心功能 (Core Functionality)**

这类 API 是构建扩展的基础，提供了生命周期管理、权限控制、国际化等核心能力。

*   `chrome.runtime`
    管理扩展的生命周期，处理后台事件，实现不同部分间的消息通信，并获取清单文件（manifest）信息。是每个扩展的核心。

*   `chrome.management`
    提供了管理已安装扩展、应用和主题的功能，例如启用、禁用、卸载或获取它们的基本信息。常用于扩展管理类工具。

*   `chrome.i18n`
    用于实现扩展的国际化（i18n）。允许你根据用户的浏览器语言，加载不同的语言字符串和资源，使扩展适应全球用户。

*   `chrome.permissions`
    用于在运行时动态请求或撤销扩展所需的可选权限，替代在 manifest 文件中一次性声明所有权限，提升用户体验和信任度。

*   `chrome.scripting`
    在 Manifest V3 中取代了部分 `chrome.tabs` 的功能，用于向页面注入脚本（Script）或样式（CSS），提供了更安全和模块化的代码执行方式。

*   `chrome.storage`
    提供了一套数据存储API，用于在用户设备上持久化存储扩展数据。分为 `local`（本地）、`sync`（跨设备同步）和 `managed`（管理员策略配置）三种区域。

*   `chrome.declarativeContent`
    允许扩展根据页面内容和URL声明规则，只有当规则满足时，扩展的 `action` 图标才会变为可用状态，从而减少不必要的后台资源消耗。

*   `chrome.action`
    控制浏览器工具栏中扩展图标的行为。可以设置图标、标题、徽章（badge）文本和弹出页面（popup），是用户与扩展交互的主要入口。

*   `chrome.background`
    在 Manifest V3 中，此 API 主要用于配置 Service Worker 作为扩展的后台脚本，定义其持久化模式（虽然通常是非持久的）。

*   `chrome.manifest`
    这是一个虚拟的API命名空间，实际上指的是 `manifest.json` 文件。它是扩展的配置文件，定义了扩展的名称、版本、权限、脚本等所有元数据。

---

## **二、 用户界面 (User Interface)**

这些 API 用于创建和管理扩展的可见部分，如工具栏图标、右键菜单、命令快捷键等。

*   `chrome.commands`
    允许开发者为扩展的关键操作定义键盘快捷键。用户可以在 `chrome://extensions/shortcuts` 页面自定义这些快捷键。

*   `chrome.contextMenus`
    允许向Chrome的右键上下文菜单添加自定义项目。可以为特定页面、链接、图片等元素创建菜单项，并响应用户的点击事件。

*   `chrome.omnibox`
    允许扩展通过浏览器的地址栏（Omnibox）与用户进行交互。通过注册一个关键词，用户输入关键词后即可触发扩展的建议或搜索功能。

*   `chrome.sidePanel`
    允许扩展在浏览器侧边栏打开一个持久的界面。用户可以在浏览网页的同时与扩展UI进行交互，适用于笔记、工具集等场景。

*   `chrome.browserAction` (已废弃，由 `chrome.action` 替代)
    在 Manifest V2 中用于控制工具栏图标的 API。功能与 `chrome.action` 类似，但在 V3 中已被统一整合。

*   `chrome.pageAction` (已废弃，由 `chrome.action` 替代)
    在 Manifest V2 中用于控制特定页面才激活的工具栏图标。功能现已合并到 `chrome.action` 和 `declarativeContent` 中。

*   `chrome.app.window` (仅限 Chrome App)
    用于创建和管理 Chrome 应用的窗口，可以自定义窗口边框、大小、位置等。此 API 不适用于常规的 Chrome 扩展。

*   `chrome.app.runtime` (仅限 Chrome App)
    专为 Chrome 应用设计的运行时 API，用于管理应用的生命周期事件，如启动、重启等。

---

## **三、 浏览器交互 (Browser Interaction)**

这些 API 允许扩展与浏览器的核心组件进行交互，如标签页、窗口、书签和历史记录。

*   `chrome.tabs`
    提供了与浏览器标签页交互的丰富功能。可以创建、查询、修改、移动和关闭标签页，是大多数扩展功能的实现基础。

*   `chrome.windows`
    用于与浏览器窗口进行交互。可以创建、查询、修改和关闭窗口，并能监听窗口相关的事件，如窗口创建或焦点变化。

*   `chrome.bookmarks`
    允许扩展创建、读取、修改和组织用户的书签。可以用来开发书签管理、同步或快速访问等相关功能的扩展。

*   `chrome.history`
    提供了访问浏览器历史记录的功能。可以查询、添加、删除历史记录条目，并支持对历史记录进行搜索。

*   `chrome.sessions`
    允许查询和恢复浏览器会话。可以获取最近关闭的标签页和窗口，并能将它们恢复回来，常用于会话管理工具。

*   `chrome.tabGroups`
    用于管理标签页分组。可以创建、查询、更新和移动标签组，帮助用户更好地组织和管理大量的标签页。

*   `chrome.favicon`
    一个实验性 API，允许扩展访问和操作与特定 URL 关联的网站图标（favicon）。可以用于自定义标签页图标或书签图标。

*   `chrome.search`
    允许扩展通过编程方式使用默认搜索引擎进行搜索。可以指定搜索查询词，并在新标签页中打开搜索结果。

---

## **四、 通信与存储 (Communication & Storage)**

这类 API 负责扩展内部不同部分之间以及扩展与外部的数据交换和持久化。

*   `chrome.storage`
    (已在“核心功能”中介绍) 提供 `local`、`sync`、`session` 和 `managed` 存储区域，用于持久化或临时存储键值对数据。

*   `chrome.runtime.sendMessage` / `onMessage`
    扩展内部不同部分（如 background, popup, content script）之间进行消息通信的主要方式，支持一次性请求和响应。

*   `chrome.tabs.sendMessage` / `onMessage`
    专门用于从扩展的其他部分向特定标签页的内容脚本（Content Script）发送消息，是实现后台与页面交互的关键。

*   `chrome.runtime.connect` / `onConnect`
    用于在扩展的不同部分之间建立一个持久的、长连接的通信通道。适用于需要频繁、持续交换数据的场景。

*   `chrome.nativeMessaging`
    允许扩展与用户计算机上安装的本地原生应用程序进行通信。需要用户额外安装一个主机应用，用于处理需要超越浏览器能力的任务。

*   `chrome.gcm` (Google Cloud Messaging) (已废弃)
    曾用于从服务器向扩展推送消息。现在推荐使用 Web Push 协议或其他现代推送服务。

*   `chrome.identity`
    提供获取用户身份信息的 OAuth2 流程支持。可以帮助扩展安全地获取 Google 用户信息或其他支持 OAuth2 的服务授权。

*   `chrome.instanceID` (已废弃)
    曾用于为每个扩展实例生成唯一标识符，常与 GCM 配合使用。现在已不推荐使用。

---

## **五、 网络与Web请求 (Network & Web Requests)**

这些 API 提供了拦截、修改和分析网络流量的能力，是广告拦截、安全防护等扩展的核心。

*   `chrome.declarativeNetRequest`
    在 Manifest V3 中，这是拦截和修改网络请求的主要方式。通过声明式规则来匹配和操作请求，比 `webRequest` 更高效、更保护隐私。

*   `chrome.webRequest`
    在 Manifest V2 中，这是功能最强大的网络请求拦截 API。允许扩展在请求生命周期的各个阶段（如发送前、收到响应头后）观察和修改网络流量。在 V3 中功能受限。

*   `chrome.cookies`
    允许扩展查询和修改浏览器的 cookie。可以获取、设置、删除特定域的 cookie，并监听其变化。

*   `chrome.proxy`
    允许扩展管理 Chrome 的代理设置。可以配置浏览器使用指定的代理服务器来处理网络请求，常用于网络代理工具。

*   `chrome.webNavigation`
    提供了关于浏览器导航状态的实时通知。可以监听导航开始、完成、发生错误等事件，用于分析页面加载流程或实现页面跳转逻辑。

*   `chrome.browsingData`
    允许扩展清除用户的浏览数据，如缓存、历史记录、Cookie、密码等。常用于隐私清理或一键重置工具。

*   `chrome.certificateProvider`
    允许扩展向平台（如 ChromeOS）提供 TLS 客户端证书，用于需要证书进行身份验证的场景。

*   `chrome.dns`
    提供 DNS 解析功能。可以通过编程方式将主机名解析为 IP 地址，但此功能仅限于 ChromeOS 应用。

*   `chrome.mdns`
    允许扩展发现本地网络（mDNS/DNS-SD）上的服务。可以监听并解析在局域网内广播的服务信息。

---

## **六、 开发者工具与调试 (Developer Tools & Debugging)**

这些 API 专用于创建增强 Chrome 开发者工具功能的扩展。

*   `chrome.devtools.panels`
    允许扩展向开发者工具窗口添加新的面板（Panel），类似于 "Elements"、"Console" 面板。这是创建独立开发者工具页面的基础。

*   `chrome.devtools.inspectedWindow`
    提供了与被检查窗口交互的能力。可以获取被检查页面的 `tabId`，执行代码，或重新加载页面等。

*   `chrome.devtools.network`
    允许访问开发者工具中“Network”面板显示的网络请求信息。可以获取请求的详细数据，如 HAR 格式的日志。

*   `chrome.devtools.recorder`
    允许扩展自定义开发者工具中的“Recorder”（录制器）面板。可以扩展其功能，例如导出不同格式的录制脚本或提供自定义的回放选项。

*   `chrome.debugger`
    允许扩展附加到特定标签页，并作为远程调试协议（Chrome DevTools Protocol）的客户端。可以控制页面、监听事件、执行命令，功能非常强大。

---

## **七、 安全与隐私 (Security & Privacy)**

这些 API 专注于处理用户隐私和安全相关的设置与功能。

*   `chrome.privacy`
    允许扩展读取和修改 Chrome 的隐私相关设置，例如是否启用网络预测、安全浏览、拼写服务等。

*   `chrome.enterprise.platformKeys` (企业级)
    用于在企业环境中管理硬件支持的客户端证书。允许扩展生成密钥、导入证书，供企业策略下的 TLS 认证使用。

*   `chrome.platformKeys`
    提供了访问由平台管理（如 ChromeOS 上的 TPM）的 TLS 客户端证书的功能。可用于安全的网络认证。

*   `chrome.contentSettings`
    允许扩展控制网站是否可以使用某些功能，如 Cookie、JavaScript、插件、图片等。可以设置全局规则或针对特定网站的规则。

*   `chrome.loginState`
    一个仅在 ChromeOS 上可用的 API，用于检测用户的登录状态（例如是否已登录，登录的用户类型等）。

## **八、 输入与无障碍 (Input & Accessibility)**

这类 API 专注于改善用户输入体验和为有特殊需求的用户提供辅助功能。

*   `chrome.input.ime` (Input Method Engine)
    允许扩展实现自定义的输入法编辑器（IME）。可以用来创建新的语言输入法或特殊的文本输入工具，并在整个操作系统中使用（主要用于 ChromeOS）。

*   `chrome.tts` (Text-to-Speech)
    提供了文本转语音的功能。扩展可以调用此 API，使用系统或扩展安装的语音引擎将指定的文本朗读出来。

*   `chrome.ttsEngine` (Text-to-Speech Engine)
    允许扩展自身注册为一个语音引擎。其他扩展或应用可以通过 `chrome.tts` API 来使用这个引擎提供的语音服务。

*   `chrome.automation`
    一个强大的无障碍 API，允许扩展访问和操作页面的可访问性树（Accessibility Tree）。主要用于开发屏幕阅读器、自动化测试工具等辅助技术。

*   `chrome.accessibilityFeatures`
    允许扩展读取和修改浏览器级别的辅助功能设置，例如高对比度模式、屏幕放大镜、粘滞键等，主要在 ChromeOS 上使用。

---

## **九、 设备与硬件 (Device & Hardware)**

这些 API 提供了与用户计算机硬件或连接的外部设备进行交互的能力。

*   `chrome.alarms`
    提供了一个调度器，允许扩展在未来的特定时间或按固定周期执行代码。即使扩展的事件页面（Service Worker）处于休眠状态，闹钟到时也会被唤醒。

*   `chrome.desktopCapture`
    允许扩展捕获屏幕、特定窗口或标签页的内容，并将其作为媒体流（Media Stream）。是实现屏幕录制、直播或远程协助功能的核心。

*   `chrome.hid`
    允许扩展与连接到计算机的人机接口设备（HID）进行通信，例如非标准的键盘、游戏手柄、操纵杆等。需要用户明确授权。

*   `chrome.serial`
    提供了通过串行端口与设备进行通信的能力。常用于与 Arduino、微控制器、工业设备等硬件进行交互。

*   `chrome.usb`
    允许扩展与连接的 USB 设备直接通信。功能非常强大，但需要用户授权，并且通常需要在清单文件中声明特定的设备 ID。

*   `chrome.printing` (ChromeOS)
    提供了一个向已连接打印机提交打印作业的简单方法。主要用于在 Kiosk 模式下的 ChromeOS 应用中进行打印。

*   `chrome.printerProvider` (ChromeOS)
    允许扩展实现一个打印机驱动程序。可以发现网络打印机、查询其能力，并将打印作业发送到这些打印机，从而扩展 ChromeOS 的打印支持。

*   `chrome.power`
    允许扩展管理系统的电源状态。可以请求系统保持唤醒状态，防止在执行重要任务（如视频播放、数据计算）时进入睡眠。

*   `chrome.system.cpu`
    提供了查询系统中每个逻辑处理器的元数据和使用情况的功能。可用于性能监控或资源密集型任务的调度。

*   `chrome.system.memory`
    允许扩展获取关于系统物理内存容量和可用容量的信息。

*   `chrome.system.storage`
    允许扩展查询已连接存储设备（如硬盘、U盘）的容量和可用空间等信息，并能在新设备连接或移除时收到通知。

*-   `chrome.system.display`
提供了查询和管理显示器信息的功能。可以获取每个显示器的属性（如分辨率、边界），并在 ChromeOS 上修改它们。

---

## **十、 特定平台 API (Platform-Specific APIs)**

这些 API 主要或完全为特定操作系统（绝大多数是 ChromeOS）设计，用于实现与系统深度集成的功能。

*   `chrome.fileBrowserHandler` (ChromeOS)
    允许扩展在 ChromeOS 的文件管理器中注册自定义操作。例如，用户右键点击一个文件时，可以在菜单中看到由扩展提供的“用XX编辑”选项。

*   `chrome.fileSystemProvider` (ChromeOS)
    允许扩展实现一个虚拟文件系统，并将其挂载到 ChromeOS 的文件管理器中。用户可以像操作本地文件一样浏览和操作由扩展提供的数据（如云存储）。

*   `chrome.vpnProvider` (ChromeOS)
    允许扩展实现一个 VPN 客户端。可以配置和管理一个 VPN 连接，处理来自系统的网络流量。

*   `chrome.networking.config` (ChromeOS)
    允许扩展配置设备上的网络连接（如Wi-Fi），通常与企业策略配合使用，用于在受管设备上分发网络凭据。

*   `chrome.networking.onc` (ChromeOS)
    用于管理 Open Network Configuration (ONC) 格式的网络策略。可以导入证书、配置Wi-Fi或VPN等。

*   `chrome.login` (ChromeOS Kiosk)
    提供了在 ChromeOS Kiosk 会话中管理登录、重启等会话级操作的接口。

*   `chrome.wallpaper` (ChromeOS)
    允许扩展更改 ChromeOS 的桌面壁纸。可以设置来自 URL 或本地数据的图片作为壁纸。

---

## **十一、 其他高级或专用API (Other Advanced or Specialized APIs)**

这是一些功能独特、用途专门的 API，不完全属于上述任何一类。

*   `chrome.downloads`
    提供了与浏览器下载管理器交互的全面功能。可以启动、监控、暂停、取消和搜索下载项，也可以打开已下载的文件。

*   `chrome.offscreen`
    Manifest V3 引入的 API，用于创建一个在后台运行但不可见的文档（Offscreen Document）。解决了 Service Worker 无法访问 DOM API（如音频播放、剪贴板操作）的问题。

*   `chrome.documentScan`
    提供发现和从连接的文档扫描仪获取图像的功能。允许扩展构建扫描文档的应用。

*   `chrome.readingList`
    允许扩展与 Chrome 内置的“阅读清单”功能进行交互。可以添加、查询和移除阅读清单中的条目。

*   `chrome.tabCapture`
    提供了捕获特定标签页的音频和视频内容，并将其转换为媒体流的能力。常用于标签页录制、音频捕获等场景。

*   `chrome.topSites`
    允许扩展访问用户在新标签页上最常访问的网站列表。可以用来创建自定义的快速启动页面或提供个性化推荐。

*   `chrome.processes`
    允许扩展获取有关浏览器内部进程（例如每个标签页、扩展所占用的进程）的信息，包括 CPU 和内存使用情况。

*   `chrome.fontSettings` (已废弃)
    曾用于控制浏览器的字体设置。由于潜在的指纹识别风险，此 API 的大部分功能已被移除或限制。

*   `chrome.pageCapture`
    允许将一个标签页的完整内容（包括嵌入的子框架）保存为 MHTML 文件。

*   `chrome.systemLog`
*   一个仅在 ChromeOS 开发人员模式下可用的 API，用于从扩展程序中记录系统日志。
