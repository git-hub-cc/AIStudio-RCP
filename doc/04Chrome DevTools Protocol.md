### 领域 (Domain): Accessibility

**介绍**: 提供对页面可访问性（Accessibility, a11y）树的检查能力。通过这个领域，可以获取和操作页面的可访问性节点，帮助开发者评估和调试网站的无障碍功能。

#### **命令 (Commands)**

-   **disable**: 禁用 Accessibility 领域的事件发送。代理将不再发送任何可访问性相关的事件。
-   **enable**: 启用 Accessibility 领域的事件发送。启用后，后端会开始跟踪可访问性树的变化。
-   **getAXNodeAndAncestors**: 根据给定的标识符（`nodeId`、`backendNodeId` 或 `objectId`），获取对应的 AXNode（可访问性节点）及其所有祖先节点。
-   **getChildAXNodes**: 获取指定节点的所有直接子可访问性节点。
-   **getFullAXTree**: 获取整个页面的完整可访问性树。这对于全面分析页面的 a11y 结构非常有用。
-   **getRootAXNode**: 获取根可访问性节点。
-   **queryAXTree**: 查询可访问性树，根据指定的选择器（如角色、名称）返回匹配的节点。

#### **事件 (Events)**

-   **loadComplete**: 当一个新文档的完整可访问性树加载完成时触发。
-   **nodesUpdated**: 当可访问性树中的一个或多个节点发生变化时触发，例如属性改变或子节点增删。

#### **类型 (Types)**

-   **AXNodeId**: 可访问性节点的唯一标识符，字符串类型。
-   **AXValueType**: 可访问性节点值的类型。枚举值包括：`boolean`, `tristate`, `booleanOrUndefined`, `idref`, `idrefList`, `integer`, `node`, `nodeList`, `number`, `string`, `computedString`, `token`, `tokenList`, `domRelation`, `role`, `internalRole`, `valueUndefined`。
- aname: 'loadComplete',
  description: 'The loadComplete event is fired when the accessibility tree has changed dueto a load.',
  parameters: [
  { name: 'root', '$ref': 'AXNode', description: 'New root node of the accessibility tree.' }
  ]
  },
  {
  name: 'nodesUpdated',
  description: 'The nodesUpdated event is fired when the accessibility tree has changed.',
  parameters: [
  { name: 'nodes', type: 'array', items: { '$ref': 'AXNode' }, description: 'Updated node data.' }
  ]
  }
  ]
  },
  {
  "domain": "Accessibility",
  "description": "Provides interaction with accessibility domain.",
  "types": [
  {
  "id": "AXNodeId",
  "type": "string",
  "description": "Unique accessibility node identifier."
  },
  {
  "id": "AXValueType",
  "type": "string",
  "description": "Type of value of a property.",
  "enum": [
  "boolean",
  "tristate",
  "booleanOrUndefined",
  "idref",
  "idrefList",
  "integer",
  "node",
  "nodeList",
  "number",
  "string",
  "computedString",
  "token",
  "tokenList",
  "domRelation",
  "role",
  "internalRole",
  "valueUndefined"
  ]
  },
  {
  "id": "AXValueSourceType",
  "type": "string",
  "description": "Enum of possible property sources.",
  "enum": [
  "attribute",
  "implicit",
  "style",
  "contents",
  "placeholder",
  "relatedElement"
  ]
  },
  {
  "id": "AXValueNativeSourceType",
  "type": "string",
  "description": "Enum of possible native property sources (as a subtype of a particular AXValueSourceType).",
  "enum": [
  "figcaption",
  "label",
  "labelfor",
  "labelwrapped",
  "legend",
  "rubyannotation",
  "tablecaption",
  "title",
  "other"
  ]
  },
  {
  "id": "AXValueSource",
  "type": "object",
  "description": "A single source for a computed AX property.",
  "properties": [
  { "name": "type", "$ref": "AXValueSourceType", "description": "What type of source this is." },
  { "name": "value", "$ref": "AXValue", "optional": true, "description": "The value of this property source." },
  { "name": "attribute", "type": "string", "optional": true, "description": "The name of the relevant attribute, if any." },
  { "name": "attributeValue", "$ref": "AXValue", "optional": true, "description": "The value of the relevant attribute, if any." },
  { "name": "superseded", "type": "boolean", "optional": true, "description": "Whether this source is superseded by a higher priority source." },
  { "name": "nativeSource", "$ref": "AXValueNativeSourceType", "optional": true, "description": "The native source for this value, e.g. a <label> element." },
  { "name": "nativeSourceValue", "$ref": "AXValue", "optional": true, "description": "The value, such as a node or node list, of the native source." },
  { "name": "invalid", "type": "boolean", "optional": true, "description": "Whether the value for this property source is invalid." },
  { "name": "invalidReason", "type": "string", "optional": true, "description": "Reason for the value being invalid, if it is." }
  ]
  },
  {
  "id": "AXRelatedNode",
  "type": "object",
  "properties": [
  { "name": "backendDOMNodeId", "$ref": "DOM.BackendNodeId", "description": "The BackendNodeId of the related DOM node." },
  { "name": "idref", "type": "string", "optional": true, "description": "The IDRef value provided, if any." },
  { "name": "text", "type": "string", "optional": true, "description": "The text alternative of this node." }
  ]
  },
  {
  "id": "AXProperty",
  "type": "object",
  "properties": [
  { "name": "name", "type": "string", "description": "The name of this property." },
  { "name": "value", "$ref": "AXValue", "description": "The value of this property." }
  ]
  },
  {
  "id": "AXValue",
  "type": "object",
  "description": "A single computed AX property.",
  "properties": [
  { "name": "type", "$ref": "AXValueType", "description": "The type of this value." },
  { "name": "value", "type": "any", "optional": true, "description": "The computed value of this property." },
  { "name": "relatedNodes", "type": "array", "items": { "$ref": "AXRelatedNode" }, "optional": true, "description": "One or more related nodes, if applicable." },
  { "name": "sources", "type": "array", "items": { "$ref": "AXValueSource" }, "optional": true, "description": "The sources which contributed to the computation of this property." }
  ]
  },
  {
  "id": "AXGlobalStates",
  "type": "string",
  "description": "States which apply to every AX node.",
  "enum": [
  "disabled",
  "hidden",
  "hiddenRoot",
  "invalid",
  "keyshortcuts",
  "roledescription"
  ]
  },
  {
  "id": "AXLiveRegionAttributes",
  "type": "string",
  "description": "Attributes which apply to nodes in live regions.",
  "enum": [
  "live",
  "atomic",
  "relevant",
  "busy",
  "root"
  ]
  },
  {
  "id": "AXWidgetAttributes",
  "type": "string",
  "description": "Attributes which apply to widgets.",
  "enum": [
  "autocomplete",
  "haspopup",
  "level",
  "multiselectable",
  "orientation",
  "multiline",
  "readonly",
  "required",
  "valuemin",
  "valuemax",
  "valuetext"
  ]
  },
  {
  "id": "AXWidgetStates",
  "type": "string",
  "description": "States which apply to widgets.",
  "enum": [
  "checked",
  "expanded",
  "modal",
  "pressed",
  "selected"
  ]
  },
  {
  "id": "AXRelationshipAttributes",
  "type": "string",
  "description": "Relationships between elements other than parent/child/sibling.",
  "enum": [
  "activedescendant",
  "controls",
  "describedby",
  "details",
  "errormessage",
  "flowto",
  "labelledby",
  "owns"
  ]
  },
  {
  "id": "AXNode",
  "type": "object",
  "description": "A node in the accessibility tree.",
  "properties": [
  { "name": "nodeId", "$ref": "AXNodeId", "description": "Unique identifier for this node." },
  { "name": "ignored", "type": "boolean", "description": "Whether this node is ignored." },
  { "name": "ignoredReasons", "type": "array", "items": { "$ref": "AXProperty" }, "optional": true, "description": "Collection of reasons why this node is considered ignored." },
  { "name": "role", "$ref": "AXValue", "optional": true, "description": "This `Node`'s role, whether explicit or implicit." },
  { "name": "name", "$ref": "AXValue", "optional": true, "description": "The accessible name for this `Node`." },
  { "name": "description", "$ref": "AXValue", "optional": true, "description": "The accessible description for this `Node`." },
  { "name": "value", "$ref": "AXValue", "optional": true, "description": "The value for this `Node`." },
  { "name": "properties", "type": "array", "items": { "$ref": "AXProperty" }, "optional": true, "description": "All other properties." },
  { "name": "parentId", "$ref": "AXNodeId", "optional": true, "description": "The parent of this node." },
  { "name": "childIds", "type": "array", "items": { "$ref": "AXNodeId" }, "optional": true, "description": "IDs for each of this node's children." },
  { "name": "backendDOMNodeId", "$ref": "DOM.BackendNodeId", "optional": true, "description": "The backend ID for the associated DOM node, if any." },
  { "name": "frameId", "$ref": "Page.FrameId", "optional": true, "description": "The frame ID for the frame associated with this nodes document." }
  ]
  }
  ]
  }
