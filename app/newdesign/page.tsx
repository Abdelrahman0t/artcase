'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer, Group, Rect,Text,Circle  } from 'react-konva';
import { useRouter } from 'next/navigation';
import { Text as KonvaText } from "react-konva";
//import Image from 'next/image';
import * as Phones from '../createclear/phons';

import 'react-image-crop/dist/ReactCrop.css';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css'; // Import the cropperjs CSS
import styles1 from './newdesign.module.css'; // Import the CSS module
import styles from '../newui/newui.module.css'; // Import the CSS module
import style6 from "../createclear/styles6.module.css";

import Layoutt from '../newui/layout';
import Link from 'next/link'
import { setRedirectUrl, getCurrentPageUrl } from '../utils/apiUtils';
import { Check, ShoppingCart, Share2, Clock, Star } from "lucide-react"


interface SavedDesign {
    id: number;
    image_url: string;
    price: number;
    user: string;
    type: string;
    modell: string;
    stock: string;
    is_anonymous?: boolean;
}

interface UserText {
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    fontFamily: string;
    fill: string;
    fontWeight?: number;
}

interface KonvaEventObject {
    target: {
        x: () => number;
        y: () => number;
        width: () => number;
        height: () => number;
        scaleX: () => number;
        scaleY: () => number;
        position: () => { x: number; y: number };
    };
}

const stickerList = [
  'thinking-bubble-png-7.png',
  'https://www.vhv.rs/dpng/d/418-4180700_a-thinking-bubble-sticker-thinking-cloud-sticker-hd.png'
  //'https://example.com/sticker3.png',
];

const SendToCloudinary: React.FC = () => {
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null); // iPhone background image
    const [currentPhone, setCurrentPhone] = useState<any>(Phones.iphone_12);

    const [userImages, setUserImages] = useState<any[]>([]); // User uploaded image (Konva node)

    const [loading, setLoading] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<any>(null); // Track selected image node
    const transformerRef = useRef<any>(null); // Reference for the Transformer
    const stageRef = useRef<any>(null); // Reference for the Konva stage
     
        const [thex, setthex] = useState<any>(Phones.iphone_12.x)
    const [they, setthey] = useState<any>(Phones.iphone_12.y)
    const [theradius, settheradius] = useState<any>(Phones.iphone_12.radius)
    const [thewidth, setthewidth] = useState<any>(Phones.iphone_12.width)
    const [thehieght, setthehieght] = useState<any>(Phones.iphone_12.height)
    const [thecamex, setthecamex] = useState<any>(Phones.iphone_12.cameraX)
    const [thecamey, setthecamey] = useState<any>(Phones.iphone_12.cameraY)
    const [thecamewidth, setthecamewidth] = useState<any>(Phones.iphone_12.cameraWidth)
    const [thecamehieght, setthecamehieght] = useState<any>(Phones.iphone_12.cameraHeight)
    const [thecameradius, setthecameradius] = useState<any>(Phones.iphone_12.cameraRadius)
    const [thetype, setthetype] = useState<any>(Phones.iphone_12.type)
    const [themodell, setthemodell] = useState<any>(Phones.iphone_12.modell)
    const [theStock, setTheStock] = useState<boolean>(false);
    const [thePrice, setThePrice] = useState<number>(0);
    const [thebwidth, setthebwidth] = useState<any>(Phones.iphone_12.width)
    const [thebhieght, setthebhieght] = useState<any>(Phones.iphone_12.height)
    
    const [rgbValue, setRgbValue] = useState('rgba(225, 225, 225, 0.8)');
    const [rgbValue2, setRgbValue2] = useState('rgba(225, 225, 225, 0.7)');

    const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
    const [mode, setMode] = useState<'transform' | 'crop'>('transform'); 
    const [isCropMode, setIsCropMode] = useState(false); // Track if crop mode is active
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
        const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Track sidebar visibility
        const [isSidebarPhoneOpen, setIsSidebarPhoneOpen] = useState(false); // Track sidebar visibility
          const [theSavedDesign, setTheSavedDesign] = useState<SavedDesign | null>(null);
          const [openBrand, setOpenBrand] = useState<string | null>(null);
          const [searchQuery, setSearchQuery] = useState<string>("");
          const [selectedCategory, setSelectedCategory] = useState<string>("All");
          const [isLoading, setIsLoading] = useState<boolean>(false);
          const [isAssociating, setIsAssociating] = useState<boolean>(false);

    // Function to associate anonymous designs with user account
    const associateAnonymousDesigns = async () => {
        console.log('Starting association process...');
        setIsAssociating(true);
        
        try {
          const anonymousDesigns = JSON.parse(localStorage.getItem('anonymousDesigns') || '[]');
          console.log('Anonymous designs in localStorage:', anonymousDesigns);
          
          if (anonymousDesigns.length === 0) {
            console.log('No anonymous designs to associate');
            return;
          }

          const token = localStorage.getItem('token');
          if (!token) {
            console.log('No token found, skipping association');
            return;
          }

          for (const design of anonymousDesigns) {
            console.log('Associating design:', design);
            
            // Use the direct update endpoint that we know works
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/design/${design.id}/update-user/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              }
            });

            if (response.ok) {
              const result = await response.json();
              console.log('Association successful:', result);
              
              // Update the current design if it matches
              if (theSavedDesign && theSavedDesign.id === design.id) {
                console.log('Updating current design state');
                setTheSavedDesign({
                  ...theSavedDesign,
                  user: result.user,
                  is_anonymous: false
                });
              }
            } else {
              console.error('Association failed for design:', design.id);
            }
          }

          // Clear the anonymous designs from localStorage after association
          localStorage.removeItem('anonymousDesigns');
          console.log('Cleared anonymous designs from localStorage');
          
        } catch (error) {
          console.error('Error during association:', error);
        } finally {
          setIsAssociating(false);
          console.log('Association process completed');
        }
    };

    // Check for anonymous designs to associate when component mounts
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const anonymousDesigns = JSON.parse(localStorage.getItem('anonymousDesigns') || '[]');
            if (anonymousDesigns.length > 0) {
                console.log('Found anonymous designs, starting association');
                // Get the latest design for immediate display
                const latestDesign = anonymousDesigns[anonymousDesigns.length - 1];
                setTheSavedDesign({
                    ...latestDesign,
                    user: 'Anonymous',
                    is_anonymous: true
                });
                
                // Associate all anonymous designs immediately
                associateAnonymousDesigns();
            }
        }
    }, []);

    // Also check for anonymous designs when token changes (user logs in)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'token' && e.newValue) {
                const anonymousDesigns = JSON.parse(localStorage.getItem('anonymousDesigns') || '[]');
                if (anonymousDesigns.length > 0 && theSavedDesign && theSavedDesign.is_anonymous) {
                    console.log('User logged in with anonymous design, associating...');
                    associateAnonymousDesigns();
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Also check immediately when component mounts with token
        const token = localStorage.getItem('token');
        if (token) {
            const anonymousDesigns = JSON.parse(localStorage.getItem('anonymousDesigns') || '[]');
            if (anonymousDesigns.length > 0 && theSavedDesign && theSavedDesign.is_anonymous) {
                console.log('User already logged in with anonymous design, associating...');
                associateAnonymousDesigns();
            }
        }

        return () => window.removeEventListener('storage', handleStorageChange);
    }, [theSavedDesign]);

