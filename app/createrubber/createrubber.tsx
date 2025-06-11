"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Stage, Layer, Image as KonvaImage, Transformer, Group, Rect } from 'react-konva';
import Layout from '../fyp/layout';
import { Text as KonvaText } from "react-konva";

import * as Phones from '../createclear/phons';

import 'react-image-crop/dist/ReactCrop.css';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css'; // Import the cropperjs CSS
import styles1 from './rubber.module.css'; // Import the CSS module
import styles from '../fyp/fyp.module.css'; // Import the CSS module
import style6 from './styles6.module.css'; // Import the CSS module

import Layoutt from '../fyp/layout';
import { Merriweather, Roboto, Oswald } from 'next/font/google';

import Link from 'next/link'

interface UserText {
    id: number;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    fontFamily: string;
    fill: string;
  }

  const stickerList = [
    'thinking-bubble-png-7.png',
    'https://www.vhv.rs/dpng/d/418-4180700_a-thinking-bubble-sticker-thinking-cloud-sticker-hd.png',
    'https://img.b2bpic.net/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg',
    'https://cdn-icons-png.freepik.com/128/5940/5940015.png'
    //'https://example.com/sticker3.png',
  ];
  
const PhoneCaseDesigner: React.FC = () => {
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null); // iPhone background image
    const [userImage, setUserImage] = useState<HTMLImageElement | null>(null); // User uploaded image (Konva node)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Track sidebar visibility
    const [isSidebarPhoneOpen, setIsSidebarPhoneOpen] = useState(false); // Track sidebar visibility

    const [currentPhone, setCurrentPhone] = useState<any>(Phones.iphone_14_t);

    const [selectedImage, setSelectedImage] = useState<any>(null); // Track selected image node
    const transformerRef = useRef<any>(null); // Reference for the Transformer
    const stageRef = useRef<any>(null); // Reference for the Konva stage
    const [loading, setLoading] = useState<boolean>(false);
    const [thex, setthex] = useState<any>(Phones.iphone_14_t.x)
    const [they, setthey] = useState<any>(Phones.iphone_14_t.y)
    const [theradius, settheradius] = useState<any>(Phones.iphone_14_t.radius)
    const [thewidth, setthewidth] = useState<any>(Phones.iphone_14_t.width)
    const [thehieght, setthehieght] = useState<any>(Phones.iphone_14_t.height)
    const [thecamex, setthecamex] = useState<any>(Phones.iphone_14_t.cameraX)
    const [thecamey, setthecamey] = useState<any>(Phones.iphone_14_t.cameraY)
    const [thecamewidth, setthecamewidth] = useState<any>(Phones.iphone_14_t.cameraWidth)
    const [thecamehieght, setthecamehieght] = useState<any>(Phones.iphone_14_t.cameraHeight)
    const [thecameradius, setthecameradius] = useState<any>(Phones.iphone_14_t.cameraRadius)
    const [theSku, setTheSku] = useState<any>(Phones.iphone_14_t.sku)
    const [thebwidth, setthebwidth] = useState<any>(Phones.iphone_14_t.bwidth)
    const [thebhieght, setthebhieght] = useState<any>(Phones.iphone_14_t.bheight)
    const phoneBodyRef = useRef<any>(null);

    const [thetype, setthetype] = useState<any>(Phones.iphone_14_t.type)
    const [themodell, setthemodell] = useState<any>(Phones.iphone_14_t.modell)

    const [theStock, setTheStock] = useState<boolean>(false);
    const [thePrice, setThePrice] = useState<number>(0);

    const [userImages, setUserImages] = useState<any[]>([]);

    const [rgbValue, setRgbValue] = useState('rgba(225, 225, 225,0)');
    const [rgbValue2, setRgbValue2] = useState('rgba(225, 225, 225, 0.7)');

    const [savedDesignId, setSavedDesignId] = useState<any>(null)


    const [country, setCountry] = useState("");
    const [password, setPassword] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setaddress] = useState("");
    const [city, setcity] = useState("");

    const [phoneNumber, setPhoneNumber] = useState("");


    const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

    const [isSelected, setIsSelected] = useState(false); // Track selection state
 
    const [mode, setMode] = useState<'transform' | 'crop'>('transform');
    
    const [isCropMode, setIsCropMode] = useState(false); // Track if crop mode is active

    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

    const cropperRef = useRef<any>(null);
    const [userTexts, setUserTexts] = useState<UserText[]>([]);
    const [selectedTextId, setSelectedTextId] = useState<number | null>(null);
    const [newText, setNewText] = useState<string>("");
    const textTransformerRef = useRef(null);
    const [cartoonEmojis, setCartoonEmojis] = useState([]);
    const [showAllStickers, setShowAllStickers] = useState(false);
    const [showAllFonts, setShowAllFonts] = useState(false);


    const router2 = useRouter()




    /*

    const [containerSize, setContainerSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const containerRef = useRef<HTMLDivElement>(null);

    // Full size of the phone case design
    const canvasWidth = thebwidth; // Full width of iPhone design
    const canvasHeight = thebhieght; // Full height of iPhone design

   // Scale down display for preview (adjust this as needed)



    useEffect(() => {
      const updateSize = () => {
        if (containerRef.current) {
          const { clientWidth, clientHeight } = containerRef.current;
          setContainerSize({ width: clientWidth, height: clientHeight });
        }
      };
  
      window.addEventListener('resize', updateSize);
      updateSize(); // Initial calculation
  
      return () => window.removeEventListener('resize', updateSize);
    }, []);
  
    // Calculate responsive displayScale
    const displayScale = Math.min(
      containerSize.width / thebwidth,
      containerSize.height / thebhieght
    );
   
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

 */
    // Full size of the phone case design
    const canvasWidth = thebwidth; // Full width of iPhone design
    const canvasHeight = thebhieght; // Full height of iPhone design

    const stickersRef = useRef(null);
    const fontsRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const containerRef = useRef<HTMLDivElement>(null);

  const [stickers, setStickers] = useState([]); // State to store stickers
  const [error, setError] = useState(null); // State to store error
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

  const router = useRouter();  // Initialize the router inside the component

  const [theSavedDesign, setTheSavedDesign] = useState()