-   **AXValueType**: 定义可访问性属性值的类型，如布尔、字符串、节点引用等，用于描述节点状态和特性。
-   **AXValueSourceType**: 定义可访问性属性值的来源类型，如来自HTML属性、样式或隐式规则，帮助追溯属性来源。
-   **AXValueNativeSourceType**: 更具体的属性来源，例如值来源于`<label>`或`<caption>`元素。
-   **AXValueSource**: 描述一个计算出的可访问性属性的单一来源，包含来源类型、值和相关属性等信息。
-   **AXRelatedNode**: 表示与当前节点相关的另一个节点，通常用于`aria-controls`等关系属性。
-   **AXProperty**: 表示一个键值对，包含可访问性属性的名称（如`name`）和其对应的值（`AXValue`）。
-   **AXValue**: 表示一个计算后的可访问性属性值，包含其类型、具体值、相关节点及值的来源等详细信息。
-   **AXGlobalStates**: 定义适用于所有节点的全局状态，如`disabled`（禁用）、`hidden`（隐藏）等。
-   **AXLiveRegionAttributes**: 定义适用于“实时区域”（live region）的属性，如`live`、`atomic`等，用于向辅助技术通知内容更新。
-   **AXWidgetAttributes**: 定义适用于小部件（widget）的属性，如`autocomplete`、`haspopup`等。
-   **AXWidgetStates**: 定义适用于小部件的状态，如`checked`（选中）、`expanded`（展开）等。
-   **AXRelationshipAttributes**: 定义节点间的关系属性，如`activedescendant`、`labelledby`等，用于描述非父子结构关系。
-   **AXNode**: 核心类型，表示可访问性树中的一个节点，包含ID、角色、名称、子节点、关联的DOM节点等所有信息。

---

### 领域 (Domain): Audits

**介绍**: Audits 领域提供对违规问题报告的访问能力，常用于 Lighthouse 等审计工具。它可以捕获并报告页面中不符合最佳实践、性能、可访问性等方面的问题。

#### **命令 (Commands)**

-   **checkContrast**: 检查页面文本元素的色彩对比度是否符合WCAG AA或AAA标准，并报告结果。
-   **disable**: 禁用 Audits 领域的事件发送。
-   **enable**: 启用 Audits 领域的事件发送，开始监听并报告问题。
-   **getEncodedResponse**: 获取指定请求的响应体，并根据指定的编码（如`webp`, `jpeg`）进行编码，通常用于图像质量审计。

#### **事件 (Events)**

-   **issueAdded**: 当检测到新的审计问题时触发，事件内容包含问题的详细信息。

#### **类型 (Types)**

-   **AffectedCookie**: 描述一个受影响的 Cookie，包含其名称和所属网站。
-   **AffectedRequest**: 描述一个受影响的网络请求，包含其请求ID和URL。
-   **AffectedFrame**: 描述一个受影响的 Frame，包含其 Frame ID。
-   **SameSiteCookieExclusionReason**: Cookie 未按 SameSite 规则发送的排除原因。
-   **SameSiteCookieWarningReason**: 因 SameSite 规则而产生警告的原因。
-   **SameSiteCookieOperation**: Cookie 操作类型，如读取或设置。
-   **SameSiteCookieIssueDetails**: `SameSite` Cookie 问题的详细信息。
-   **MixedContentResolutionStatus**: 混合内容问题的解决状态，如已阻止或自动升级。
-   **MixedContentResourceType**: 混合内容的资源类型，如音频、图片等。
-   **MixedContentIssueDetails**: 混合内容问题的详细信息，包括资源URL和解决状态。
-   **BlockedByResponseReason**: 响应被阻止的原因，例如 `corp-not-same-origin`。
-   **BlockedByResponseIssueDetails**: 因`Cross-Origin-Embedder-Policy`和`Cross-Origin-Opener-Policy`策略导致请求被阻止问题的详细信息。
-   **HeavyAdResolutionStatus**: 重度广告问题的解决状态，如已移除或警告。
-   **HeavyAdReason**: 被判定为重度广告的原因，如网络流量超限。
-   **HeavyAdIssueDetails**: 重度广告问题的详细信息。
-   **ContentSecurityPolicyViolationType**: 内容安全策略（CSP）违规的类型。
-   **ContentSecurityPolicyIssueDetails**: CSP 违规问题的详细信息。
-   **SharedArrayBufferIssueType**: `SharedArrayBuffer` 相关问题类型。
-   **SharedArrayBufferIssueDetails**: `SharedArrayBuffer` 使用问题的详细信息，通常与跨域隔离策略相关。
-   **LowTextContrastIssueDetails**: 文本色彩对比度过低问题的详细信息。
-   **CorsIssueDetails**: 跨源资源共享（CORS）问题的详细信息。
-   **AttributionReportingIssueType**: 归因报告（Attribution Reporting）API 问题的类型。
-   **AttributionReportingIssueDetails**: 归因报告 API 使用问题的详细信息。
-   **QuirksModeIssueDetails**: 页面处于怪异模式（Quirks Mode）问题的详细信息。
-   **GenericIssueDetails**: 通用问题类型的详细信息。
-   **DeprecationIssueDetails**: 已废弃功能使用问题的详细信息。
-   **ClientHintIssueReason**: 客户端提示（Client Hint）问题的具体原因。
-   **ClientHintIssueDetails**: 客户端提示相关问题的详细信息。
-   **InspectorIssueCode**: 检查器问题的唯一编码，如`SameSiteCookieIssue`。
-   **InspectorIssueDetails**: 所有检查器问题的集合，根据问题代码包含不同类型的详细信息。
-   **InspectorIssue**: 表示一个完整的检查器问题，包括问题代码、详细信息和问题类别。

---

### 领域 (Domain): Browser

**介绍**: Browser 领域提供了与浏览器本身交互的能力，而不是与特定页面交互。它可以用于控制浏览器窗口、下载、权限、获取版本信息等。

#### **命令 (Commands)**

-   **addPrivacySandboxEnrollmentOverride**: 添加一个覆盖，强制设定指定的隐私沙盒（Privacy Sandbox）注册状态。
-   **cancelDownload**: 取消一个正在进行的下载任务。
-   **close**: 关闭浏览器。
-   **crash**: 使浏览器主进程崩溃，用于测试。
-   **crashGpuProcess**: 使 GPU 进程崩溃，用于测试。
-   **executeBrowserCommand**: 执行一个浏览器级别的命令，如打开新窗口。
-   **getBrowserCommandLine**: 获取启动当前浏览器实例时使用的命令行参数。
-   **getHistograms**: 获取浏览器内部的统计直方图数据，用于性能分析。
    --   **getHistogram**: 获取指定名称的直方图数据。