const toggleBrand = (brand: string) => {
  setOpenBrand(openBrand === brand ? null : brand);
};

const handleCategoryChange = (category: string) => {
  setSelectedCategory(category);
  // Auto-open all brands when filtering to show results immediately
  if (category !== "All") {
    setOpenBrand(null); // Reset to show all brands
  }
};

const filteredPhones = [
  {
    brand: "IPhone",
    models: [
      { name: "iPhone SE", phone: Phones.iphone_se },
      { name: "iPhone 7", phone: Phones.iphone_7 },
      { name: "iPhone 8", phone: Phones.iphone_8 },
      { name: "iPhone 12", phone: Phones.iphone_12 },
      { name: "iPhone 12 Mini", phone: Phones.iphone_12_mini },
      { name: "iPhone 12 Pro", phone: Phones.iphone_12_pro },
      { name: "iPhone 12 Pro Max", phone: Phones.iphone_12_pro_max },
      { name: "iPhone 13", phone: Phones.iphone_13 },
      { name: "iPhone 13 Mini", phone: Phones.iphone_13_mini },
      { name: "iPhone 13 Pro", phone: Phones.iphone_13_pro },
      { name: "iPhone 13 Pro Max", phone: Phones.iphone_13_pro_max },
      { name: "iPhone 14", phone: Phones.iphone_14 },
      { name: "iPhone 14 Plus", phone: Phones.iphone_14_plus },
      { name: "iPhone 14 Pro", phone: Phones.iphone_14_pro },
      { name: "iPhone 14 Pro Max", phone: Phones.iphone_14_pro_max },
    ],
  },
  {
    brand: "Samsung",
    models: [
      { name: "Samsung A34", phone: Phones.samsung_a34 },
      { name: "Samsung A54", phone: Phones.samsung_a54 },
      { name: "Samsung Galaxy Note 12", phone: Phones.samsung_galaxy_note_12 },
      { name: "Samsung Galaxy Note 8", phone: Phones.samsung_galaxy_note_8 },
      { name: "Samsung Galaxy S23", phone: Phones.samsung_galaxy_s23 },
    ],
  },
  {
    brand: "Oppo",
    models: [
      { name: "Oppo A60", phone: Phones.oppo_a60 },
      { name: "Oppo Reno 12", phone: Phones.oppo_reno_12 },
      { name: "Oppo Reno 4Z", phone: Phones.oppo_reno_4z },
      { name: "Oppo Reno 5 Lite", phone: Phones.oppo_reno_5_lite },
      { name: "Oppo Reno 6", phone: Phones.oppo_reno_6 },
    ],
  },
  {
    brand: "Redmi",
    models: [
      { name: "Redmi 13 Pro", phone: Phones.redmi_13_pro },
      { name: "Redmi A3", phone: Phones.redmi_a3 },
      { name: "Redmi Note 10", phone: Phones.redmi_note_10 },
      { name: "Redmi Note 11 Pro", phone: Phones.redmi_note_11_pro },
      { name: "Redmi Note 12", phone: Phones.redmi_note_12 },
    ],
  },
].filter(group => selectedCategory === "All" || group.brand === selectedCategory)
.map(group => ({
  ...group,
  models: group.models.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
}))
.filter(group => group.models.length > 0);

// Auto-open brands when there's a search query or specific category selected
const shouldAutoOpen = searchQuery.length > 0 || selectedCategory !== "All";

const handlePhoneSelect = async (phone: any) => {
  setIsLoading(true);
  try {
    handlebackground(phone);
    setIsSidebarPhoneOpen(false);
    // Add a small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 300));
  } finally {
    setIsLoading(false);
  }
};
        
    const [cropBox, setCropBox] = useState({
      x: 100,
      y: 100,
      width: 200,
      height: 200,
    });


    const cropperRef = useRef<any>(null);


    const [userTexts, setUserTexts] = useState<UserText[]>([]);
    const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
    const [newText, setNewText] = useState<string>("");


    
    const textTransformerRef = useRef<any>(null);
    const stickersRef = useRef<HTMLDivElement>(null);
    const fontsRef = useRef<HTMLDivElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);

      const [containerSize, setContainerSize] = useState({ width: 600, height: 600 });

  const [stickerList1, setStickerList1] = useState([
    
        'stickers/amazed_8769075.png',
        'stickers/angry_8231332.png',
        'stickers/animal-kingdom_1713780.png',
        'stickers/frog_394697.png',
        'stickers/happy-face_8769094.png',
        'stickers/hippopotamus_2881963.png',
        'stickers/koala_4597336.png',
        'stickers/penguin_5640311.png',
        'stickers/penguin_2215557.png',
        'stickers/sad_7626649.png',
        'stickers/shocked_8231328.png',
        'stickers/tongue_10516527.png',



        'stickers/social.png',
        'stickers/linkedin.png',
        'stickers/discord.png',
        'stickers/instagram.png',
        'stickers/git.png',
        'stickers/youtube.png',


        'stickers/american-football.png',
        'stickers/trophy.png',
        'stickers/surfing.png',
        'stickers/football.png',
        'stickers/dumbbell.png',
        'stickers/medal.png',
    
        'stickers/hat.png',
        'stickers/emoji.png',
        'stickers/flower.png',
        'stickers/fashion.png',
        'stickers/princess.png',
        'stickers/bow.png',





  ]);



      const router = useRouter()

      
      useEffect(() => {
        const updateStageSize = () => {
          const containerWidth = window.innerWidth * 0.9; // Adjust width as needed
          const containerHeight = window.innerHeight * 0.9; // Adjust height as needed
          const scale = Math.min(containerWidth / 600, containerHeight / 600);
    
          setContainerSize({
            width: containerWidth,
            height: containerHeight,
          });

        };
    
        window.addEventListener("resize", updateStageSize);
        updateStageSize(); // Initial call
    
        return () => window.removeEventListener("resize", updateStageSize);
      }, []);


      React.useEffect(() => {
        const handleResize = () => {
          const newWidth = Math.min(window.innerWidth, 600); // Max width 600px
          const newHeight = Math.min(window.innerHeight, 600); // Max height 600px

        };
      
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial size calculation
      
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

    const handleAddSticker = (stickerUrl: string) => {
      const img = new Image();
      img.src = stickerUrl;
    
      img.onload = () => {
        const maxWidth = 200;
        const maxHeight = 200;
        const scaleFactor = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
        img.width *= scaleFactor; // Scale width
        img.height *= scaleFactor; // Scale height
    
        setUserImages((prevImages) => [...prevImages, img]);
      };
    };

 
    const handleAddText = (customText = "ARTCASE", customFontFamily = "Arial") => {
      // Use the passed custom text and font family or default to existing values
      const newTextObject: UserText = {
        id: Date.now().toString(), // Unique ID
        text: customText.trim(), // Use provided text
        x: (thewidth + 250) / 2, // Default position for x
        y: (thehieght ) / 2, // Default position for y
        fontSize: 30, // Default font size
        fontFamily: customFontFamily, // Use provided font family
        fill: "black", // Default color
      };
    
      setUserTexts([...userTexts, newTextObject]); // Add new text to the state
    };
    
    // Handle text selection
    const handleSelectText = (id: string) => {
        const textNode = stageRef.current?.findOne(`#text-${id}`);
        if (textNode) {
            textNode.moveToTop();
        }
        setSelectedTextId(id);
        setSelectedImage(null);
        if (selectedTextId === id) {
            setSelectedTextId(null);
        } else {
            setSelectedTextId(id);
        }
    };
  
    // Update text properties
    const handleTextChange = (key: keyof UserText, value: string | number) => {
        setUserTexts((prevTexts) =>
            prevTexts.map((text) =>
                text.id === selectedTextId ? { ...text, [key]: value } : text
            )
        );
    };
  
    // Get the selected text object
    const selectedText = userTexts.find((text) => text.id === selectedTextId);




    const handleColorChange = (e : any) => {
        const hex = e.target.value; // Get hex value
        setRgbValue(hexToRgba(hex, 0.7)); // Convert to RGBA and set state
        setRgbValue2(hexToRgba(hex, 0.7 / 1.5));
      };
    
      const hexToRgba = (hex : any, alpha : any) => {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      };

      const handleEyeDropperClick = async () => {
        if ('EyeDropper' in window) {
          try {
            const eyeDropper = new (window as any).EyeDropper();
            const result = await eyeDropper.open(); // Open the EyeDropper tool
            const hexColor = result.sRGBHex; // Get selected color
    
            // Set full opacity for the selected color
            setRgbValue(hexToRgba(hexColor, 1)); // Full opacity for color
            setRgbValue2(hexToRgba(hexColor, 0.7 / 1.5)); // Full opacity for second state
    
            console.log('Color selected via EyeDropper:', hexColor);
          } catch (error) {
            console.error('EyeDropper canceled or failed:', error);
          }
        } else {
          console.error('EyeDropper API not supported in this browser.');
        }
      };


    useEffect(() => {
        if (currentPhone && currentPhone.url) {
            const loadBgImage = new Image();
            loadBgImage.src = currentPhone.url;  // This should not be undefined
            loadBgImage.onload = () => setBgImage(loadBgImage);
        } else {
            console.error('currentPhone.url is undefined');
        }
    }, [currentPhone]);

    
const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
        Array.from(files).forEach((file) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const maxWidth = 200;
                const maxHeight = 200;
                const scaleFactor = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
                img.width *= scaleFactor;
                img.height *= scaleFactor;

                // Add new image to the state
                setUserImages((prevImages) => [...prevImages, img]);
                
                
            };
        });
        event.target.value = "";
    }
};

