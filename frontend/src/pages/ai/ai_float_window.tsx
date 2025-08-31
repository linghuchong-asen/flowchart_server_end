import React, { useState, useRef } from "react";
import { AiChat, AiMessage, AiInput } from "@ant-design/x"; // antd X
import G6 from "@antv/g6";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AiFloatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 发送消息给后端
  const handleSend = async (input: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: input }]);

    const eventSource = new EventSource(`/api/ai/stream?query=${encodeURIComponent(input)}`);
    let buffer = "";

    eventSource.onmessage = (event) => {
      if (event.data === "[DONE]") {
        eventSource.close();
        setIsLoading(false);

        try {
          // 假设最后一条流包含完整 JSON
          const parsed = JSON.parse(buffer);
          renderFlowchart(parsed);
        } catch (e) {
          console.error("JSON 解析失败", e);
        }
        return;
      }

      buffer += event.data;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          // 更新最后一条
          return [
            ...prev.slice(0, -1),
            { ...last, content: last.content + event.data },
          ];
        } else {
          // 新增一条 AI 回复
          return [...prev, { role: "assistant", content: event.data }];
        }
      });
    };
  };

  // 渲染 G6 流程图
  const renderFlowchart = (json: any) => {
    const container = document.getElementById("g6-container");
    if (!container) return;

    const graph = new G6.Graph({
      container: "g6-container",
      width: 800,
      height: 600,
      layout: { type: "dagre" },
      defaultNode: { type: "rect", size: [80, 40], style: { fill: "#E6F7FF" } },
      defaultEdge: { style: { stroke: "#A3B1BF" } },
    });

    graph.data(json);
    graph.render();
  };

  return (
    <div className="fixed bottom-4 right-4 w-[400px] shadow-xl rounded-xl border bg-white">
      <AiChat>
        <div ref={chatContainerRef} className="max-h-[400px] overflow-y-auto p-3">
          {messages.map((m, idx) => (
            <AiMessage key={idx} role={m.role}>
              {m.content}
            </AiMessage>
          ))}
          {isLoading && <AiMessage role="assistant">正在生成中...</AiMessage>}
        </div>
        <AiInput
          placeholder="请输入问题..."
          onSend={handleSend}
          disabled={isLoading}
        />
      </AiChat>

      {/* G6 流程图区域 */}
      <div id="g6-container" className="mt-4 border rounded-md" />
    </div>
  );
}