-   **getVersion**: 获取浏览器的版本信息，包括协议版本、产品名称、User-Agent等。
-   **getWindowBounds**: 获取指定浏览器窗口的位置和尺寸。
-   **getWindowForTarget**: 获取包含指定目标（如页面）的浏览器窗口信息。
-   **grantPermissions**: 为特定源授予一个或多个权限，如地理位置、通知等。
-   **removePrivacySandboxEnrollmentOverride**: 移除之前设置的隐私沙盒注册状态覆盖。
-   **resetPermissions**: 重置指定源的所有权限设置。
-   **setDockTile**: （仅macOS）设置 Dock 图标上的徽章和标签。
-   **setDownloadBehavior**: 设置下载行为，如下载路径或是否拦截下载。
-   **setPermission**: 为特定源设置单个权限的状态（授予、拒绝或提示）。
-   **setWindowBounds**: 设置指定浏览器窗口的位置和尺寸。

#### **事件 (Events)**

-   **downloadProgress**: 当下载进度更新时触发，提供下载状态、已接收字节数等信息。
-   **downloadWillBegin**: 当一个下载即将开始时触发，提供文件名和URL等信息。

#### **类型 (Types)**

-   **BrowserContextID**: 浏览器上下文（如用户配置文件）的唯一标识符。
-   **WindowState**: 浏览器窗口的状态，如`normal`, `minimized`, `maximized`, `fullscreen`。
-   **Bounds**: 定义一个矩形区域，包含左、上、宽、高等属性。
-   **PermissionType**: 权限的类型枚举，如`geolocation`, `notifications`, `camera`等。
-   **PermissionSetting**: 权限的设置状态，如`granted`, `denied`, `prompt`。
-   **PermissionDescriptor**: 权限的描述符，包含权限名称和一些特定参数。
-   **Bucket**: 直方图数据中的一个桶，表示一个数值范围和该范围内的样本数。
-   **Histogram**: 浏览器内部的统计直方图，包含名称、总和、样本数和数据桶。
-   **DownloadProgressState**: 下载进度的状态，如`inProgress`, `completed`, `canceled`。

---

### 领域 (Domain): CacheStorage

**介绍**: CacheStorage 领域提供了与 Service Worker 的 Cache Storage 交互的能力。它允许开发者查看、查询和删除缓存的请求和响应数据。

#### **命令 (Commands)**

-   **deleteCache**: 删除指定名称的缓存。
-   **deleteEntry**: 从指定的缓存中删除一个条目（请求）。
-   **requestCacheNames**: 请求指定源的所有缓存名称。
-   **requestCachedResponse**: 获取指定缓存中与某个请求匹配的缓存响应。
-   **requestEntries**: 请求指定缓存中的条目列表，支持分页。

#### **类型 (Types)**

-   **CacheId**: 缓存的唯一标识符。
-   **CachedResponseType**: 缓存响应的类型，如`basic`, `cors`, `opaque`等。
-   **DataEntry**: 描述缓存中的一个数据条目，包含请求URL、请求和响应头等。
-   **Cache**: 描述一个缓存对象，包含ID、安全源、缓存名称等。
-   **Header**: 表示一个 HTTP 头部键值对。
-   **CachedResponse**: 表示一个完整的缓存响应，包含响应体和头部信息。

---

### 领域 (Domain): Cast

**介绍**: Cast 领域提供了与投射（Casting）设备交互的功能。它可以发现投射目标（如 Chromecast），并控制会话的开始和停止。

#### **命令 (Commands)**

-   **disable**: 禁用 Cast 领域，停止发现设备。
-   **enable**: 启用 Cast 领域，开始发现可用的投射接收器（Sinks）。
-   **setSinkToUse**: 设置将要用于投射的接收器。
-   **startDesktopMirroring**: 开始桌面镜像投射。
-   **startTabMirroring**: 开始标签页镜像投射。
-   **stopCasting**: 停止当前的投射会话。

#### **事件 (Events)**

-   **issueUpdated**: 当投射相关的问题更新时触发。
-   **sinksUpdated**: 当可用的投射接收器列表更新时触发。

#### **类型 (Types)**

-   **Sink**: 描述一个投射接收器，包含名称、ID和会话信息。

---

### 领域 (Domain): Console

**介绍**: Console 领域提供了与浏览器开发者工具控制台的交互能力。它可以捕获控制台消息、执行JavaScript表达式，并模拟用户输入。

#### **命令 (Commands)**

-   **clearMessages**: 清空控制台的所有消息。
-   **disable**: 禁用 Console 领域的事件发送。
-   **enable**: 启用 Console 领域的事件发送，开始收集控制台消息。

#### **事件 (Events)**

-   **messageAdded**: 当有新的控制台消息（如`log`, `error`, `warning`）被添加时触发。

#### **类型 (Types)**

-   **ConsoleMessageSource**: 消息来源，如`xml`, `javascript`, `network`。
-   **ConsoleMessageLevel**: 消息级别，如`log`, `info`, `warning`, `error`。
-   **ConsoleMessage**: 表示一条控制台消息，包含来源、级别、文本、堆栈跟踪等详细信息。

---

### 领域 (Domain): CSS

**介绍**: CSS 领域提供了检查和修改页面CSS样式的能力。它可以获取元素的计算样式、匹配的CSS规则，动态修改样式表，并跟踪CSS属性的变化。

#### **命令 (Commands)**

-   **addRule**: 在指定的样式表中添加一条新的CSS规则。
-   **collectClassNames**: 收集指定样式表中定义的所有类名。
-   **createStyleSheet**: 在指定的 Frame 中创建一个新的样式表。
-   **disable**: 禁用 CSS 领域的事件发送。
-   **enable**: 启用 CSS 领域的事件发送。
-   **forcePseudoState**: 强制一个DOM节点进入指定的伪类状态，如`:hover`或`:focus`。
-   **getBackgroundColors**: 获取指定节点的背景颜色，包括其在层叠上下文中的颜色。
-   **getComputedStyleForNode**: 获取指定DOM节点的计算样式。
-   **getInlineStylesForNode**: 获取指定DOM节点的内联样式。
-   **getMatchedStylesForNode**: 获取匹配指定DOM节点的所有CSS规则和样式。
-   **getMediaQueries**: 获取页面中所有的媒体查询规则。
-   **getPlatformFontsForNode**: 获取指定节点渲染时使用的平台字体信息。
-   **getStyleSheetText**: 获取指定样式表的文本内容。
-   **setEffectivePropertyValueForNode**: 为节点的某个CSS属性设置一个有效值（通常是内联样式）。
-   **setFontFaceTrackingEnabled**: 启用或禁用字体（`@font-face`）的跟踪。
-   **setFontsUpdatedEnabled**: 启用或禁用关于字体加载状态更新的事件。
-   **setKeyframeKey**: 修改CSS动画关键帧的`keyText`。
-   **setMediaText**: 修改媒体查询规则的文本。
-   **setRuleSelector**: 修改CSS规则的选择器。
-   **setStyleSheetText**: 修改整个样式表的文本内容。
-   **setStyleTexts**: 批量修改多个样式声明的文本。
-   **startRuleUsageTracking**: 开始跟踪CSS规则的使用情况。
-   **stopRuleUsageTracking**: 停止跟踪CSS规则的使用情况，并返回使用率报告。
-   **takeCoverageDelta**: 获取自上次调用以来CSS覆盖率的变化数据。
-   **trackComputedStyleUpdates**: 开始跟踪指定节点的计算样式更新。
-   **stopTrackingComputedStyleUpdates**: 停止跟踪计算样式更新。

#### **事件 (Events)**

-   **fontsUpdated**: 当页面使用的字体加载状态发生变化时触发。
-   **mediaQueryResultChanged**: 当媒体查询的结果（是否匹配）发生变化时触发。
-   **styleSheetAdded**: 当有新的样式表被添加到页面时触发。
-   **styleSheetChanged**: 当指定的样式表内容发生变化时触发。
-   **styleSheetRemoved**: 当一个样式表从页面中被移除时触发。