const handleSelect = (e: any) => {
  setSelectedTextId(null)
  const image = e.target;

  const selectedNode = e.target;

  // Move the selected image to the top of its layer
  selectedNode.moveToTop();

  setSelectedImage(selectedNode); // Update selected image state


  if (selectedImage === image) {
      setSelectedImage(null); // Deselect if the same image is clicked
      if (transformerRef.current) {
          transformerRef.current.nodes([]); // Detach transformer
      }
  } else {
      setSelectedImage(image); // Select the new image
      if (transformerRef.current) {
          transformerRef.current.nodes([image]); // Attach transformer to the selected image
      }
  }
};


    const handleDeleteImage = () => {
        if (selectedImage) {
            setUserImages((prevImages) => {
                return prevImages.filter(image => image !== selectedImage);
            });
            if (transformerRef.current) {
                transformerRef.current.nodes([]);
            }
            selectedImage.destroy();
            setSelectedImage(null);
        }

        if (selectedText && textTransformerRef.current) {
            setUserTexts((prevTexts) =>
                prevTexts.filter((text) => text.id !== selectedText.id)
            );
            textTransformerRef.current.nodes([]);
        }
    };

      const handleInvertImage = () => {
        if (selectedImage) {
          const currentScaleX = selectedImage.scaleX();
          selectedImage.scaleX(-currentScaleX); // Invert the current scaleX
          selectedImage.getLayer()?.batchDraw(); // Re-render the layer
        }
      };


      const handleMoveImageToTopRight = () => {
        if (!selectedImage) return; // Ensure an image is selected
    
        const phoneRightEdge = thex + thewidth; // Right edge of the phone
        const phoneTopEdge = they;             // Top edge of the phone
        const padding = 10;                    // Optional padding from edges
    
        // Update the position of the selected image
        selectedImage.setAttrs({
            x: phoneRightEdge - selectedImage.width() * selectedImage.scaleX() - padding,
            y: phoneTopEdge + padding,
        });
    
        // Redraw the stage to reflect changes
        stageRef.current?.batchDraw();
    };
    const handleMoveImageToBottomLeft = () => {
      if (!selectedImage) return; // Ensure an image is selected
  

      const phoneLeftEdge = thex;
      const phoneBottomEdge = they + thehieght;
      const padding = 10;
  
      selectedImage.setAttrs({
          x: phoneLeftEdge + padding,
          y: phoneBottomEdge - selectedImage.height() * selectedImage.scaleY() - padding,
      });
  
  
      // Redraw the stage to reflect changes
      stageRef.current?.batchDraw();
  };


  const handleMoveImageToBottomRight = () => {
    if (!selectedImage) return; // Ensure an image is selected

    const phoneRightEdge = thex + thewidth;
    const phoneBottomEdge = they + thehieght;
    const padding = 10;

    selectedImage.setAttrs({
        x: phoneRightEdge - selectedImage.width() * selectedImage.scaleX() - padding,
        y: phoneBottomEdge - selectedImage.height() * selectedImage.scaleY() - padding,
    });



    // Redraw the stage to reflect changes
    stageRef.current?.batchDraw();
};

      const toggleMode = () => {
        setMode((prevMode) => (prevMode === 'transform' ? 'crop' : 'transform'));
        setIsCropMode((prev) => !prev);
      };
    
      // Handle cropping action
     const handlePrepareForCrop = (file: File) => {
    const blobUrl = URL.createObjectURL(file); // Create Blob URL for the file
    setSelectedImage(blobUrl);
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
  
      if (croppedCanvas) {
        // Get the dimensions of the background image (bgImage)
        const bgWidth = 200;
        const bgHeight = 200;
  
        // Get the original dimensions of the cropped canvas
        const croppedWidth = croppedCanvas.width;
        const croppedHeight = croppedCanvas.height;
  
        // Calculate scale factor to fit the cropped image inside the background
        const scaleFactor = Math.min(bgWidth / croppedWidth, bgHeight / croppedHeight, 1);
  
        // Resize the cropped canvas to fit within the background dimensions
        const scaledWidth = croppedWidth * scaleFactor;
        const scaledHeight = croppedHeight * scaleFactor;
  
        // Create a new image element for the cropped and resized image
        const croppedImg = new window.Image();
        croppedImg.src = croppedCanvas.toDataURL();
  
        croppedImg.onload = () => {
          // Set the new width and height for the cropped image
          croppedImg.width = scaledWidth;
          croppedImg.height = scaledHeight;
  
          // Replace the selected image with the cropped image (resized)
          setUserImages((prevImages) =>
            prevImages.map((img) =>
              img === selectedImage.attrs.image
                ? croppedImg // Replace the selected image with the cropped and resized image
                : img
            )
          );
  
          // Exit crop mode and deselect the image
          setIsCropMode(false);
          setSelectedImage(null);
        };
      }
    }
  };
  






   





    const handleSendToCloudinary = async () => {
        if (!stageRef.current) return;
    
        // Deselect the image to hide the transformer
        setSelectedImage(null);
        setSelectedTextId(null)
    
        // Allow time for deselection to render
        await new Promise(resolve => setTimeout(resolve, 100));
    
        // Capture only the area inside the phone body
        const phoneCropArea = {
            x: thex, // `thex` is the phone's X position
            y: they, // `they` is the phone's Y position
            width: thewidth, // Width of the phone
            height: thehieght, // Height of the phone
        };
    
        // Get cropped image data from the stage
        const dataURL = stageRef.current.toDataURL({

            pixelRatio: 1,
            mimeType: "image/png",
            width: 600,
            height: 600,
        });
    
        // Convert the Data URL to an image
        const image = new Image();
        image.src = dataURL;
        await new Promise(resolve => (image.onload = resolve));
    
        // Create a canvas to modify the image
        const canvas = document.createElement("canvas");
        canvas.width = 600; // Adjust for pixelRatio
        canvas.height = 600;
        const ctx = canvas.getContext("2d");
    
        if (!ctx) {
            console.error("Canvas not supported");
            return;
        }
    
        // Draw the image onto the canvas
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
        // Get image data and make white areas transparent
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
    
        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];     // Red
            const g = pixels[i + 1]; // Green
            const b = pixels[i + 2]; // Blue
    
            // Check if the pixel is close to white
            if ( r > 250 && g > 250 && b > 250) {
                pixels[i + 3] = 0; // Set alpha to 0 (transparent)
            }
        }
    
        // Update the canvas with the modified data
        ctx.putImageData(imageData, 0, 0);
    
        // Convert the canvas to a Blob
        const modifiedDataURL = canvas.toDataURL("image/png");
        const blob = dataURLtoBlob(modifiedDataURL);
    
        // Prepare the data for Cloudinary
        const formData = new FormData();
        formData.append("file", blob);
        formData.append("upload_preset", "ml_default"); // Replace with your actual preset
    
        setLoading(true);
    
        try {
            // Upload to Cloudinary first
            const cloudinaryResponse = await fetch("https://api.cloudinary.com/v1_1/daalfrqob/image/upload", {
                method: "POST",
                body: formData,
            });
    
            if (!cloudinaryResponse.ok) {
                const errorData = await cloudinaryResponse.json();
                console.error("Failed to upload to Cloudinary:", errorData);
                return;
            }
    
            const result = await cloudinaryResponse.json();
            console.log("Design uploaded successfully:", result);
    
            // Get product data for price and stock
            let dbStock = false; // Default to false (out of stock)
            let dbPrice = 30.00; // Default price
            
            const token = localStorage.getItem('token');
            
            // Fetch product data regardless of authentication status
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/phone-products/`);
                if (response.ok) {
                    const products = await response.json();
                    const product = products.find((p: any) => p.modell === themodell && p.type === thetype);
                    
                    if (product) {
                        dbStock = product.stock;
                        dbPrice = product.price;
                    }
                }
            } catch (error) {
                console.error("Error fetching product data:", error);
            }

            // Check if user is authenticated
            if (token) {
                // User is logged in - save to backend with user association
                const djangoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/designs/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        image_url: result.secure_url,
                        position: { x: 0, y: 0 }, // Example position
                        stock: dbStock,
                        modell: themodell, 
                        type: thetype,
                        sku: 'none',
                        price: dbPrice
                    }),
                });
    
                if (!djangoResponse.ok) {
                    const error = await djangoResponse.text();
                    console.error("Error saving to Django API:", error);
                    return;
                }
                 
                const savedDesign = await djangoResponse.json();
                console.log("Design saved successfully:", savedDesign);

                // Fetch the complete design data
                let callid = savedDesign.id;
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/design/${callid}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        console.log('Fetched Design:', data.price);
                        setTheSavedDesign({
                            ...data,
                            is_anonymous: data.is_anonymous === true
                        });
                    } else {
                        console.error('Failed to fetch design data');
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                // User is not logged in - create anonymous design
                const anonymousResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/designs/anonymous/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        image_url: result.secure_url,
                        stock: dbStock,
                        modell: themodell, 
                        type: thetype,
                        sku: 'none',
                        price: dbPrice
                    }),
                });
    
                if (!anonymousResponse.ok) {
                    const error = await anonymousResponse.text();
                    console.error("Error saving anonymous design:", error);
                    return;
                }
                 
                const savedDesign = await anonymousResponse.json();
                console.log("Anonymous design saved successfully:", savedDesign);

                // Store the anonymous design in localStorage for later association
                const anonymousDesigns = JSON.parse(localStorage.getItem('anonymousDesigns') || '[]');
                anonymousDesigns.push({
                    id: savedDesign.id,
                    temp_id: savedDesign.temp_id,
                    image_url: savedDesign.image_url,
                    price: savedDesign.price,
                    type: savedDesign.type,
                    modell: savedDesign.modell,
                    stock: savedDesign.stock,
                    created_at: new Date().toISOString(),
                    is_anonymous: savedDesign.is_anonymous
                });
                localStorage.setItem('anonymousDesigns', JSON.stringify(anonymousDesigns));

                // Set the saved design for display
                setTheSavedDesign({
                    ...savedDesign,
                    user: 'Anonymous',
                    is_anonymous: savedDesign.is_anonymous
                });
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };
    
    

// Helper function to convert dataURL to Blob
const dataURLtoBlob = (dataURL: string) => {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) { 
        uintArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([uintArray], { type: mimeString });
};

const addToCart = async (designId : any) => {
  if (!theSavedDesign) {
    alert("Design not found!");
    return;
  }

  // Check if item is out of stock
  if (theSavedDesign.stock === 'Out of Stock') {
    alert("Sorry, this item is currently out of stock and cannot be added to cart.");
    return;
  }

  const token = localStorage.getItem('token');
  
  if (!token) {
    // User is not logged in, redirect to login with current URL
    setRedirectUrl(getCurrentPageUrl());
    window.location.href = '/login';
    return;
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/add/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ design_id: designId }),
  });

  if (response.ok) {
    alert('Item added to cart!');
    router.push('/');
  } else {
    const data = await response.json();
    alert(data.error);
  }
};


const handlebackground = (phone: any) => {
    if (phone && phone.url) {
        setCurrentPhone(phone);  // This will set the correct phone object
        
        // Set the individual properties
        setthex(phone.x);
        setthey(phone.y);
        settheradius(phone.radius);
        setthewidth(phone.width);
        setthehieght(phone.height);
        setthecamex(phone.cameraX);
        setthecamey(phone.cameraY);
        setthecamewidth(phone.cameraWidth);
        setthecamehieght(phone.cameraHeight);
        setthecameradius(phone.cameraRadius);
        setTheStock(phone.stock)
        
        setthemodell(phone.modell)
        setThePrice(phone.price)


      

        
    } else {
        console.error("Phone object does not have a valid URL:", phone);
    }
};
    


const handleIncreaseImageSize = () => {
  if (selectedImage) {
    const imageNode = selectedImage;
    const newWidth = imageNode.width() * 1.2; // Increase width by 20%
    const newHeight = imageNode.height() * 1.2; // Increase height by 20%
    imageNode.width(newWidth);
    imageNode.height(newHeight);
    imageNode.getLayer().batchDraw(); // Redraw layer
  }
};


const handleDecreaseImageSize = () => {
  if (selectedImage) {
    const imageNode = selectedImage;
    const newWidth = imageNode.width() * 0.8; // Decrease width by 20%
    const newHeight = imageNode.height() * 0.8; // Decrease height by 20%
    imageNode.width(newWidth);
    imageNode.height(newHeight);
    imageNode.getLayer().batchDraw(); // Redraw layer
  }
};


if(theSavedDesign){
  const token = localStorage.getItem('token');
  const isAnonymous = theSavedDesign.is_anonymous === true;
  
  // Debug logging
  console.log('Design state:', {
    token: !!token,
    isAnonymous,
    user: theSavedDesign.user,
    is_anonymous: theSavedDesign.is_anonymous,
    isAssociating,
    fullDesignData: theSavedDesign
  });
  
  return (
    <Layoutt>
    <div className={styles1.savedcontainer}>
      <div className={styles1.previewCard}>
        <div className={styles1.imageSection}>
          <div className={styles1.trendingBadge}>
            <svg className={styles1.starIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Trending
          </div>
          
          <div className={styles1.imageContainer}>
            <img 
              src={theSavedDesign.image_url} 
              alt="phone case design" 
              className={styles1.designImage}
            />
          </div>
          
          <div className={styles1.customMadeLabel}>Custom Made</div>
          <div className={styles1.priceLabel}>${theSavedDesign.price}</div>
        </div>

        <div className={styles1.detailsSection}>
          <div className={styles1.header}>
            <h1 className={styles1.title}>Design Preview</h1>
          </div>

          <div className={styles1.productInfo}>
            <div className={styles1.priceSection}>
              <span className={styles1.priceText}>Price</span>
              <span className={styles1.price}>${theSavedDesign.price}</span>
            </div>

            <div className={styles1.infoGrid}>
              <div className={styles1.infoItem}>
                <span className={styles1.label}>Created By</span>
                <span className={styles1.value}>{theSavedDesign.user}</span>
              </div>
              <div className={styles1.infoItem}>
                <span className={styles1.label}>Type</span>
                <span className={styles1.value}>{theSavedDesign.type}</span>
              </div>
              <div className={styles1.infoItem}>
                <span className={styles1.label}>Model</span>
                <span className={styles1.value}>{theSavedDesign.modell}</span>
              </div>
              <div className={styles1.infoItem}>
                <span className={styles1.label}>Product ID</span>
                <span className={styles1.value}>#{theSavedDesign.id}</span>
              </div>
            </div>

            <div className={styles1.statusSection}>
              <span className={styles1.label}>Status</span>
              <div className={`${styles1.statusBadge} ${theSavedDesign.stock == "In Stock" ? styles1.statusBadge : styles1.outofStockBadge}`}>
                <svg className={styles1.statusIcon} viewBox="0 0 24 24" fill="currentColor">
                  {theSavedDesign.stock == "In Stock" ? (
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  ) : (
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  )}
                </svg>
                {theSavedDesign.stock == "In Stock" ? "In Stock" : "Out of Stock"}
              </div>
            </div>

            {/* Status Alert */}
            {isAnonymous && (
              <div className={styles1.anonymousAlert}>
                <div className={styles1.alertIcon}>
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '12px', height: '12px'}}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div className={styles1.alertContent}>
                  <div className={styles1.alertTitle}>Anonymous Design</div>
                  <div className={styles1.alertText}>
                    This design was created without an account. To post it or add it to your cart, you'll need to log in first.
                  </div>
                </div>
              </div>
            )}
            {isAssociating && (
              <div className={styles1.successAlert}>
                <div className={styles1.alertIcon}>
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '12px', height: '12px'}}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div className={styles1.alertContent}>
                  <div className={styles1.alertTitle}>Associating Design...</div>
                  <div className={styles1.alertText}>
                    Your design is being associated with your account. Please wait...
                  </div>
                </div>
              </div>
            )}
            {!isAnonymous && !isAssociating && token && (
              <div className={styles1.successAlert}>
                <div className={styles1.alertIcon}>
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '12px', height: '12px'}}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div className={styles1.alertContent}>
                  <div className={styles1.alertTitle}>Design Associated!</div>
                  <div className={styles1.alertText}>
                    Your design is now associated with your account. You can post it or add it to your cart.
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className={styles1.actionButtons}>
              {token && !isAnonymous && !isAssociating ? (
                <>
                  <Link style={{textDecoration: "none"}} href={`/makepost/${theSavedDesign.id}`}>
                    <button className={styles1.primaryButton}>
                    <Share2 className={styles1.buttonIcon} />
                      Post Design
                    </button>
                  </Link>
                  <button
                    className={styles1.secondaryButton}
                    onClick={() => addToCart(theSavedDesign.id)}
                  >
                    <svg className={styles1.buttonIcon} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                    Add to Cart
                  </button>
                </>
              ) : isAnonymous && !isAssociating ? (
                <>
                  <button
                    className={styles1.primaryButton}
                    onClick={() => {
                      setRedirectUrl(getCurrentPageUrl());
                      window.location.href = '/login';
                    }}
                  >
                    <svg className={styles1.buttonIcon} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
                    </svg>
                    Login to Post
                  </button>
                  <button
                    className={styles1.secondaryButton}
                    onClick={() => addToCart(theSavedDesign.id)}
                  >
                    <svg className={styles1.buttonIcon} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                    Add to Cart
                  </button>
                </>
              ) : isAssociating ? (
                <button className={styles1.primaryButton} disabled>
                  <svg className={styles1.buttonIcon} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Associating...
                </button>
              ) : (
                <button className={styles1.primaryButton} disabled>
                  <svg className={styles1.buttonIcon} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Design belongs to another user
                </button>
              )}
            </div>

            <Link style={{textDecoration: "none"}} href="/">
              <button className={styles1.laterButton}>
                <svg className={styles1.laterIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
                Leave for now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
    </Layoutt>
  );
}

    return (
        <div className={styles1.container}>
           

            
   <div className={styles1.controlhead}>
  

  <div className={styles1.colorcont}>
<span>Select You Color</span>

<input 
type="color"
onChange={handleColorChange} />

<button className="headerActionBtn" onClick={handleEyeDropperClick}>
<i className="fa-solid fa-eye-dropper"></i>
<span>Eye Dropper</span>
</button>

</div>



{selectedImage && !isCropMode && (
  <div className={styles1.imgbtns}>
      <button className="headerActionBtn"
          onClick={() => {
              setIsCropMode(true);
              setCropImageSrc(selectedImage.attrs.image.src);
          }}
      >
          <i className="fa-solid fa-crop"></i>
   <span>Crop</span>

      </button>
      <button className="headerActionBtn" onClick={handleInvertImage}>
   <i className="fa-solid fa-arrows-left-right"></i>
   <span>Flip</span>
  </button>

      <button className="headerActionBtn" onClick={handleMoveImageToTopRight} >
      <i
    className="fa-solid fa-arrow-up-right-from-square"
    style={{ transform: 'rotate(0deg)' }}
  ></i>
   <span>top right</span>

      </button>

      <button className="headerActionBtn" onClick={handleMoveImageToBottomRight}>
      <i
    className="fa-solid fa-arrow-up-right-from-square"
    style={{ transform: 'rotate(90deg)' }}
  ></i>
   <span>bottom right</span>

      </button>
    <button className="headerActionBtn" onClick={handleMoveImageToBottomLeft}>
    <i
    className="fa-solid fa-arrow-up-right-from-square"
    style={{ transform: 'rotate(180deg)' }}
  ></i>
   <span>bottom left</span>

   </button>


        <button
        className="headerActionBtn"
        onClick={handleIncreaseImageSize}

      >
        <i className="fa-solid fa-expand"></i>
        <span>Size Up</span>
      </button>
              <button
        className="headerActionBtn"
        onClick={handleDecreaseImageSize }

      >
        <i className="fa-solid fa-compress"></i>
        <span>Size down</span>
        </button>
        <button className="headerActionBtn" onClick={handleDeleteImage}>
      <i style={{color : "red"}} className="fa-solid fa-trash"></i>
        <span style={{color : "red"}}>Delete</span>
        </button>
  </div>
)}

{/*  className="star-input"*/}
{selectedText && (
  <div className={styles1.textbtns} >

    <div className={styles1.edittext}>
      
    <input
      type="text"
      value={selectedText.text}
      onChange={(e) => handleTextChange("text", e.target.value)}
      placeholder="Edit selected text"
      className={styles1.edittextinput}
    />
    <span >type your text here :</span>
</div>
    {/* Font Size Counter */}
    <div className={styles1.edittextnum}>

      <input
        type="number"
        value={selectedText.fontSize || 30}
        onChange={(e) =>
          handleTextChange("fontSize", Math.max(10, Number(e.target.value)))
        }
        min={10}

      />
       <span>font size</span>
    </div>

    {/* Font Weight Counter */}
    <div className={styles1.edittextnum}>

      <input
        type="number"
        value={selectedText.fontWeight || 400}
        onChange={(e) =>
          handleTextChange("fontWeight", Math.min(900, Math.max(100, Number(e.target.value))))
        }
        min={100}
        max={900}
        step={100}

      />
       <span>font Weight</span>

    </div>
    <div className={styles1.edittextnum}>
    <input
      type="color"
      value={selectedText.fill}
      onChange={(e) => handleTextChange("fill", e.target.value)}
    />
    <span>font Color</span>
    </div>
    <button className="headerActionBtn" onClick={handleDeleteImage}>
      <i className="fa-solid fa-trash"></i>
      <span style={{ color: "red" }}>Delete</span>
    </button>
  </div>
)}

</div>


<div className={`${style6.phoneSelectorWrapper} ${isSidebarPhoneOpen ? style6.open2 : ""}`}>
    {/* Phone Categories */}
    <div className={styles1.phoneCategoriesHeader}>
        <h2>Phone Models</h2>
        
        {/* Search Bar */}
        <div className={styles1.searchContainer}>
            <div className={styles1.searchInputWrapper}>
                <i className="fa-solid fa-search"></i>
                <input
                    type="text"
                    placeholder="Search phones..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles1.searchInput}
                />
                {searchQuery && (
                    <button 
                        onClick={() => setSearchQuery("")}
                        className={styles1.clearSearch}
                    >
                        <i className="fa-solid fa-times"></i>
                    </button>
                )}
            </div>
        </div>

        <div className={styles1.categoryTabs}>
            <button 
                className={`${styles1.categoryTab} ${selectedCategory === "All" ? styles1.active : ""}`}
                onClick={() => handleCategoryChange("All")}
            >
                All
                <span className={styles1.categoryCount}>
                    {filteredPhones.reduce((total, group) => total + group.models.length, 0)}
                </span>
            </button>
            <button 
                className={`${styles1.categoryTab} ${selectedCategory === "IPhone" ? styles1.active : ""}`}
                onClick={() => handleCategoryChange("IPhone")}
            >
                iPhone
                <span className={styles1.categoryCount}>
                    {filteredPhones.find(g => g.brand === "IPhone")?.models.length || 0}
                </span>
            </button>
            <button 
                className={`${styles1.categoryTab} ${selectedCategory === "Samsung" ? styles1.active : ""}`}
                onClick={() => handleCategoryChange("Samsung")}
            >
                Samsung
                <span className={styles1.categoryCount}>
                    {filteredPhones.find(g => g.brand === "Samsung")?.models.length || 0}
                </span>
            </button>
            <button 
                className={`${styles1.categoryTab} ${selectedCategory === "Oppo" ? styles1.active : ""}`}
                onClick={() => handleCategoryChange("Oppo")}
            >
                Oppo
                <span className={styles1.categoryCount}>
                    {filteredPhones.find(g => g.brand === "Oppo")?.models.length || 0}
                </span>
            </button>
            <button 
                className={`${styles1.categoryTab} ${selectedCategory === "Redmi" ? styles1.active : ""}`}
                onClick={() => handleCategoryChange("Redmi")}
            >
                Redmi
                <span className={styles1.categoryCount}>
                    {filteredPhones.find(g => g.brand === "Redmi")?.models.length || 0}
                </span>
            </button>
        </div>
    </div>

    {/* Rubber Case Designer Link - Integrated Design */}
    <div className={styles1.rubberDesignerSection}>
        <div className={styles1.rubberDesignerContent}>
            <div className={styles1.rubberDesignerIcon}>
                <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div className={styles1.rubberDesignerText}>
                <h3>Rubber Case Designer</h3>
                <p>Switch to our specialized rubber case creator for durable, protective cases</p>
            </div>
            <Link href="/createrubber" className={styles1.rubberDesignerBtn}>
                <span>Open Rubber Designer</span>
                <i className="fa-solid fa-external-link-alt"></i>
            </Link>
        </div>
    </div>

    {/* Loading Overlay */}
    {isLoading && (
        <div className={styles1.loadingOverlay}>
            <div className={styles1.loadingSpinner}>
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>Loading...</span>
            </div>
        </div>
    )}

    {/* No Results Message */}
    {filteredPhones.length === 0 && (
        <div className={styles1.noResults}>
            <i className="fa-solid fa-search"></i>
            <h3>No phones found</h3>
            <p>Try adjusting your search or category filter</p>
        </div>
    )}

    {/* Show brand sections only when NOT searching or filtering */}
    {!shouldAutoOpen && filteredPhones.map((group, index) => (
      <div key={index} className={styles1.brandSection}>
        <h3 className={styles1.brandTitle} onClick={() => toggleBrand(group.brand)}>
          <i className={`fa-brands fa-${group.brand.toLowerCase() === 'iphone' ? 'apple' : group.brand.toLowerCase()}`}></i>
          {group.brand}
          <i className={`fa-solid fa-chevron-${openBrand === group.brand ? 'up' : 'down'}`}></i>
        </h3>

        <div className={`${styles1.phoneGrid} ${openBrand === group.brand ? styles1.open : ""}`}>
          {group.models.map((item, idx) => (
            <button
              key={idx}
              className={`${styles1.phoneButton} ${currentPhone === item.phone ? styles1.selected : ""}`}
              onClick={() => {
                handlePhoneSelect(item.phone);
              }}
            >
              <div className={styles1.phoneButtonContent}>
                <span className={styles1.phoneName}>{item.name}</span>
                <div className={styles1.phonePreview}>
                  <img src={item.phone.url} alt={item.name} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    ))}

    {/* Show unified search results when searching or filtering */}
    {shouldAutoOpen && filteredPhones.length > 0 && (
      <div className={styles1.searchResultsSection}>
        <div className={styles1.searchResultsHeader}>
          <h3>
            {searchQuery.length > 0 ? `Search Results for "${searchQuery}"` : `${selectedCategory} Phones`}
            <span className={styles1.resultCount}>
              ({filteredPhones.reduce((total, group) => total + group.models.length, 0)} phones)
            </span>
          </h3>
        </div>
        <div className={styles1.searchResultsGrid}>
          {filteredPhones.flatMap(group => 
            group.models.map((item, idx) => (
              <button
                key={`${group.brand}-${idx}`}
                className={`${styles1.phoneButton} ${currentPhone === item.phone ? styles1.selected : ""}`}
                onClick={() => handlePhoneSelect(item.phone)}
              >
                <div className={styles1.phoneButtonContent}>
              
                  <span className={styles1.phoneName}>{item.name}</span>
                  <div className={styles1.phonePreview}>
                    <img src={item.phone.url} alt={item.name} />
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    )}

  </div>




    {isSidebarOpen && (
    <div
      className={styles1.overlay}
      onClick={() => setIsSidebarOpen(false)} // Close sidebar when clicked
    ></div>
  )}
{isSidebarPhoneOpen && (
    <div
      className={styles1.overlay}
      onClick={() => setIsSidebarPhoneOpen(false)} // Close sidebar when clicked
    ></div>
  )}

<button className={styles1.toggleextras} onClick={() => setIsSidebarPhoneOpen(!isSidebarPhoneOpen)}>
<i  className="fa-solid fa-mobile-screen"></i>

      </button>
      <button className={styles1.togglephone} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
      <i  className="fa-solid fa-face-smile"></i>
    

      </button>


    <div className={styles1.stage0} >
            <Stage
      ref={stageRef}
      width={600}
      height={600}

      
      style={{
        touchAction: 'none', // Allow touch events to interact with the stage
        pointerEvents: 'auto', // Ensure pointer events are active
        display: 'flex',
        justifyContent : "center",
        alignItems : "center",
        paddingLeft : "0px",

      }}
    >
      <Layer>
        {/* Background Image */}
        {bgImage && (
          <KonvaImage
            image={bgImage}
            width={600}
            height={600}
            x={0}
            y={0}
          />
        )}

        <Group>
          {/* Phone body (without the camera hole) */}
          <Group
            name="bodyy"
            clipFunc={(ctx) => {
              const x = thex;
              const y = they;
              const width = thewidth;
              const height = thehieght;
              const radius = theradius;
              const borderThickness = 10;

              // Draw the outer border (larger than the phone body)
              ctx.beginPath();
              ctx.moveTo(x - borderThickness + radius, y - borderThickness);
              ctx.lineTo(x + width + borderThickness - radius, y - borderThickness);
              ctx.arcTo(
                x + width + borderThickness,
                y - borderThickness,
                x + width + borderThickness,
                y + radius - borderThickness,
                radius + borderThickness
              );
              ctx.lineTo(x + width + borderThickness, y + height + borderThickness - radius);
              ctx.arcTo(
                x + width + borderThickness,
                y + height + borderThickness,
                x + width - radius + borderThickness,
                y + height + borderThickness,
                radius + borderThickness
              );
              ctx.lineTo(x - borderThickness + radius, y + height + borderThickness);
              ctx.arcTo(
                x - borderThickness,
                y + height + borderThickness,
                x - borderThickness,
                y + height - radius + borderThickness,
                radius + borderThickness
              );
              ctx.lineTo(x - borderThickness, y + radius - borderThickness);
              ctx.arcTo(
                x - borderThickness,
                y - borderThickness,
                x - borderThickness + radius,
                y - borderThickness,
                radius + borderThickness
              );
              ctx.closePath();

              // Fill the outer border
              ctx.fillStyle = rgbValue2; // Outer border color
              ctx.fill();

              // Draw the main phone body as a rounded rectangle
              ctx.beginPath();
              ctx.moveTo(x + radius, y);
              ctx.lineTo(x + width - radius, y);
              ctx.arcTo(x + width, y, x + width, y + radius, radius);
              ctx.lineTo(x + width, y + height - radius);
              ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
              ctx.lineTo(x + radius, y + height);
              ctx.arcTo(x, y + height, x, y + height - radius, radius);
              ctx.lineTo(x, y + radius);
              ctx.arcTo(x, y, x + radius, y, radius);
              ctx.closePath();

              // Clip to the phone body
              ctx.clip();

              // Fill the phone body
              ctx.fillStyle = rgbValue; // Semi-transparent black
              ctx.fill();
            }}
          >
          {userImages.map((image, index) => (
            
            <KonvaImage
              key={index}
              image={image}
              draggable

                  onClick={(e) => {
      handleSelect(e);
      const layer = stageRef.current?.findOne('.layer'); // Get the layer
      layer?.batchDraw(); // Redraw layer
    }}
              onTouchStart={(e) => {
                handleSelect(e);
                const layer = stageRef.current?.findOne('.layer'); // Get the layer
                layer?.batchDraw(); // Redraw layer
              }} // Handle touch

              x={(600 - image.width) / 2}
              y={(600 - image.height) / 2}
              width={image.width}
              height={image.height}
              onDragMove={(e) => {
                setButtonPosition({
                  x: e.target.x() + e.target.width() / 2,
                  y: e.target.y() - 15,
                });
              }}
              onTransformMove={(e: any) => {
                const image = e.target;
                const width = image.width() * image.scaleX();
                const height = image.height() * image.scaleY();
                setButtonPosition({
                  x: image.x() + width / 2,
                  y: image.y() - 15,
                });
              }}
            />
          ))}


{userTexts.map((text) => (
          <KonvaText
            key={text.id}
            id={`text-${text.id}`}
            text={text.text}
            fontSize={text.fontSize}
            fontFamily={text.fontFamily}
            fontStyle={String(text.fontWeight)}
            fill={text.fill}
            x={text.x}
            y={text.y}
            draggable
                onClick={() => {
      handleSelectText(text.id);
      const layer = stageRef.current?.findOne('.layer'); // Get the layer
      layer?.batchDraw(); // Redraw layer
    }}
            onTouchStart={() => {
              handleSelectText(text.id);
              const layer = stageRef.current?.findOne('.layer'); // Get the layer
              layer?.batchDraw(); // Redraw layer
            }}
            onDragEnd={(e) => {
              const { x, y } = e.target.position();
              setUserTexts((prevTexts) =>
                prevTexts.map((txt) =>
                  txt.id === text.id ? { ...txt, x, y } : txt
                )
              );
            }}
          />
        ))}
          </Group>

          {/* Camera hole */}
          <Group>
            <Rect
              x={thecamex}
              y={thecamey}
              width={thecamewidth}
              height={thecamehieght}
              cornerRadius={thecameradius}
              fill="rgb(250, 250, 250)"  // Transparent fill (or use an image if required)
            />
          </Group>
        </Group>
      </Layer>


      {selectedText && (
      <Layer>
        <Transformer
          ref={textTransformerRef}
          nodes={[stageRef.current?.findOne(`#text-${selectedText.id}`) as any]}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
          rotateEnabled={true}
          boundBoxFunc={(oldBox, newBox) => newBox} // Allow resizing
        />
      </Layer>
    )}

      {/* Transformer component for the selected image */}
        {selectedImage && (
          <Layer>
            <Transformer
              ref={transformerRef}
              nodes={[selectedImage]}
              boundBoxFunc={(oldBox, newBox) => {
                if (isCropMode) {
                  // In crop mode, restrict resizing to crop box only
                  return {
                    ...newBox,
                    width: cropBox.width,
                    height: cropBox.height,
                  };
                }
                return newBox;
              }}
            />
          </Layer>




        )}


        
    </Stage>

    <div className={styles1.uploadingdiv}>

