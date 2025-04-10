"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { 
  ArrowPathIcon, 
  PhotoIcon, 
  DocumentTextIcon, 
  EyeIcon, 
  CloudArrowUpIcon 
} from "@heroicons/react/24/outline";

const productTypes = [
  { id: "tshirt", name: "T-Shirt", image: "/images/tshirt.png" },
  { id: "polo", name: "Polo Shirt", image: "/images/polo.png" },
  { id: "socks", name: "Socks", image: "/images/socks.png" },
];

const fabricTypes = [
  { id: "cotton", name: "Cotton", description: "100% cotton, soft and breathable" },
  { id: "polyester", name: "Polyester", description: "Durable and quick-drying" },
  { id: "blend", name: "Cotton Blend", description: "60% cotton, 40% polyester" },
];

const designStyles = [
  { id: "minimal", name: "Minimal", description: "Clean and simple designs" },
  { id: "vintage", name: "Vintage", description: "Retro-inspired designs" },
  { id: "modern", name: "Modern", description: "Contemporary and bold designs" },
];

const patchTypes = [
  { id: "embroidered", name: "Embroidered", price: 5.99 },
  { id: "printed", name: "Printed", price: 3.99 },
  { id: "heat-pressed", name: "Heat Pressed", price: 4.99 },
];