#### **类型 (Types)**

-   **StyleSheetId**: 样式表的唯一标识符。
-   **StyleSheetOrigin**: 样式表的来源，如`inspector`（开发者工具创建）、`user`（用户样式）、`user-agent`（浏览器默认）、`regular`（页面常规样式）。
-   **PseudoElementMatches**: 描述一个元素与其匹配的伪元素规则。
-   **InheritedStyleEntry**: 描述从祖先节点继承的样式。
-   **InheritedPseudoElementMatches**: 描述从祖先节点继承的伪元素样式。
-   **RuleMatch**: 描述一个DOM节点与一个CSS规则的匹配情况。
-   **Value**: 表示一个CSS属性值的文本和范围。
-   **SelectorList**: 包含一个选择器列表的文本和选择器对象。
-   **CSSStyleSheetHeader**: 样式表的元信息，包含ID、来源、标题、URL等。
-   **CSSRule**: 表示一条CSS规则，包含选择器、来源、样式声明等。
-   **RuleUsage**: 描述一条CSS规则的使用情况（是否被应用）。
-   **SourceRange**: 在源文件中定义一个文本范围，包含起始和结束的行列号。
-   **ShorthandEntry**: 表示一个简写属性（如`background`）的组成部分。
-   **CSSComputedStyleProperty**: 表示一个计算后的CSS属性，包含名称和值。
-   **CSSStyle**: 表示一个CSS样式声明块，包含属性列表、简写属性和文本。
-   **CSSProperty**: 表示一个CSS属性，包含名称、值、优先级（`!important`）、是否被解析等信息。
-   **CSSMedia**: 表示一个CSS媒体查询，包含文本、来源和设备特定参数。
-   **MediaQuery**: 描述一个媒体查询，包含其表达式和活动状态。
-   **MediaQueryExpression**: 媒体查询中的一个表达式，如`(min-width: 600px)`。
-   **PlatformFontUsage**: 描述一个平台上字体的使用情况，包括字形数量和字体家族。
-   **FontVariationAxis**: 描述一个可变字体的轴，如权重（`wght`）或宽度（`wdth`）。
-   **FontFace**: 描述一个`@font-face`规则定义的字体，包含字体家族、来源URL、变体轴等。
-   **CSSTryRule**: 表示CSS `@try` 规则。
-   **CSSPositionFallbackRule**: 描述一个 `@position-fallback` 规则。
-   **CSSPositionTryRule**: 描述一个 `@position-try` 规则。
-   **CSSKeyframesRule**: 表示一个CSS `@keyframes` 动画规则。
-   **CSSKeyframeRule**: 表示CSS动画中的一个关键帧。
-   **StyleDeclarationEdit**: 描述对样式声明的一次编辑操作，用于批量修改。
-   **CoverageRange**: 表示在样式表中一段被使用的代码范围。
-   **RuleUsageCoverage**: 描述一个样式表的CSS规则覆盖率。
-   **CSSLayerData**: 表示 `@layer` 规则的数据。
-   **CSSLayer**: 表示一个级联层（Cascade Layer）。
-   **CSSScope**: 表示 `@scope` 规则。
-   **CSSContainerQuery**: 表示一个 `@container` 规则。
-   **CSSSupports**: 表示 `@supports` 规则。
-   **CSSFontPaletteValuesRule**: 表示 `@font-palette-values` 规则。
-   **CSSStyleRule**: 表示一个普通的CSS样式规则。

好的，我们继续。

这是 **第二部分** 的内容，紧接上一部分，从 `Database` 领域开始。

***

### Chrome DevTools Protocol (CDP) 分类文档 - 第二部分

---

### 领域 (Domain): Database

**介绍**: 提供与（现已废弃的）Web SQL Database 交互的能力。允许执行 SQL 查询并查看数据库结构，主要用于调试遗留应用程序。

#### **命令 (Commands)**

-   **disable**: 禁用 Database 领域的事件发送。
-   **enable**: 启用 Database 领域的事件发送，开始跟踪数据库的添加。
-   **executeSQL**: 在指定的数据库上执行一条 SQL 语句。
-   **getDatabaseTableNames**: 获取指定数据库中所有表的名称。

#### **事件 (Events)**

-   **addDatabase**: 当页面添加一个新的数据库时触发。

#### **类型 (Types)**

-   **DatabaseId**: 数据库的唯一标识符。
-   **Database**: 描述一个数据库对象，包含ID、所属域和名称。
-   **Error**: 描述在执行 SQL 时发生的错误，包含错误消息和代码。

---

### 领域 (Domain): Debugger

**介绍**: 提供强大的 JavaScript 调试功能，允许暂停执行、设置断点、单步调试、检查作用域和调用栈，是脚本调试的核心。

#### **命令 (Commands)**

-   **continueToLocation**: 继续执行直到指定的位置。
-   **disable**: 禁用调试器，所有断点将被停用。
-   **enable**: 启用调试器，允许设置断点和暂停执行。
-   **evaluateOnCallFrame**: 在指定的调用栈帧（Call Frame）的作用域内执行 JavaScript 表达式。
-   **getPossibleBreakpoints**: 获取脚本中可以设置断点的所有可能位置。
-   **getScriptSource**: 获取指定脚本的源代码。
-   **getWasmBytecode**: 获取 WebAssembly 脚本的字节码。
-   **pause**: 暂停 JavaScript 执行。
-   **pauseOnAsyncCall**: 在执行指定的异步调用（如`setTimeout`）之前暂停。
-   **removeBreakpoint**: 移除一个已设置的断点。
-   **restartFrame**: 重新执行指定的调用栈帧。
-   **resume**: 恢复被暂停的 JavaScript 执行。
-   **searchInContent**: 在脚本内容中搜索指定的字符串或正则表达式。
-   **setAsyncCallStackDepth**: 设置异步调用栈的最大跟踪深度。
-   **setBlackboxPatterns**: 设置用于“黑盒”（blackbox）脚本的 URL 模式。黑盒脚本在调试时会被忽略。
-   **setBlackboxedRanges**: 在一个脚本中将指定的代码范围标记为黑盒。
-   **setBreakpoint**: 在脚本的指定位置设置一个断点。
-   **setBreakpointByUrl**: 通过 URL 和行列号在一个脚本中设置断点。
-   **setBreakpointsActive**: 批量激活或停用所有断点。
-   **setInstrumentationBreakpoint**: 设置一个"仪表"断点，例如在事件监听器执行前暂停。
-   **setPauseOnExceptions**: 设置异常暂停行为（不暂停、在未捕获的异常处暂停、或在所有异常处暂停）。
-   **setReturnValue**: 修改当前暂停的函数执行完成后的返回值。
-   **setScriptSource**: 在运行时修改脚本的源代码（Live Edit），并返回修改后的调用栈信息。
-   **setVariableValue**: 在指定的调用栈帧的作用域内修改一个变量的值。
-   **stepInto**: 单步进入（Step Into），如果当前语句是函数调用，则进入该函数内部。
-   **stepOut**: 单步跳出（Step Out），执行完当前函数并返回到调用处。
-   **stepOver**: 单步跳过（Step Over），执行下一行代码，如果当前行是函数调用则不会进入其内部。

#### **事件 (Events)**

-   **breakpointResolved**: 当一个断点被成功设置到实际位置时触发。
-   **paused**: 当 JavaScript 执行被暂停时（例如遇到断点、`debugger`语句或异常）触发。
-   **resumed**: 当 JavaScript 执行从暂停状态恢复时触发。
-   **scriptFailedToParse**: 当一个脚本因为语法错误等原因未能被解析时触发。
-   **scriptParsed**: 当一个新的脚本被成功解析后触发，提供脚本的ID、URL等信息。

