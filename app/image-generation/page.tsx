"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { StepContext } from "../components/context/StepContextProvider";
import {
  Upload,
  message,
  Input,
  Button,
  Select,
  Form,
  Spin,
  Space,
  Image,
} from "antd";
import {
  InboxOutlined,
  DownloadOutlined,
  LeftOutlined,
  RightOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { generateStyledImages } from "../actions/generate-styled-images";
import Spinner from "../components/ui/Spinner";

const { Dragger } = Upload;
const { Option } = Select;

export default function ImageGenerationPage() {
  const {
    setCurrentStep,
    prev,
    next,
    setImages,
    selectedVoice,
    selectedScript,
  } = useContext(StepContext);
  const router = useRouter();

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [promptError, setPromptError] = useState("");
  const [styleCount, setStyleCount] = useState(5);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewCurrent, setPreviewCurrent] = useState(0);

  useEffect(() => {
    console.log("=========== in image generation =============");
    console.log(selectedVoice);
    console.log(selectedScript);
    setCurrentStep(2);
  }, [setCurrentStep]);

  const handleUploadChange = (info: any) => {
    console.log("Upload event:", info);
    const file = info.file.originFileObj || info.file;
    if (file) {
      setUploadedFile(file);
      message.success(`${file.name} selected.`);
      console.log("File selected:", file);
    } else {
      console.error("No file found in event:", info);
    }
  };

  const handleGenerateStyles = async () => {
    // Validate custom prompt field
    if (!customPrompt.trim()) {
      setPromptError("Please fill in the custom prompt input field.");
      return;
    } else {
      setPromptError("");
    }

    console.log("Starting image generation...");
    console.log("Uploaded file:", uploadedFile);

    if (!uploadedFile) {
      message.error("Please upload an image first.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("prompt", customPrompt);
      formData.append("styleCount", styleCount.toString());
      const images = await generateStyledImages(formData);
      console.log("Received images:", images);
      setGeneratedImages(images);
    } catch (error) {
      console.error("Error generating styled images:", error);
      message.error("Failed to generate styled images.");
    } finally {
      setLoading(false);
    }
  };

  const onDownload = () => {
    if (!generatedImages[previewCurrent]) {
      message.error("No image available for download.");
      return;
    }
    const url = generatedImages[previewCurrent];
    const suffix = url.slice(url.lastIndexOf("."));
    const filename = Date.now() + suffix;

    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(blobUrl);
        link.remove();
      })
      .catch((err) => {
        console.error("Error downloading image:", err);
        message.error("Download failed.");
      });
  };

  return (
    <div className="max-w-4xl mx-auto ">
      <h1 className="text-3xl font-bold mb-4 ">
        Image Generation &amp; Styling
      </h1>
      <p className="mb-6">
        Upload an image to serve as the base for your video visuals. Choose a
        custom prompt and select the number of visual styles to generate.
      </p>

      {loading && <Spinner />}

      <Form layout="vertical" className="mb-6">
        <Form.Item>
          <Dragger
            beforeUpload={() => false}
            multiple={false}
            onChange={handleUploadChange}
            showUploadList={false}
            className="mb-4"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single upload. Do not upload sensitive or prohibited
              files.
            </p>
          </Dragger>
        </Form.Item>
        <Form.Item label="Custom Prompt" required>
          <Input
            placeholder="Enter a custom prompt for image styling"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
          />
          {promptError && (
            <div
              className="ant-form-explain"
              style={{ color: "red", marginTop: "5px" }}
            >
              {promptError}
            </div>
          )}
        </Form.Item>
        <Form.Item label="Number of Visual Styles">
          <Select
            defaultValue={5}
            onChange={(value) => setStyleCount(value)}
            style={{ width: 120 }}
          >
            <Option value={5}>5</Option>
            <Option value={10}>10</Option>
            <Option value={15}>15</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={handleGenerateStyles}
            disabled={!uploadedFile || loading}
          >
            Generate Images
          </Button>
        </Form.Item>
      </Form>

      {generatedImages.length > 0 && (
        <div className="mb-6">
          <Image.PreviewGroup
            preview={{
              toolbarRender: (
                _,
                {
                  transform: { scale },
                  actions: {
                    onActive,
                    onFlipY,
                    onFlipX,
                    onRotateLeft,
                    onRotateRight,
                    onZoomOut,
                    onZoomIn,
                    onReset,
                  },
                }
              ) => (
                <Space size={12} className="toolbar-wrapper">
                  <LeftOutlined onClick={() => onActive?.(-1)} />
                  <RightOutlined onClick={() => onActive?.(1)} />
                  <DownloadOutlined onClick={onDownload} />
                  <SwapOutlined rotate={90} onClick={onFlipY} />
                  <SwapOutlined onClick={onFlipX} />
                  <RotateLeftOutlined onClick={onRotateLeft} />
                  <RotateRightOutlined onClick={onRotateRight} />
                  <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                  <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
                  <UndoOutlined onClick={onReset} />
                </Space>
              ),
              onChange: (index) => setPreviewCurrent(index),
            }}
          >
            {generatedImages.map((url) => (
              <Image key={url} src={url} width={100} />
            ))}
          </Image.PreviewGroup>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => {
            prev();
            router.push("/audio-generation");
          }}
          className="rounded bg-gray-500 hover:bg-gray-600 px-4 py-2"
        >
          Previous
        </button>
        <button
          onClick={() => {
            setImages(generatedImages);
            next();
            router.push("/video-generation");
          }}
          disabled={generatedImages.length === 0}
          className={`rounded bg-blue-500 hover:bg-blue-600 px-4 py-2 ${
            generatedImages.length === 0 && "opacity-50 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