<input
type="file"
id="file-upload"
className={styles1.uploadfile}
onChange={handleImageUpload}
accept="image/*"
/>
<label  htmlFor="file-upload" className={`${styles.secondaryButton} `}>
Upload Your Image
</label>

<div style={{ position: "relative" }}>
</div>
<div className={styles1.savediv}>
  <button
  className={styles.primaryButton}
  style={{
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: loading ? 0.3 : 1
  }}
  onClick={handleSendToCloudinary}
  disabled={loading}  // Disable the button while loading
>
  {loading ? 'Uploading...' : 'Save Design'}
</button>
  </div>

</div>
{/* Blur overlay */}
{isCropMode && (
<div
style={{
position: "fixed",
top: 0,
left: 0,
width: "100vw",
height: "100vh",
backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
backdropFilter: "blur(10px)", // Blur effect
zIndex: 999, // Ensure it's above everything else
display: "flex",
justifyContent: "center",
alignItems: "center",
}}
>
{/* Cropper */}
<div style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}>
<Cropper
src={cropImageSrc || undefined}
ref={cropperRef}
style={{ width: "100%", maxHeight: "400px" }}
initialAspectRatio={NaN}
autoCropArea={1}
viewMode={1}
background={false}
responsive={true}
guides={true}
dragMode="move"
zoomable={true}
scalable={true}
/>
<div style={{ marginTop: "10px", textAlign: "center" }}>
<button
onClick={handleCrop}
style={{
  marginRight: "10px",
  padding: "10px 20px",
  background: "#4CAF50",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
}}
>
Crop
</button>
<button
onClick={() => setIsCropMode(false)}
style={{
  padding: "10px 20px",
  background: "#f44336",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
}}
>
Cancel
</button>
</div>
</div>
</div>
)}

    </div>


  


        
    


      {/* Text customization controls */}







      <div className={`${styles1.extras} ${isSidebarOpen ? styles1.open : ""}`}>
      {/* Stickers Section */}
      <h2><i className="fa-solid fa-sticky-note"></i> Pick A Sticker</h2>
      <div
        ref={stickersRef}
        className={styles1.extrastickers}
      >
        {stickerList1.map((sticker, index) => (
          <img
            key={index}
            src={sticker}
            alt={`Sticker ${index + 1}`}
            onClick={() => {handleAddSticker(sticker);setIsSidebarOpen(false)}}
            style={{ cursor: "pointer", width: "100px", height: "100px" }}
          />
        ))}
      </div>

      {/* Fonts Section */}
      <h2><i className="fa-solid fa-font"></i> Pick A Font</h2>
      <div
        ref={fontsRef}
        className={styles1.fontname}
      >
        {[
          { font: "'Arial', sans-serif", label: "ARTCASE" },
          { font: "'Times New Roman', serif", label: "ARTCASE" },
          { font: "'Courier New', monospace", label: "ARTCASE" },
          { font: "'Merriweather', serif", label: "ARTCASE" },
          { font: "'Mulish', sans-serif", label: "ARTCASE" },
          { font: "'Oswald', sans-serif", label: "ARTCASE" },
          { font: "'Sarina', cursive", label: "ARTCASE" },
          { font: "'Playwrite AU VIC Guides', serif", label: "ARTCASE" },
          { font: "'Ysabeau SC', serif", label: "ARTCASE" },
          { font: "'Monoton', serif", label: "ARTCASE" },
        ].map((item, index) => (
          <p
            key={index}
            style={{
              fontFamily: item.font,
              cursor: "pointer",
            }}
            onClick={() => {
              handleTextChange("fontFamily", item.font);
              handleAddText("ARTCASE", item.font);
              setIsSidebarOpen(false);
            }}
          >
            {item.label}
          </p>
        ))}
      </div>
    </div>





            


             
            
        </div>
    );

    
};

export default SendToCloudinary;