#### **类型 (Types)**

-   **BreakpointId**: 断点的唯一标识符。
-   **CallFrameId**: 调用栈帧的唯一标识符。
-   **Location**: 在脚本源代码中的一个位置，由脚本ID和行列号定义。
-   **ScriptPosition**: 在脚本中的位置，仅包含行列号。
-   **LocationRange**: 在脚本源代码中的一个位置范围。
-   **CallFrame**: 描述一个调用栈帧，包含函数名、位置、作用域链、`this`对象和返回值。
-   **Scope**: 描述一个作用域（如全局、局部、闭包），包含其类型和关联的对象。
-   **SearchMatch**: 在脚本内容搜索中匹配到的结果。
-   **BreakLocation**: 描述一个可以设置断点的具体位置。
-   **ScriptLanguage**: 脚本的语言，如 `JavaScript` 或 `WebAssembly`。
-   **DebugSymbols**: 调试符号信息，用于将编译后代码（如Wasm）映射回源代码。
-   **WasmDisassemblyChunk**: 一段 WebAssembly 字节码的反汇编代码。

---

### 领域 (Domain): DeviceOrientation

**介绍**: 提供模拟设备方向的功能。允许覆盖设备的物理方向传感器数据（alpha, beta, gamma），用于测试依赖设备方向的网页应用。

#### **命令 (Commands)**

-   **clearDeviceOrientationOverride**: 清除之前设置的设备方向覆盖值，恢复为使用真实传感器数据。
-   **setDeviceOrientationOverride**: 设置一个虚拟的设备方向值，覆盖真实的传感器数据。

---

### 领域 (Domain): DOM

**介绍**: 提供与页面文档对象模型（DOM）交互的核心能力。允许查询和修改 DOM 节点、获取属性、监听 DOM 变化，是页面自动化和检查的基础。

#### **命令 (Commands)**

-   **collectClassNamesFromSubtree**: 从指定节点的子树中收集所有用到的 CSS 类名。
-   **copyTo**: 将指定节点复制到目标节点下。
-   **describeNode**: 描述一个 DOM 节点，返回其详细信息，如节点名称、属性、子节点数等。
-   **disable**: 禁用 DOM 领域的事件发送。
-   **discardSearchResults**: 丢弃之前执行的搜索操作的结果。
-   **enable**: 启用 DOM 领域的事件发送。
-   **focus**: 使指定的 DOM 节点获得焦点。
-   **getAttributes**: 获取指定节点的 HTML 属性。
-   **getBoxModel**: 获取指定节点的盒子模型信息，包括 content, padding, border, margin 的尺寸和位置。
-   **getContainerForNode**: 获取指定节点的包含块（containing block）信息，用于 CSS containments。
-   **getContentQuads**: 获取节点内容的可视四边形区域（Quads），对于处理换行或多列文本非常有用。
-   **getDocument**: 返回页面的根文档节点。
-   **getFlattenedDocument**: 以扁平化列表的形式返回整个文档的 DOM 节点，包含 Shadow DOM 和 iframe 内容。
-   **getNodesForSubtreeByStyle**: 获取子树中符合特定计算样式的节点。
-   **getNodeForLocation**: 根据页面上的坐标（x, y）获取对应的 DOM 节点。
-   **getOuterHTML**: 获取指定节点的 `outerHTML`。
-   **getParentOfPlayer**: 获取与媒体播放器（player）关联的父节点。
-   **getPlayerIdForName**: 根据播放器名称获取其ID。
-   **getQueryingDescendantsForContainer**: 获取容器查询（container query）中正在查询指定容器的后代节点。
-   **getRelayoutBoundary**: 获取指定节点的重排（relayout）边界。
-   **getSearchResults**: 获取执行搜索后的一段结果。
-   **hideHighlight**: 隐藏 DevTools 在页面上显示的节点高亮。
-   **highlightNode**: 在页面上高亮显示指定的 DOM 节点。
-   **highlightRect**: 在页面上高亮显示一个矩形区域。
-   **moveTo**: 将指定节点移动到目标容器节点下，并可指定锚点节点。
-   **performSearch**: 在整个 DOM 树中执行字符串搜索。
-   **pushNodeByPathToFrontend**: 请求后端通过其完整路径来识别一个节点，并将其ID推送给前端。
-   **pushNodesByBackendIdsToFrontend**: 请求后端通过它们的`BackendNodeId`来识别一组节点，并将它们的ID推送给前端。
-   **querySelector**: 在指定节点下执行 `querySelector`，返回匹配的第一个节点。
-   **querySelectorAll**: 在指定节点下执行 `querySelectorAll`，返回所有匹配的节点。
-   **removeAttribute**: 移除指定节点的某个属性。
-   **removeNode**: 从 DOM 树中移除指定节点。
-   **requestChildNodes**: 请求获取指定节点的子节点。
-   **requestNode**: 请求获取与给定 JavaScript 对象关联的 DOM 节点。
-   **resolveNode**: 根据给定的`nodeId`解析节点，返回其在`Runtime`领域中的对象表示。
-   **scrollIntoViewIfNeeded**: 如果节点不在视口内，则滚动页面使其可见。
-   **setAttributeValue**: 设置指定节点的属性值。
-   **setAttributesAsText**: 以文本形式批量设置节点的属性。
-   **setFileInputFiles**: 为文件输入框（`<input type="file">`）设置要上传的文件列表。
-   **setNodeName**: 设置节点的名称（标签名）。
-   **setNodeStackTracesEnabled**: 启用或禁用在获取节点时附带其创建时的堆栈跟踪信息。
-   **setNodeValue**: 设置节点的 `nodeValue`。
-   **setOuterHTML**: 设置指定节点的 `outerHTML`。

#### **事件 (Events)**

-   **attributeModified**: 当节点的属性被添加或修改时触发。
-   **attributeRemoved**: 当节点的属性被移除时触发。
-   **characterDataModified**: 当文本节点（`CharacterData`）的内容发生变化时触发。
-   **childNodeCountUpdated**: 当节点的子节点数量发生变化时触发。
-   **childNodeInserted**: 当一个子节点被插入到某个节点下时触发。
-   **childNodeRemoved**: 当一个子节点被移除时触发。
-   **distributedNodesUpdated**: 当 Shadow DOM 的插槽（`<slot>`）分发的内容发生变化时触发。
-   **documentUpdated**: 当文档状态更新时触发，表示整个文档可能已发生变化，应重新获取。
-   **inlineStyleInvalidated**: 当节点的内联样式（`style`属性）失效时触发，通常是因为样式被批量修改。
-   **pseudoElementAdded**: 当一个伪元素被添加到节点上时触发。
-   **pseudoElementRemoved**: 当一个伪元素被从节点上移除时触发。
-   **setChildNodes**: 一次性设置某个节点的全部子节点，用于初始化或大规模更新。
-   **shadowRootPopped**: 当一个 Shadow Root 从其宿主元素上被移除时触发。
-   **shadowRootPushed**: 当一个 Shadow Root 被附加到其宿主元素上时触发。

#### **类型 (Types)**