export default function DesignPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedProduct, setSelectedProduct] = useState(productTypes[0]);
  const [selectedFabric, setSelectedFabric] = useState(fabricTypes[0]);
  const [selectedStyle, setSelectedStyle] = useState(designStyles[0]);
  const [selectedPatch, setSelectedPatch] = useState(patchTypes[0]);
  const [designName, setDesignName] = useState("");
  const [designDescription, setDesignDescription] = useState("");
  const [activeTab, setActiveTab] = useState("canvas");
  const [canvasElements, setCanvasElements] = useState<Array<{
    id: string;
    type: 'text' | 'image';
    content: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
  }>>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [previewMode, setPreviewMode] = useState(false);

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set canvas size
        canvas.width = 600;
        canvas.height = 600;
        
        // Draw initial product
        drawProduct();
      }
    }
  }, [selectedProduct]);

  // Redraw canvas when elements change
  useEffect(() => {
    drawProduct();
  }, [canvasElements, selectedProduct, selectedFabric, selectedStyle, selectedPatch]);

  const drawProduct = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw product background (placeholder)
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw product outline (placeholder)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
    
    // Draw product type text
    ctx.fillStyle = '#333';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(selectedProduct.name, canvas.width / 2, 30);
    
    // Draw fabric type
    ctx.font = '16px Arial';
    ctx.fillText(`Fabric: ${selectedFabric.name}`, canvas.width / 2, 60);
    
    // Draw design style
    ctx.fillText(`Style: ${selectedStyle.name}`, canvas.width / 2, 90);
    
    // Draw patch type
    ctx.fillText(`Patch: ${selectedPatch.name}`, canvas.width / 2, 120);
    
    // Draw canvas elements
    canvasElements.forEach(element => {
      if (element.type === 'text') {
        ctx.font = `${element.fontSize || 20}px ${element.fontFamily || 'Arial'}`;
        ctx.fillStyle = element.color || '#000';
        ctx.fillText(element.content, element.x, element.y);
      } else if (element.type === 'image') {
        // For images, we would load and draw them
        // This is a placeholder for image drawing
        ctx.fillStyle = '#ddd';
        ctx.fillRect(element.x, element.y, element.width, element.height);
        ctx.strokeStyle = '#999';
        ctx.strokeRect(element.x, element.y, element.width, element.height);
      }
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if clicked on an element
    const clickedElement = canvasElements.find(element => {
      if (element.type === 'text') {
        // Simple hit detection for text
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.font = `${element.fontSize || 20}px ${element.fontFamily || 'Arial'}`;
          const metrics = ctx.measureText(element.content);
          return (
            x >= element.x - 5 &&
            x <= element.x + metrics.width + 5 &&
            y >= element.y - 20 &&
            y <= element.y + 5
          );
        }
      } else if (element.type === 'image') {
        // Hit detection for images
        return (
          x >= element.x &&
          x <= element.x + element.width &&
          y >= element.y &&
          y <= element.y + element.height
        );
      }
      return false;
    });
    
    if (clickedElement) {
      setSelectedElement(clickedElement.id);
    } else {
      setSelectedElement(null);
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !selectedElement) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDragging(true);
    setDragStart({ x, y });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedElement) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const dx = x - dragStart.x;
    const dy = y - dragStart.y;
    
    setCanvasElements(prevElements => 
      prevElements.map(element => 
        element.id === selectedElement
          ? { ...element, x: element.x + dx, y: element.y + dy }
          : element
      )
    );
    
    setDragStart({ x, y });
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const addTextElement = () => {
    const newElement = {
      id: `text-${Date.now()}`,
      type: 'text' as const,
      content: 'Double click to edit',
      x: 300,
      y: 300,
      width: 0,
      height: 0,
      fontSize: 20,
      fontFamily: 'Arial',
      color: '#000000'
    };
    
    setCanvasElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
  };

  const addImageElement = () => {
    const newElement = {
      id: `image-${Date.now()}`,
      type: 'image' as const,
      content: 'placeholder-image',
      x: 200,
      y: 200,
      width: 100,
      height: 100
    };
    
    setCanvasElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
  };

  const handleSave = async () => {
    if (!session) {
      router.push('/auth/login');
      return;
    }
    
    // TODO: Implement save functionality
    console.log("Saving design...", {
      name: designName,
      description: designDescription,
      product: selectedProduct,
      fabric: selectedFabric,
      style: selectedStyle,
      patch: selectedPatch,
      elements: canvasElements
    });
    
    // Show success message
    alert("Design saved successfully!");
  };

  const handlePublish = async () => {
    if (!session) {
      router.push('/auth/login');
      return;
    }
    
    // TODO: Implement publish functionality
    console.log("Publishing design...", {
      name: designName,
      description: designDescription,
      product: selectedProduct,
      fabric: selectedFabric,
      style: selectedStyle,
      patch: selectedPatch,
      elements: canvasElements
    });
    
    // Show success message
    alert("Design published to your store!");
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Design Canvas */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Design Canvas
                  </h2>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={togglePreview}
                      className="flex items-center"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      {previewMode ? "Edit Mode" : "Preview"}
                    </Button>
                  </div>
                </div>
                
                <div className="relative aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                    onClick={handleCanvasClick}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                  />
                  
                  {!previewMode && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={addTextElement}
                        className="flex items-center"
                      >
                        <DocumentTextIcon className="h-4 w-4 mr-1" />
                        Add Text
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={addImageElement}
                        className="flex items-center"
                      >
                        <PhotoIcon className="h-4 w-4 mr-1" />
                        Add Image
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="design-name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Design Name
                    </label>
                    <input
                      type="text"
                      id="design-name"
                      value={designName}
                      onChange={(e) => setDesignName(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="design-description"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Description
                    </label>
                    <textarea
                      id="design-description"
                      value={designDescription}
                      onChange={(e) => setDesignDescription(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Design Options */}
            <div className="space-y-6">
              {/* Tabs */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex -mb-px">
                    {["canvas", "product", "fabric", "patches", "style"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`${
                          activeTab === tab
                            ? "border-purple-500 text-purple-600 dark:text-purple-400"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                        } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm capitalize`}
                      >
                        {tab}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-4">
                  {/* Product Type */}
                  {activeTab === "product" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Product Type
                      </h3>
                      <div className="space-y-4">
                        {productTypes.map((product) => (
                          <div
                            key={product.id}
                            className={`flex items-center p-4 rounded-lg border ${
                              selectedProduct.id === product.id
                                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                                : "border-gray-200 dark:border-gray-700"
                            }`}
                            onClick={() => setSelectedProduct(product)}
                          >
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {product.name.charAt(0)}
                              </span>
                            </div>
                            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                              {product.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fabric Type */}
                  {activeTab === "fabric" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Fabric Type
                      </h3>
                      <div className="space-y-4">
                        {fabricTypes.map((fabric) => (
                          <div
                            key={fabric.id}
                            className={`p-4 rounded-lg border ${
                              selectedFabric.id === fabric.id
                                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                                : "border-gray-200 dark:border-gray-700"
                            }`}
                            onClick={() => setSelectedFabric(fabric)}
                          >
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {fabric.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {fabric.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Patch Types */}
                  {activeTab === "patches" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Patch Types
                      </h3>
                      <div className="space-y-4">
                        {patchTypes.map((patch) => (
                          <div
                            key={patch.id}
                            className={`p-4 rounded-lg border ${
                              selectedPatch.id === patch.id
                                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                                : "border-gray-200 dark:border-gray-700"
                            }`}
                            onClick={() => setSelectedPatch(patch)}
                          >
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {patch.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              ${patch.price}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Design Style */}
                  {activeTab === "style" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Design Style
                      </h3>
                      <div className="space-y-4">
                        {designStyles.map((style) => (
                          <div
                            key={style.id}
                            className={`p-4 rounded-lg border ${
                              selectedStyle.id === style.id
                                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                                : "border-gray-200 dark:border-gray-700"
                            }`}
                            onClick={() => setSelectedStyle(style)}
                          >
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {style.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {style.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Canvas Elements */}
                  {activeTab === "canvas" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Canvas Elements
                      </h3>
                      <div className="space-y-2">
                        {canvasElements.length === 0 ? (
                          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                            No elements added yet. Use the buttons below the canvas to add text or images.
                          </p>
                        ) : (
                          canvasElements.map((element) => (
                            <div
                              key={element.id}
                              className={`p-3 rounded-lg border ${
                                selectedElement === element.id
                                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                                  : "border-gray-200 dark:border-gray-700"
                              }`}
                              onClick={() => setSelectedElement(element.id)}
                            >
                              <div className="flex items-center">
                                {element.type === 'text' ? (
                                  <DocumentTextIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                                ) : (
                                  <PhotoIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                                )}
                                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {element.type === 'text' ? element.content : 'Image'}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  <ArrowPathIcon className="h-5 w-5 mr-2" />
                  Save Design
                </Button>
                <Button
                  onClick={handlePublish}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                  Publish
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 