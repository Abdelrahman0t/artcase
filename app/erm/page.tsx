
'use client';
import Image from 'next/image';

export default function Home() {
  return (
    <div>
      <h1>External Image</h1>
      <div style={{'display' : 'inline'}}>
      <Image 
        src="https://res.cloudinary.com/daalfrqob/image/upload/v1732454305/blob_pzzrmm.png"  // External image URL
        alt="Description of external image"
        width={150}
        height={150}
        
      />
      </div>
            <Image 
        src="https://res.cloudinary.com/daalfrqob/image/upload/v1732463904/blob_dbr4ey.png"  // External image URL
        alt="Description of external image"
        width={88.57}
        height={155.4}
        
      />

<Image 
        src="https://res.cloudinary.com/daalfrqob/image/upload/v1732887861/blob_hcqemi.png"  // External image URL
        alt="Description of external image"
        width={88.57}
        height={155.4}
        
      />
      <Image 
        src="https://res.cloudinary.com/daalfrqob/image/upload/v1732887770/blob_agkckm.png"  // External image URL
        alt="Description of external image"
        width={88.57}
        height={155.4}
        
      />

                  <Image 
        src="https://res.cloudinary.com/daalfrqob/image/upload/v1731616037/blob_uljtq9.png"  // External image URL
        alt="Description of external image"
        width={150}
        height={150}
        
      />


<Image 
        src="https://res.cloudinary.com/daalfrqob/image/upload/v1732425562/blob_vvellh.png"  // External image URL
        alt="Description of external image"
        width={150}
        height={150}
        
      />



    </div>
  );
}