-   **NodeId**: DOM 节点在协议中的唯一标识符。
-   **BackendNodeId**: DOM 节点在浏览器后端中的唯一标识符。
-   **BackendNode**: 描述一个后端节点，包含其类型和名称。
-   **Node**: 描述一个 DOM 节点的核心类型，包含ID、父ID、节点类型、名称、值、属性、子节点等详细信息。
-   **PseudoType**: 伪元素的类型，如`first-line`, `before`, `after`, `backdrop`等。
-   **ShadowRootType**: Shadow Root 的类型，如`user-agent`（浏览器内部使用）、`open`或`closed`。
-   **CompatibilityMode**: 文档的兼容性模式，如`QuirksMode`或`NoQuirksMode`。
-   **Quad**: 一个由四个点定义的四边形，用于表示页面上的任意形状区域。
-   **BoxModel**: 节点的盒子模型，包含 content, padding, border, margin 四个区域的 `Quad` 和尺寸。
-   **ShapeOutsideInfo**: 描述 `shape-outside` CSS 属性计算出的形状信息。
-   **Rect**: 一个矩形，由左上角坐标 (x, y) 和宽高定义。
-   **CSSSelector**: 一个 CSS 选择器字符串。
-   **RGBA**: 表示一个 RGBA 颜色，包含 `r` (红), `g` (绿), `b` (蓝), `a` (透明度) 四个分量。
-   **NodeLink**: 表示节点链接状态，包含链接的文本和关联的可访问性节点（AXNode）。
-   **PhysicalAxes**: 描述一个物理轴向，如 `Vertical` 或 `Horizontal`。
-   **LogicalAxes**: 描述一个逻辑轴向，如 `Block` 或 `Inline`，与书写模式相关。
-   **ContainerQuery**: 描述一个 CSS 容器查询。
-   **ContainerQueryContainer**: 描述一个作为容器查询的容器的节点。

---

### 领域 (Domain): DOMDebugger

**介绍**: 提供与 DOM 相关的调试功能。它允许开发者在 DOM 发生特定变化时（如属性修改、子树变更、节点移除）暂停 JavaScript 执行，类似于在代码中设置断点。

#### **命令 (Commands)**

-   **getEventListeners**: 获取指定 DOM 节点上注册的所有事件监听器。
-   **removeDOMBreakpoint**: 移除一个之前设置的 DOM 断点。
-   **removeEventListenerBreakpoint**: 移除一个事件监听器断点。
-   **removeInstrumentationBreakpoint**: 移除一个仪表断点。
-   **removeXHRBreakpoint**: 移除一个 XHR/Fetch 断点。
-   **setDOMBreakpoint**: 在指定的 DOM 节点上设置一个断点，当节点发生特定类型的变化时触发。
-   **setEventListenerBreakpoint**: 设置一个断点，当特定名称的事件（如 `click`）被触发时暂停执行。
-   **setInstrumentationBreakpoint**: 设置一个仪表断点，在某些原生函数（如`requestAnimationFrame`）执行前暂停。
-   **setXHRBreakpoint**: 设置一个断点，当 XHR 或 Fetch 请求的 URL 包含指定子串时暂停。

#### **类型 (Types)**

-   **DOMBreakpointType**: DOM 断点的类型。枚举值包括：`subtree-modified` (子树修改), `attribute-modified` (属性修改), `node-removed` (节点移除)。
-   **EventListener**: 描述一个注册在 DOM 节点上的事件监听器，包含事件类型、处理函数、源文件位置等信息。

---

### 领域 (Domain): DOMSnapshot

**介绍**: 提供捕获页面 DOM 树和计算样式快照的能力。这是一种高效的方式，可以一次性获取整个页面的结构和样式信息，而无需逐个节点查询，非常适用于需要分析页面静态状态的工具。

#### **命令 (Commands)**

-   **captureSnapshot**: 捕获页面的快照。可以配置是否包含计算样式、白名单属性、DOM 节点绘制的矩形区域等。
-   **disable**: 禁用 DOMSnapshot 代理。
-   **enable**: 启用 DOMSnapshot 代理。

#### **类型 (Types)**

-   **DOMNode**: 描述快照中的一个 DOM 节点，包含节点类型、名称、值、属性、子节点索引等信息。
-   **LayoutTreeNode**: 描述快照中的一个布局树节点，包含其对应的 DOM 节点索引、边界框和样式信息。
-   **ComputedStyle**: 描述快照中的计算样式，由一组属性名/值对组成。
-   **NameValue**: 一个简单的名称-值对，用于表示属性和样式。
-   **StringIndex**: 字符串在快照字符串表中的索引，用于减少数据冗余。
-   **ArrayOfStrings**: 字符串数组。
-   **Rectangle**: 一个矩形区域的尺寸和位置。
-   **DocumentSnapshot**: 整个文档的快照，包含 DOM 节点、布局树和字符串表。
-   **LayoutTreeSnapshot**: 布局树的快照，包含节点坐标和堆叠顺序信息。
-   **TextBoxSnapshot**: 描述文本框布局的快照，包含其文本内容和边界。

---

### 领域 (Domain): DOMStorage

**介绍**: 提供与 Web Storage（`localStorage` 和 `sessionStorage`）交互的能力。允许开发者查看、添加、修改和删除存储项，并监听存储的变化。

#### **命令 (Commands)**

-   **clear**: 清空指定的存储区域（`localStorage` 或 `sessionStorage`）。
-   **disable**: 禁用 DOMStorage 领域的事件发送。
-   **enable**: 启用 DOMStorage 领域的事件发送。
-   **getDOMStorageItems**: 获取指定存储区域中的所有键值对。
-   **removeDOMStorageItem**: 从指定的存储区域中移除一个项目。
-   **setDOMStorageItem**: 在指定的存储区域中设置或更新一个项目。

#### **事件 (Events)**

-   **domStorageItemAdded**: 当有新项目被添加到存储区时触发。
-   **domStorageItemRemoved**: 当有项目从存储区被移除时触发。
    --   **domStorageItemUpdated**: 当存储区中某个项目的值被更新时触发。
-   **domStorageItemsCleared**: 当整个存储区被清空时触发。

#### **类型 (Types)**

-   **StorageId**: 存储区域的唯一标识符，包含安全源和是否为 `localStorage` 的标志。
-   **Item**: 一个存储项，表示为一个 [key, value] 格式的字符串数组。

---

### 领域 (Domain): Emulation

**介绍**: 提供模拟不同设备和环境的功能，是进行响应式设计和移动端测试的强大工具。可以模拟设备尺寸、用户代理（UA）、地理位置、网络条件、时区等。

#### **命令 (Commands)**

-   **canEmulate**: 查询浏览器是否支持模拟功能。
-   **clearDeviceMetricsOverride**: 清除设备指标的模拟，恢复为默认值。
-   **clearGeolocationOverride**: 清除地理位置的模拟。
-   **clearTouchEmulationConfiguration**: 清除触摸事件的模拟配置。
-   **resetPageScaleFactor**: 重置页面的缩放因子。
-   **setAutoDarkModeOverride**: 自动模拟系统的暗黑模式。
-   **setAutomationOverride**: 设置一个自动化标记，可以影响某些浏览器行为。
-   **setCPUThrottlingRate**: 设置 CPU 节流速率，模拟性能较差的设备。
-   **setDefaultBackgroundColorOverride**: 覆盖页面的默认背景色，用于截图等场景。
-   **setDeviceMetricsOverride**: 设置设备指标，包括屏幕宽高、设备像素比（DPR）、是否为移动设备等。
-   **setDisabledImageTypes**: 禁用特定类型的图片加载。
-   **setDocumentCookieDisabled**: 禁用或启用 `document.cookie` 的访问。
-   **setEmitTouchEventsForMouse**: 配置是否将鼠标事件转换为触摸事件。
-   **setEmulatedMedia**: 模拟 CSS 媒体特性，如 `prefers-color-scheme` 或 `prefers-reduced-motion`。
-   **setEmulatedVisionDeficiency**: 模拟视觉缺陷，如色盲，用于可访问性测试。
-   **setFocusEmulationEnabled**: 启用或禁用焦点模拟，帮助调试非激活页面的焦点行为。
-   **setGeolocationOverride**: 设置一个虚拟的地理位置坐标。
-   **setHardwareConcurrencyOverride**: 覆盖 `navigator.hardwareConcurrency` 的值。
-   **setIdleOverride**: 模拟用户的空闲状态。
-   **setLocaleOverride**: 覆盖浏览器的区域设置（locale）。
-   **setNavigatorOverrides**: 覆盖 `navigator` 对象的一系列属性。
-   **setPageScaleFactor**: 设置页面的缩放因子。
-   **setScrollbarsHidden**: 隐藏页面的滚动条。
-   **setScriptExecutionDisabled**: 禁用页面的 JavaScript 执行。
-   **setTimezoneOverride**: 设置一个虚拟的时区。
-   **setTouchEmulationEnabled**: 启用或禁用触摸事件模拟。
-   **setUserAgentOverride**: 设置自定义的用户代理（User-Agent）字符串和相关的客户端提示（Client Hints）。
-   **setVirtualTimePolicy**: 设置虚拟时间策略，用于“时间旅行”调试，可以控制时间的流逝。