/*
  useEffect(() => {
    const fetchStickers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/stickers/"); // Replace with your Django API URL
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // Extracting the URL for the first sticker
        const imageUrl = data.data[0].thumbnails[0].url;
        console.log(imageUrl);  // Logging the URL

        // Convert image URL to a data URL (PNG format)
        const stickerList1 = await Promise.all(
          data.data.map(async (item) => {
            const url = item.thumbnails[0].url;
            const base64Data = await convertImageToBase64(url);
            return base64Data; // Return the base64 data URL
          })
        );

        setStickerList1(stickerList1);  // Update state with the list of base64 image URLs
        console.log(stickerList1);  // Log the base64 image URLs

      } catch (err) {
        setError(err.message);
      }
    };

    fetchStickers();
  }, []);


useEffect(() => {
  const fetchStickers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/emoji/"); // Replace with your Django API URL
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      
      // Extracting the URL for the first sticker
      console.log(data.data)

      // Convert image URL to a data URL (PNG format)
      const stickerList1 = await Promise.all(
        data.data.map(async (item) => {
          const url = item.thumbnails[0].url;
          const base64Data = await convertImageToBase64(url);
          return base64Data; // Return the base64 data URL
        })
      );

      setStickerList1(stickerList1);  // Update state with the list of base64 image URLs
      console.log(stickerList1);  // Log the base64 image URLs

    } catch (err) {
      setError(err.message);
    }
  };

  fetchStickers();
}, []);
*/

  const convertImageToBase64 = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // Ensure the image doesn't taint the canvas (for CORS)
      img.src = url;

      img.onload = () => {
        // Create a canvas to draw the image
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas size to the image size
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0);

        // Convert the canvas to a data URL (base64)
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);  // Resolve with the base64 data URL
      };

      img.onerror = (error) => {
        reject(new Error("Failed to load image"));
      };
    });
  };

  // Update container size on resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setContainerSize({ width: clientWidth, height: clientHeight });
      }
    };

    window.addEventListener('resize', updateSize);
    updateSize(); // Initial calculation

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Calculate responsive displayScale
  const isLargeScreen = containerSize.width > 1200; // Define a threshold for "large screens"
  const isSmallScreen = containerSize.width < 576; // Define a threshold for "large screens"
  const isTinyScreen = containerSize.width < 476; // Define a threshold for "large screens"


  const displayScale = isLargeScreen
  ? 0.25 // Scale for large screens
  : isSmallScreen
  ? 0.20 : // Scale for small screens
  isTinyScreen? 0.15
  : Math.min(
      containerSize.width / thebwidth,
      containerSize.height / thebhieght
    ) * 0.75; 



    
   
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
          x: (thebwidth - (thex - 25)) / 2, // Default position for x
          y: (thebhieght - they) / 2, // Default position for y
          fontSize: 30, // Default font size
          fontFamily: customFontFamily, // Use provided font family
          fill: "black", // Default color
        };
      
        setUserTexts([...userTexts, newTextObject]); // Add new text to the state
      };
      
      // Handle text selection
      const handleSelectText = (id: number) => {
  
        const textNode = stageRef.current?.findOne(`#text-${id}`);
        if (textNode) {
          // Move the selected text to the top of its layer
          textNode.moveToTop();
        }
      
        setSelectedTextId(id); // Update selected text state
  
        setSelectedImage(null)
        const currentText = id 
        if(selectedTextId == currentText ){
        setSelectedTextId(null);
      }
      else{
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



      const handleEyeDropperClick = async () => {
        if ('EyeDropper' in window) {
          try {
            const eyeDropper = new (window as any).EyeDropper();
            const result = await eyeDropper.open(); // Open the EyeDropper tool
            const hexColor = result.sRGBHex; // Get selected color
    
            // Set full opacity for the selected color
            setRgbValue(hexToRgba(hexColor, 1)); // Full opacity for color
            setRgbValue2(hexToRgba(hexColor, 0.85 )); // Full opacity for second state
    
            console.log('Color selected via EyeDropper:', hexColor);
          } catch (error) {
            console.error('EyeDropper canceled or failed:', error);
          }
        } else {
          console.error('EyeDropper API not supported in this browser.');
        }
      };


    const handleColorChange = (e : any) => {
        const hex = e.target.value; // Get hex value
        setRgbValue(hexToRgba(hex, 0.9)); // Convert to RGBA and set state
        setRgbValue2(hexToRgba(hex, 0.7));
      };
    
      const hexToRgba = (hex : any, alpha : any) => {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      };




    useEffect(() => {
      
        const loadBgImage = new Image();
        loadBgImage.src = currentPhone.url; // Path to your iPhone background image
        loadBgImage.onload = () => setBgImage(loadBgImage);
        window.stageRef = stageRef.current
        
    }, [currentPhone]);


    
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            Array.from(files).forEach((file) => {
                const img = new Image();
                img.src = URL.createObjectURL(file);
                img.onload = () => {
                    const maxWidth = 800;  // Set max width for scaling
                    const maxHeight = 800; // Set max height for scaling
                    const scaleFactor = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
                    img.width *= scaleFactor;
                    img.height *= scaleFactor;
    
                    // Set the scaled image in state
                    setUserImages((prevImages) => [...prevImages, img]);
                    setSelectedImage(null); // Reset selected image when a new one is uploaded
                };
            });
            event.target.value = "";  // Clear the file input after selection
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
      // Remove the selected image from the userImages array by its reference
      setUserImages((prevImages) => {
        return prevImages.filter(image => image !== selectedImage); // Remove image from state
      });

      // Remove the transformer for the selected image
      transformerRef.current.nodes([]); // Detach transformer from the image

      // Remove the image from the stage
      selectedImage.destroy(); // Destroy the image node from Konva stage
      setSelectedImage(null); // Deselect the image
    }

    if (selectedText) {
      // Remove the selected text from the userTexts array by its ID
      setUserTexts((prevTexts) =>
        prevTexts.filter((text) => text.id !== selectedText.id) // Remove text from state
      );
  
      // Remove the transformer for the selected text
      textTransformerRef.current.nodes([]); // Detach transformer from the text
  
      // Deselect the text
      
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
    const token = localStorage.getItem('token')
    if (!token) {
      alert('You must be logged in');
      window.location.href = '/login'; // or '/auth/login' if that's your route
      return;
    }
    if (!stageRef.current) return;

    // Deselect the image to hide the transformer
    setSelectedImage(null);

    // Allow time for deselection to render
    await new Promise(resolve => setTimeout(resolve, 100));

    // Capture the stage as a data URL
    const dataURL = stageRef.current.toDataURL({
        pixelRatio: 2,
    });

    const blob = dataURLtoBlob(dataURL);

    // Create an image from the data URL
    const img = new Image();

    // Set cross-origin to avoid tainting the canvas
    img.crossOrigin = "Anonymous";  // This is the fix for the tainted canvas issue

    img.src = URL.createObjectURL(blob);

    img.onload = async () => {
        // Create a canvas to resize the image
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let maxWidth = thebwidth;
        let maxHeight = thebhieght;

        if(theSku == "PremiumPhoneCase-iPhone-16-Pro-ToughCaseGloss"){
            maxWidth = 1246;
            maxHeight = 2085;
        } else if( theSku == 'PremiumPhoneCase-iPhone-16-Pro-Max-ToughCaseGloss'){
            maxWidth = 1359;
            maxHeight = 2245;
        }

        // Calculate the aspect ratio
        const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
        let width = Math.round(img.width * ratio); // Calculate new width
        let height = Math.round(img.height * ratio); // Calculate new height
        
        // Override dimensions to ensure exact maxWidth and maxHeight
        if (width !== maxWidth || height !== maxHeight) {
            width = maxWidth;  // Force to match maxWidth
            height = maxHeight; // Force to match maxHeight
        }
        
        // Set the canvas size
        canvas.width = width;
        canvas.height = height;
        
        // Draw the image onto the canvas with the new size
        ctx?.drawImage(img, 0, 0, width, height);

        // Get image data and make white areas transparent
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i]; // Red
            const g = pixels[i + 1]; // Green
            const b = pixels[i + 2]; // Blue

            // Check if the pixel is close to white
            if ( r > 250 && g > 250 && b > 250) {
                pixels[i + 3] = 0; // Set alpha to 0 (transparent)
            }
        }

        // Update the canvas with the modified data
        ctx.putImageData(imageData, 0, 0);

        // Convert the modified canvas to a data URL
        const transparentDataURL = canvas.toDataURL("image/png");

        // Prepare the data for Cloudinary
        const formData = new FormData();
        formData.append("file", dataURLtoBlob(transparentDataURL));
        formData.append("upload_preset", "ml_default"); // Replace with your actual preset

        setLoading(true);

        try {
          // Fetch the latest product data before saving
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/phone-products/`, {
              headers: {
                  Authorization: `Bearer ${token}`,
              }
          });
          if (!response.ok) {
              throw new Error('Failed to fetch phone products');
          }
          const products = await response.json();
          const product = products.find((p: any) => p.modell === themodell && p.type === thetype);
          
          if (!product) {
              throw new Error('Product not found in database');
          }

          // Use the database values for stock and price
          const dbStock = product.stock;
          const dbPrice = product.price;

          // Upload to Cloudinary
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
  
          // Save the Cloudinary URL and additional data to your backend using database values
          const djangoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/designs/`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                  image_url: result.secure_url,
                  position: { x: 0, y: 0 }, // Example position
                  stock : dbStock,
                  modell : themodell, 
                  type : thetype,
                  sku : 'none',
                  price : dbPrice
              }),
          });
  
          if (!djangoResponse.ok) {
              const error = await djangoResponse.text();
              console.error("Error saving to Django API:", error);
              return;
          }
           
          const savedDesign = await djangoResponse.json();
          console.log("Design saved successfully:", savedDesign);

          



          let callid =savedDesign.id;
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/design/${callid}`, {
              headers: {
                'Authorization': `Bearer ${token}`, // Pass the token in the Authorization header
              }
            });
            if (response.ok) {
              const data = await response.json();
              
              console.log('Fetched Design:', data.price);  // Log the fetched design data
              setTheSavedDesign(data)
            } else {
              console.error('Failed to fetch design data');
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          } finally {
            setLoading(false);
          }
      }  catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }

       
    };
};



 const handleOrder = async (designId : any) =>{
const token = localStorage.getItem("token");
const orderdetails = {
    design : designId,
    phone_number: phoneNumber, // Replace with actual user input
    address: address,         // Replace with actual user input
    city: city,               // Replace with actual user input
    country: country, 
    firstname : first_name  ,
    lastname : last_name,
     email : email,
     sku : theSku
}
try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/designsview/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderdetails),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to place order:", errorData);
        alert("Failed to place order. Please try again.");
        return;
    }

    const result = await response.json();
    console.log("Order placed successfully:", result);
    alert("Your order has been placed!");
    setSavedDesignId(null)
} catch (error) {
    console.error("Error placing order:", error);
    alert("An error occurred while placing your order.");
}


 }


  
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
      setTheSku(phone.sku);
      //setthebwidth(phone.bwidth);
     // setthebhieght(phone.bheight);
     setTheStock(phone.stock)
     setThePrice(phone.price)
     if (phone.type[2] === 'o') { // Check if the 3rd letter is 'o'
        phone.type = phone.type.slice(0, 2) + phone.type.slice(3); // Remove the 3rd character
    }
    setthetype(phone.type)
    
     setthemodell(phone.modell)

      
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





const addToCart = async (designId : any) => {

  const token = localStorage.getItem('token')
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/add/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${localStorage.getItem("token")}`,

    },
    body: JSON.stringify({ design_id: designId }),
  });

  if (response.ok) {
    alert('Item added to cart!');
    router.push('/BuyingChart');
  } else {
    const data = await response.json();
    alert(data.error);
  }
};













