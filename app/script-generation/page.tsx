"use client";

import { useState, useEffect, useContext } from "react";
import { Form, Input, InputNumber, List, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { StepContext } from "../components/context/StepContextProvider";
import { useRouter } from "next/navigation";
import { generateScripts } from "../actions/generate-scripts";

export default function ScriptGenerationPage() {
  const { setCurrentStep, next, setSelectedScript } = useContext(StepContext);
  const router = useRouter();
  const [scripts, setScripts] = useState<string[]>([]);
  const [selectedScripts, setSelectedScripts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCurrentStep(0);
  }, [setCurrentStep]);

  const onFinish = async (values: { query: string; count: number }) => {
    setLoading(true);
    try {
      const results = await generateScripts(values.query, values.count);
      setScripts(results);
      setSelectedScripts([]);
    } catch (error) {
      console.error("Error generating scripts:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleScriptSelection = (script: string) => {
    setSelectedScripts((prev) =>
      prev.includes(script)
        ? prev.filter((s) => s !== script)
        : [...prev, script]
    );
  };

  const handleConfirmSelection = () => {
    if (selectedScripts.length > 0) {
      setSelectedScript(selectedScripts);
      next();
      router.push("/audio-generation");
    }
  };

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-4 ">Script Generation</h1>
      <p className="mb-6">
        Insert your idea and generate a set of scripts that will be used to
        narate your video
      </p>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="query"
          label="Search for a script"
          rules={[{ required: true, message: "Please enter a search query" }]}
        >
          <Input.Search
            placeholder="Type your query here..."
            enterButton={<SearchOutlined />}
            onSearch={(value) => {
              if (value.trim()) {
                onFinish({ query: value, count: 5 });
              }
            }}
            loading={loading}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="count"
          label="Number of Scripts"
          rules={[
            { required: true, message: "Please specify the number of scripts" },
          ]}
          initialValue={5}
        >
          <InputNumber min={1} max={20} style={{ width: "100%" }} />
        </Form.Item>
      </Form>

      {scripts.length > 0 && (
        <div className="mt-4">
          <h2>Available Scripts</h2>
          <List
            bordered
            dataSource={scripts}
            renderItem={(script) => (
              <List.Item
                onClick={() => toggleScriptSelection(script)}
                className={`cursor-pointer ${
                  selectedScripts.includes(script) ? "bg-blue-200" : ""
                }`}
              >
                {script}
              </List.Item>
            )}
          />
          <Button
            type="primary"
            className="mt-4"
            onClick={handleConfirmSelection}
            disabled={selectedScripts.length === 0}
          >
            Confirm Selection
          </Button>
        </div>
      )}
    </div>
  );
}