#### **事件 (Events)**

-   **virtualTimeBudgetExpired**: 当虚拟时间预算用尽时触发。
-   **virtualTimePaused**: 当虚拟时间前进并在设置的断点处暂停时触发。

#### **类型 (Types)**

-   **ScreenOrientationType**: 屏幕方向类型，如 `portraitPrimary`, `landscapePrimary` 等。
-   **ScreenOrientation**: 描述屏幕方向，包含类型和角度。
-   **DisplayFeature**: 描述显示特性，如设备折叠区域或摄像头开孔。
-   **MediaFeature**: 描述一个 CSS 媒体特性及其值，用于模拟。
-   **VirtualTimePolicy**: 虚拟时间的推进策略。
-   **UserAgentBrandVersion**: 描述 User-Agent 客户端提示中的品牌和版本。
-   **UserAgentMetadata**: 描述完整的 User-Agent 客户端提示元数据。
-   **DisabledImageType**: 要禁用的图片类型，如 `avif`, `webp`。
-   **VisionDeficiency**: 视觉缺陷类型，如 `protanopia` (红色盲), `deuteranopia` (绿色盲)。

---

### 领域 (Domain): EventBreakpoints

**介绍**: 此领域已废弃，其功能已合并到 `DOMDebugger` 领域中。它主要用于在特定的事件监听器处设置断点。

---

### 领域 (Domain): Fetch

**介绍**: 提供拦截、修改和响应网络请求的能力。这是一个功能强大的领域，允许在请求发出前修改它，或在收到响应后修改它，甚至可以完全伪造响应，非常适合用于 Mock 数据和网络调试。

#### **命令 (Commands)**

-   **continueRequest**: 继续一个被暂停的请求，可以修改 URL、方法、头信息等。
-   **continueResponse**: 继续一个被暂停的响应，可以修改响应码、头信息、或提供自定义的响应体。
-   **continueWithAuth**: 为需要认证的请求提供凭据并继续。
-   **disable**: 禁用 Fetch 领域的请求拦截。
-   **enable**: 启用 Fetch 领域的请求拦截，可以指定拦截的 URL 模式和阶段（请求阶段或响应阶段）。
-   **failRequest**: 以指定的网络错误原因使一个被暂停的请求失败。
-   **fulfillRequest**: 用一个自定义的响应来完成一个被暂停的请求。
-   **getResponseBody**: 获取被拦截请求的响应体。
-   **takeResponseBodyAsStream**: 将被拦截请求的响应体作为一个数据流来读取。

#### **事件 (Events)**

-   **authRequired**: 当一个请求需要认证时触发，此时请求被暂停。
-   **requestPaused**: 当一个网络请求在指定阶段（请求或响应）被暂停时触发。

#### **类型 (Types)**

-   **RequestId**: 网络请求在 Fetch 领域的唯一标识符。
-   **RequestStage**: 请求被拦截的阶段，`Request` 或 `Response`。
-   **RequestPattern**: 用于匹配要拦截的请求的模式，包含 URL 模式、资源类型和请求阶段。
-   **HeaderEntry**: 一个 HTTP 头部键值对。
-   **AuthChallenge**: 描述一个认证挑战，如 Basic 或 Digest 认证。
-   **AuthChallengeResponse**: 对认证挑战的响应，提供用户名和密码或直接取消。
-   **ErrorReason**: 网络错误的原因，如 `Failed`, `Aborted`, `TimedOut`。


### 领域 (Domain): HeadlessExperimental

**介绍**: 提供在无头（Headless）模式下运行浏览器时的一些实验性功能。主要用于控制截图和PDF打印的渲染帧，允许更精确地捕捉页面在特定时刻的状态。

#### **命令 (Commands)**

-   **beginFrame**: 在无头模式下开始一个新的渲染帧。成功后，可以进行截图或打印操作。
-   **disable**: 禁用无头模式的实验性功能。
-   **enable**: 启用无头模式的实验性功能。

#### **事件 (Events)**

-   **needsBeginFramesChanged**: 当主帧的渲染策略需要客户端通过`beginFrame`命令来驱动时触发。

#### **类型 (Types)**

-   **ScreenshotParams**: 定义截图的参数，如格式（`jpeg`, `png`）和质量。

---

### 领域 (Domain): HeapProfiler

**介绍**: 提供与 V8 JavaScript 堆分析器的交互能力。它允许捕获堆快照（Heap Snapshot）、跟踪对象分配、收集垃圾回收（GC）信息，是诊断内存泄漏和优化内存占用的关键工具。

#### **命令 (Commands)**

-   **addInspectedHeapObject**: 允许在堆快照中通过编程方式选择一个对象，使其在 DevTools 的摘要视图中高亮显示。
-   **collectGarbage**: 触发一次 V8 的垃圾回收。
-   **disable**: 禁用堆分析器。
-   **enable**: 启用堆分析器，开始收集基本信息。
-   **getHeapObjectId**: 根据给定的运行时对象ID，获取其在堆快照中的ID。
-   **getObjectByHeapObjectId**: 根据堆快照中的对象ID，获取其在运行时中的表示。
-   **getSamplingProfile**: 获取一个通过采样记录的内存分配剖面。
-   **startSampling**: 开始以采样的方式记录内存分配，开销较低。
-   **startTrackingHeapObjects**: 开始跟踪堆对象的分配情况，会记录详细的分配堆栈信息。
-   **stopSampling**: 停止内存分配的采样，并返回记录到的剖面数据。
-   **stopTrackingHeapObjects**: 停止跟踪堆对象分配，并返回分配报告。可以配置是否同时生成快照。
-   **takeHeapSnapshot**: 拍摄一张 V8 堆的快照，可以配置是否包含数值等额外信息。

#### **事件 (Events)**

-   **addHeapSnapshotChunk**: 当拍摄堆快照时，以数据块（chunk）的形式分片发送快照内容。
-   **heapStatsUpdate**: 定期发送堆统计信息的更新，如已用堆大小、总大小等。
-   **lastSeenObjectId**: 报告最后一次分配的对象的ID，用于同步状态。
-   **reportHeapSnapshotProgress**: 报告堆快照的拍摄进度。
-   **resetProfiles**: 当分析器重置时（如页面导航）触发，通知前端清空已有的数据。

#### **类型 (Types)**

-   **HeapSnapshotObjectId**: 堆快照中对象的唯一ID。
-   **SamplingHeapProfileNode**: 采样堆剖面中的一个节点，代表一个函数调用，包含函数信息和分配大小。
-   **SamplingHeapProfileSample**: 一次内存分配的采样记录，包含大小和在剖面树中的位置。
-   **SamplingHeapProfile**: 完整的采样堆剖面，由一个树状的节点结构和采样记录组成。

---

### 领域 (Domain): IndexedDB

**介绍**: 提供与 IndexedDB 数据库交互的功能。允许开发者检查数据库、对象存储（Object Store）、索引和数据条目，是调试客户端存储的重要工具。

#### **命令 (Commands)**