if(theSavedDesign){
  return(
    <div>
    <Layoutt>
    <div className={styles1.sevedcontainr}>
        <div className={styles1.savedimgdiv}> 
        <img src={theSavedDesign.image_url} className={styles1.rubberimg} alt="rubber case" />
        </div>

        <div className={styles1.sevedinfos}>

        <h1>preview : </h1>

        <h2>price : {theSavedDesign.price}$</h2>
        <h3>Created By : {theSavedDesign.user}</h3>
        
        <h3>type : {theSavedDesign.type}</h3>
        <h3>model : {theSavedDesign.modell}</h3>

            <h3>product id : {theSavedDesign.id}</h3>
            


            <h3   style={{
    color: theSavedDesign.stock === "Out of Stock" ? "red" : "var(--thirdColor)",
    fontWeight: "bolder",
    textTransform: "uppercase"
  }}>{theSavedDesign.stock}</h3>
            <div className={styles1.savedbuttons}>
            
            <Link href={`/makepost/${theSavedDesign.id}`}>
  <button><span>Post It On Your Profile</span></button>
</Link>
    
    <button onClick={() => addToCart(theSavedDesign.id)}><span>Add to Chart</span></button>
   <Link href="/fyp"> <button className={`${styles1.transparent} ${styles1.fab}`}><span>Leave It for Now</span></button></Link>

   
  
 

            </div>

           
        </div>
        
    </div>
    </Layoutt>
    </div>
  )
}
    return (
        <div className={styles1.container}>
   
   <div className={styles1.controlhead}>
  

  <div className={styles1.colorcont}>
<span>Select You Color</span>

<input 
type="color"
onChange={handleColorChange} />

<button onClick={handleEyeDropperClick}>
<img src="TheStyle/color-picker.png" alt="" />
<span>Eye Dropper</span>
</button>

</div>



{selectedImage && !isCropMode && (
  <div className={styles1.imgbtns}>
      <button
          onClick={() => {
              setIsCropMode(true);
              setCropImageSrc(selectedImage.attrs.image.src);
          }}
      >
          <img src="TheStyle/crop.png" alt="" />
   <span>Crop</span>

      </button>
      <button onClick={handleInvertImage}>
   <img src="TheStyle/flip.png" alt="" />
   <span>Flip</span>
  </button>

      <button onClick={handleMoveImageToTopRight} >
      <img src="TheStyle/arrowtopright.png" alt="" />
   <span>top right</span>

      </button>

      <button onClick={handleMoveImageToBottomRight}>
      <img src="TheStyle/arrowbottomright.png" alt="" />
   <span>bottom right</span>

      </button>
    <button onClick={handleMoveImageToBottomLeft}>
    <img src="TheStyle/arrowbotttomleft.png" alt="" />
   <span>bottom left</span>

   </button>


        <button
        onClick={handleIncreaseImageSize}

      >
        <img src="TheStyle/expand.png" alt="" />
        <span>Size Up</span>
      </button>
              <button
        onClick={handleDecreaseImageSize }

      >
        <img src="TheStyle/compress.png" alt="" />
        <span>Size down</span>
        </button>
        <button onClick={handleDeleteImage}>
      <img src="TheStyle/delete.png" alt="" />
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
    <button onClick={handleDeleteImage}>
      <img src="TheStyle/delete.png" alt="" />
      <span style={{ color: "red" }}>Delete</span>
    </button>
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



<div className={`${style6.phoneSelectorWrapper} ${isSidebarPhoneOpen ? style6.open2 : ""}`}>
  {[
    {
      brand: "iPhone",
      models: [
        { name: "iPhone 14", phone: Phones.iphone_14_t },
        { name: "iPhone 14 Plus", phone: Phones.iphone_14_plus_t },
        { name: "iPhone 14 Pro", phone: Phones.iphone_14_pro_t },
        { name: "iPhone 14 Pro Max", phone: Phones.iphone_14_pro_max_t },
        { name: "iPhone 15", phone: Phones.iphone_15_t },
        { name: "iPhone 15 Plus", phone: Phones.iphone_15_plus_t },
        { name: "iPhone 15 Pro", phone: Phones.iphone_15_pro_t },
        { name: "iPhone 15 Pro Max", phone: Phones.iphone_15_pro_max_t },
        { name: "iPhone 16 Pro", phone: Phones.iphone_16_pro_t },
        { name: "iPhone 16 Pro Max", phone: Phones.iphone_16_pro_max_t },
      ],
    },
  ].map((group, index) => (
    <div key={index} className={style6.brandSection}>
      <h3 className={style6.brandTitle}>{group.brand}</h3>
      <div className={style6.phoneGrid}>
        {group.models.map((item, idx) => (
          <button
            key={idx}
            className={`${style6.phoneButton} ${
              currentPhone === item.phone ? style6.selected : ""
            }`}
            onClick={() => {
              handlebackground(item.phone);
              setIsSidebarPhoneOpen(false);
            }}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  ))}


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
                className={styles1.stage}
                ref={stageRef}
                width={thebwidth * displayScale}
                height={thebhieght * displayScale}
                scale={{ x: displayScale, y: displayScale }} // Scale down display
                style={{
                    border: '1px solid #ddd',
                    marginBottom: '20px',
                    touchAction: 'none',
                    
                }}
            >
                <Layer>
                  
                    {bgImage && (
                        <KonvaImage
                            image={bgImage}
                            width={thebwidth }
                            height={thebhieght}
                            x={0}
                            y={0}
                        />
                    )}
                        <Group>
                        {/* Phone body (without the camera hole) */}
                        <Group>
                        {/* Phone body (without the camera hole) */}
                        <Group
                        
                        clipFunc={(ctx) => {
                          const x = thex;
                          const y = they;
                          const width = thewidth;
                          const height = thehieght;
                          const radius = theradius;
                  
                          // Border thickness
                          const borderThickness = 22;
                  
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
                            ref = {phoneBodyRef}
                        >
                            {/* Image goes here */}
            
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

              x={(thebwidth - image.width) / 2}
              y={(thebhieght - image.height) / 2}
              width={image.width}
              height={image.height}
              onDragMove={(e) => {
                setButtonPosition({
                  x: e.target.x() + e.target.width() / 2,
                  y: e.target.y() - 15,
                });
              }}
              onTransformMove={(e) => {
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
            fontStyle={text.fontWeight}
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
                                x={ thecamex}
                                y={ thecamey }
                                width={ thecamewidth }
                                height={ thecamehieght }
                                cornerRadius={ thecameradius }
                                fill="rgba(250, 250, 250,1)"  // Transparent fill (or use an image if required)
                                
                            />
                        </Group>
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

            <div className={styles1.uploadingdiv}>

<input
type="file"
id="file-upload"
className={styles1.uploadfile}
onChange={handleImageUpload}
accept="image/*"
/>
<label  htmlFor="file-upload" className={`${styles.btn5} `}>
Upload Your Image
</label>

<div style={{ position: "relative" }}>
</div>
<div className={styles1.savediv}>
  <button
  className={styles.Mainbtn5}
  onClick={handleSendToCloudinary}
  disabled={loading}  // Disable the button while loading
>
  {loading ? 'Uploading...' : 'Save Design'}
</button>
  </div>

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
          src={cropImageSrc}
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

  {/* Main Stage */}
 
</div>


<div
      className={`${styles1.extras} ${isSidebarOpen ? styles1.open : ""}`}
      >
      {/* Stickers Section */}
      <h2>Pick A Sticker</h2>
      <div
        ref={stickersRef}
        className={styles1.extrastickers}
        style={{
          maxHeight: showAllStickers
            ? `${stickersRef.current?.scrollHeight}px`
            : "240px",
          transition: "max-height 0.5s ease",
          overflow: "hidden",
        }}
      >
        {stickerList1.map((sticker, index) => (
          <img
            key={index}
            src={sticker}
            alt={`Sticker ${index + 1}`}
            onClick={() => {handleAddSticker(sticker); setIsSidebarOpen(false)}}
            
          />
        ))}
      </div>
      <button
        className={styles1.showMoreBtn}
        onClick={() => setShowAllStickers(!showAllStickers)}
      >
        {showAllStickers ? "Show Less" : "Show More"}
      </button>

      {/* Fonts Section */}
      <h2>Pick A Font</h2>
      <div
        ref={fontsRef}
        className={styles1.fontname}
        style={{
          maxHeight: showAllFonts ? `${fontsRef.current?.scrollHeight}px` : "240px",
          transition: "max-height 0.5s ease",
          overflow: "hidden",
        }}
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
              setIsSidebarOpen(false)
            }}
          >
            {item.label}
          </p>
        ))}
      </div>
      <button
        className={styles1.showMoreBtn}
        onClick={() => setShowAllFonts(!showAllFonts)}
      >
        {showAllFonts ? "Show Less" : "Show More"}
      </button>
    </div>




      {/* Text customization controls */}






  

          


         




      {savedDesignId && (
            <div>
                <input type="text" placeholder='first name' onChange={(e)=>{setFirstName(e.target.value)}}  />
                <input type="text" placeholder='last name'onChange={(e)=>{setLastName(e.target.value)}}  />
                <input type="email" placeholder='email'onChange={(e)=>{setEmail(e.target.value)}}  />
                <input type="text" placeholder='phone number'onChange={(e)=>{setPhoneNumber(e.target.value)}}  />
                <input type="text" placeholder='country'onChange={(e)=>{setCountry(e.target.value)}}  />
                <input type="text" placeholder='city' onChange={(e)=>{setcity(e.target.value)}} />
                <input type="text" placeholder='address'onChange={(e)=>{setaddress(e.target.value)}} />
                <br />
                <button
                onClick={() => handleOrder(savedDesignId)}
            >
                Order Design
            </button>
            </div>
        )}
     {/*<h1>{theStock == true ? 'cool' : 'nooo' }</h1>*/} 

        </div>
    );
};

export default PhoneCaseDesigner;






/*e4aece1920eea4d2634a2d31588b7b9a8362f89a*/ 



// finnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