-   **clearObjectStore**: 清空指定的对象存储中的所有数据。
-   **deleteDatabase**: 删除整个 IndexedDB 数据库。
-   **deleteObjectStoreEntries**: 删除对象存储中符合指定键范围的条目。
-   **disable**: 禁用 IndexedDB 领域的事件发送。
-   **enable**: 启用 IndexedDB 领域的事件发送。
-   **getMetadata**: 获取对象存储或索引的元数据，如主键路径、是否自增等。
-   **requestData**: 请求获取指定对象存储或索引中的数据，支持分页和键范围查询。
-   **requestDatabase**: 请求获取指定数据库的详细信息，包括其所有对象存储和索引。
-   **requestDatabaseNames**: 请求指定安全源下的所有 IndexedDB 数据库名称。

#### **类型 (Types)**

-   **DatabaseWithObjectStores**: 描述一个数据库及其包含的对象存储。
-   **ObjectStore**: 描述一个对象存储，包含名称、主键路径和索引列表。
-   **ObjectStoreIndex**: 描述一个对象存储中的索引，包含名称、键路径、是否唯一等信息。
-   **Key**: 表示一个 IndexedDB 的键，可以是多种类型（数字、字符串、日期、数组）。
-   **KeyRange**: 描述一个键的范围，用于查询。
-   **DataEntry**: 描述一条数据记录，包含主键、键和对应的值。
-   **KeyPath**: 描述用于从对象中提取键的路径。

---

### 领域 (Domain): Input

**介绍**: 提供模拟用户输入事件的能力，包括鼠标、键盘和触摸事件。这是实现浏览器自动化、进行用户交互测试和模拟不同输入设备的核心领域。

#### **命令 (Commands)**

-   **dispatchKeyEvent**: 派发一个键盘事件，如 `keyDown`, `keyUp`, `char`。
-   **dispatchMouseEvent**: 派发一个鼠标事件，如 `mousePressed`, `mouseMoved`, `mouseReleased`。
-   **dispatchTouchEvent**: 派发一个触摸事件，如 `touchStart`, `touchMove`, `touchEnd`。
-   **emulateTouchFromMouseEvent**: 模拟触摸事件，将后续的鼠标事件转换为相应的触摸事件。
-   **insertText**: 插入指定的文本，模拟用户输入。
-   **imeSetComposition**: (实验性) 在输入法编辑器（IME）中设置组合文本。
-   **setIgnoreInputEvents**: 设置是否忽略所有输入事件，用于防止用户干扰自动化脚本。
-   **synthesizePinchGesture**: 模拟一个双指缩放手势。
-   **synthesizeScrollGesture**: 模拟一个滚动（滚轮或触摸板）手势。
-   **synthesizeTapGesture**: 模拟一个点击手势。

#### **类型 (Types)**

-   **TouchPoint**: 描述一个触摸点，包含其坐标、半径、旋转角度和力度。
-   **GestureSourceType**: 手势的来源类型，如 `default`, `touch`, `mouse`。
-   **MouseButton**: 鼠标按键类型，如 `left`, `middle`, `right`。
-   **TimeSinceEpoch**: 从 Unix 纪元开始的时间戳（秒）。
-   **DragDataItem**: 拖放操作中的一个数据项。
-   **DragData**: 拖放操作的完整数据，包含数据项、文件列表和拖动图像。

---

### 领域 (Domain): IO

**介绍**: 提供对 I/O 流的读取能力。当其他领域（如 `Network` 或 `Page`）返回一个流句柄（StreamHandle）时，可以使用此领域来读取流中的数据，常用于获取大的响应体或追踪数据。

#### **命令 (Commands)**

-   **close**: 关闭一个流并释放相关资源。
-   **read**: 从指定的流句柄中读取一块数据。
-   **resolveBlob**: 将一个 Blob 对象的 `objectId` 解析成一个可以读取的流句柄。

#### **类型 (Types)**

-   **StreamHandle**: 一个流的唯一标识符（句柄）。

---

### 领域 (Domain): LayerTree

**介绍**: 提供与浏览器渲染层（Layer Tree）交互的能力。渲染层是页面在被绘制到屏幕前，由合成器（compositor）处理的一种中间表示。此领域对于调试复杂的动画、滚动和渲染性能问题至关重要。

#### **命令 (Commands)**

-   **compositingReasons**: 获取指定图层需要单独合成的原因。
-   **disable**: 禁用 LayerTree 领域的事件发送。
-   **enable**: 启用 LayerTree 领域的事件发送。
-   **loadSnapshot**: 从一个快照ID加载并返回一个图层树的快照。
-   **makeSnapshot**: 捕获指定图层的快照，返回一个快照ID。
-   **profileSnapshot**: 分析图层树快照的性能，返回绘制命令的耗时等信息。
-   **releaseSnapshot**: 释放一个之前捕获的图层快照。
-   **replaySnapshot**: 重放一个图层快照的绘制过程。

#### **事件 (Events)**

-   **layerPainted**: 当一个图层被重绘时触发。
-   **layerTreeDidChange**: 当图层树结构发生变化时触发。

#### **类型 (Types)**

-   **LayerId**: 图层的唯一标识符。
-   **SnapshotId**: 图层快照的唯一标识符。
-   **ScrollRect**: 描述一个可滚动区域，包含其类型（如触摸或滚轮）和矩形范围。
-   **StickyPositionConstraint**: 描述粘性定位（`position: sticky`）的约束条件。
-   **PictureTile**: 描述图层快照中的一个图块（tile）。
-   **Layer**: 描述一个渲染层，包含ID、位置、尺寸、绘制信息、滚动矩形等详细属性。
-   **PaintProfile**: 图层快照的性能分析结果，是一个绘制命令日志的数组。

---

### 领域 (Domain): Log

**介绍**: 提供收集各种浏览器内部日志条目的能力。它可以捕获来自网络、JavaScript 控制台、安全报告等不同来源的日志，是一个集中式的日志收集通道。

#### **命令 (Commands)**

-   **clear**: 清空日志缓存。
-   **disable**: 禁用 Log 领域的事件发送。
-   **enable**: 启用 Log 领域的事件发送，开始收集日志条目。
-   **startViolationsReport**: 开始报告违反特定策略（如长任务、光栅化任务过长）的日志。
-   **stopViolationsReport**: 停止报告违反策略的日志。

#### **事件 (Events)**

-   **entryAdded**: 当有新的日志条目被添加时触发。

#### **类型 (Types)**

-   **LogEntry**: 描述一条日志条目，包含来源、级别、文本、时间戳、堆栈跟踪等信息。
-   **ViolationSetting**: 描述一个违反报告的设置，包含违规名称和阈值。

---

### 领域 (Domain): Memory

**介绍**: 提供对浏览器内存的通用检查能力，超越了 V8 的 JavaScript 堆。它可以获取浏览器进程的总内存使用情况、触发GC，并模拟内存压力通知，用于全面评估应用的内存健康状况。

#### **命令 (Commands)**

-   **forciblyPurgeJavaScriptMemory**: 强制尽可能地清除 JavaScript 虚拟机（V8）的内存。
-   **getBrowserSamplingProfile**: 获取浏览器级别的内存采样剖面。
-   **getDOMCounters**: 获取 DOM 节点、事件监听器等相关对象的计数。
-   **getSamplingProfile**: 获取渲染器进程的内存采样剖面。
-   **prepareForLeakDetection**: 准备进行内存泄漏检测，使后续的`getDOMCounters`结果更准确。
-   **setPressureNotificationsSuppressed**: 抑制或允许浏览器发送内存压力通知。
-   **simulatePressureNotification**: 模拟一个内存压力通知，用于测试应用的响应。
-   **startSampling**: 开始以采样方式记录内存分配。
-   **stopSampling**: 停止内存采样并返回剖面数据。

#### **类型 (Types)**

-   **PressureLevel**: 内存压力级别，`moderate` (中等) 或 `critical` (严重)。
-   **SamplingProfileNode**: 内存采样剖面中的一个节点，描述了分配的大小和来源。
-   **SamplingProfile**: 完整的内存采样剖面。
-   **Module**: 描述一个内存模块（如可执行文件或库）。

