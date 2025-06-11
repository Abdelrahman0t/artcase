'use client';
import { relative } from 'path';
import styles from './HomePage.module.css';
import Link from 'next/link';

import { useState, useEffect } from 'react'

export default function Home(){
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    "/TheStyle/61nYTZMYAcL.jpg",
    "/TheStyle/il_600x600.6408613694_jdtd.webp",
    "/TheStyle/il_794xN.6310864038_t3es.webp",
    "/TheStyle/il_794xN.6236910131_6ppx.avif",
    "/TheStyle/il_794xN.6374111732_tksm.avif",
    "/TheStyle/il_600x600.6236061797_7dog.webp",
    "/TheStyle/il_600x600.6315629229_cfk0.webp",
    "/TheStyle/images.jpg",
    "/TheStyle/wircbgiecz1c1a4wrlbs.png",
    "/TheStyle/il_794xN.6479298676_ragh.avif"
  ];


  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [images.length]);
   return(
    <div className={styles.thebody}>
                <header className={styles.header}>
          <div style={{ fontSize: '24px', fontWeight: 'bold',color : 'white' }}>ArtCase</div>
          <nav className={styles.nav}>
            <button className={styles.navButton}>About</button>
            <button className={styles.navButton}>Blog</button>
            <Link href='/login' style={{'color' : "inherit",'textDecoration' : 'none'}}> <button className={styles.btn5}>Log In</button></Link>
            <Link href='/register' style={{'color' : "inherit",'textDecoration' : 'none'}}><button className={styles.Mainbtn5} >Sign In</button></Link>
      
          </nav>
        </header>
        <div className={`${styles.intro} d-flex align-items-start`}>

        <div className={styles.textContent}>
            <h1 className="mb-3" style={{ fontSize: '36px',fontWeight : "bolder" }}>
              WELCOME TO THE <span style={{color : 'rgba(8, 40, 74, 0.82)'}}> ARTCASE </span>
            </h1>
            <h3 className="mb-3" style={{ fontSize: '24px', opacity: 0.85 }}>
              Create your own phone case with your desired design and make your phone your own art.
            </h3>
            <p style={{ fontSize: '16px', opacity: 0.85, lineHeight: '1.2' }}>
              Browse through our extensive gallery for inspiration or upload your own artwork to make something truly unique.
            </p>
            </div>
            <div className='col-3 d-flex align-items-start' style={{height : '200px'}}>
          
            <div className="col-3 d-flex align-items-start" style={{ height: '200px' }}>
  <div className={styles.image_container}>
    <img
      src="TheStyle/a0552af2dac55d3eae3c5d46a60925d5.jpg"
      style={{ height: '550px',borderRadius:'70px', marginTop : '50px',position :'relative', zIndex : 10 }}
      className={styles.float_animation}
      alt="Stitch"
    />
    
  </div>
</div>


            </div>
            </div>


            <div style={{marginTop : '200px'}}>
            <h1 style={{color: '#012d5d',textAlign : 'center',textTransform : 'uppercase',marginBottom : '150px'}}>About Us</h1>
             <div className={`${styles.sec1} d-flex  justify-content-between align-items-center p-5`} style={{margin : "100px 50px"}} >
             
                <div style={{padding : '50px',width: '40%',color : 'rgb(0, 0, 0)'}} className={styles.text1}>
                  
                  <h1 style={{textAlign : 'center',color : 'rgb(255, 255, 255)'}} className='mb-3'>Who Are We</h1>
                  <h3 >Discover multible Of Defferant Cases That May Help You Create Your Own Mood, Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nisi itaque reprehenderit, voluptatem id quae soluta atque voluptatum hic est praesentium inventore quo odit nostrum labore aliquid accusamus totam maiores. Blanditiis?</h3>
                 
                  </div>
                  <div className={styles.image_wrapper}>
    <img
      style={{
        width: "600px",
        borderRadius: "20px",
        position: "relative",
        zIndex: 2,
      }}
      src="/TheStyle/15c4b5ac0660b6d0ec007d91cd78f726.jpg"
      alt="About Us"
    />
  </div>
  

            </div>


            <div className={`${styles.sec1} d-flex  justify-content-between align-items-center p-5`} style={{margin : "100px 50px"}} >
            <div className={styles.image_wrapper2}>
<img
style={{
width: "600px",
borderRadius: "20px",
position: "relative",
zIndex: 2,
}}

src="/TheStyle/34c2af97c0eb6d9f627cdc2dc564a06b.jpg"
alt="About Us"
/>
</div>

<div style={{padding : '50px',width: '40%',color : 'rgb(1, 22, 44)'}} className={styles.text2}>
<h1 style={{textAlign : 'center',color : 'white'}} className='mb-3'>What Is Our Purpose</h1>
  <h3 >Discover multible Of Defferant Cases That May Help You Create Your Own Mood, Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nisi itaque reprehenderit, voluptatem id quae soluta atque voluptatum hic est praesentium inventore quo odit nostrum labore aliquid accusamus totam maiores. Blanditiis?</h3>
 
  </div>



</div>
</div>



<div style={{ marginTop: '200px' }}>
  <h1
    style={{
      color: '#012d5d',
      textAlign: 'center',
      textTransform: 'uppercase',
      marginBottom: '100px',
    }}
  >
    Features
  </h1>

  {/* Cards Container */}
  <div
className={styles.cards_container}
  >
    {/* Card 1 */}
    <div
className={styles.card}
    >
      <img
        src="/TheStyle/innovation.png"
        alt="Customization Icon"
        style={{ width: '80px', marginBottom: '20px' }}
      />
      <h3 >Unlimited Customization</h3>
      <p >
        Create your own designs with endless possibilities. Your case, your style.
      </p>
    </div>

    {/* Card 2 */}
    <div
className={styles.card}
    >
      <img
        src="/TheStyle/material.png"
        alt="Durability Icon"
        style={{ width: '80px', marginBottom: '20px' }}
      />
      <h3 >Durable Materials</h3>
      <p >
        Built to last with high-quality materials, ensuring your phone is always protected.
      </p>
    </div>

    {/* Card 3 */}
    <div
className={styles.card}
    >
      <img
        src="/TheStyle/ecosystem.png"
        alt="Eco-friendly Icon"
        style={{ width: '80px', marginBottom: '20px' }}
      />
      <h3 >Eco-Friendly</h3>
      <p >
        Our cases are made from sustainable materials to protect your phone and the planet.
      </p>
    </div>

    <div
    className={styles.card}
  >
    <img
      src="/TheStyle/phone.png"
      alt="Premium Design Icon"
      style={{ width: '80px', marginBottom: '20px' }}
    />
    <h3 >Premium Design</h3>
    <p >
      Enjoy sleek and modern designs that perfectly complement your phone. Our cases are stylish and functional.
    </p>
  </div>

  {/* Card 5 */}
  <div
    className={styles.card}
  >
    <img
      src="/TheStyle/fast-delivery.png"
      alt="Fast Shipping Icon"
      style={{ width: '80px', marginBottom: '20px' }}
    />
    <h3 >Fast Shipping</h3>
    <p >
      Get your custom case delivered quickly and efficiently. We ship worldwide to ensure everyone can enjoy our products.
    </p>
  </div>

  {/* Card 6 */}
  <div
    className={styles.card}
  >
    <img
      src="/TheStyle/support.png"
      alt="Customer Support Icon"
      style={{ width: '80px', marginBottom: '20px' }}
    />
    <h3 >Excellent Support</h3>
    <p >
      Our dedicated support team is always here to help with your questions or concerns, ensuring a smooth experience.
    </p>
  </div>
  </div>

</div>




<div style={{ marginTop: '300px' }}>
  <h1 style={{ textAlign: 'center', color: '#012d5d', textTransform: 'uppercase', marginBottom: '50px' }}>
    Trending Designs
  </h1>
  <div className={styles.trending_container}>
    {/* Map through popular designs */}
    <div className={styles.trending_card}>
      <img src="/TheStyle/61nYTZMYAcL.jpg" alt="Trending Design 1" />
      <img src="/TheStyle/il_600x600.6408613694_jdtd.webp" alt="Trending Design 2" />
      <img src="/TheStyle/il_794xN.6310864038_t3es.webp" alt="Trending Design 2" />
      <img src="/TheStyle/il_794xN.6236910131_6ppx.avif" alt="Trending Design 2" />
      <img src="/TheStyle/il_794xN.6374111732_tksm.avif" alt="Trending Design 2" />
      




    </div>
    <div className='col-6 m-5 d-flex justify-content-center w-100 align-item-center'>
      <button className={`${styles.btn5}`}>Create Your Own</button>
    </div>
    <div className={styles.trending_card}>
      <img src="/TheStyle/il_600x600.6236061797_7dog.webp" alt="Trending Design 2" />
      <img src="/TheStyle/il_600x600.6315629229_cfk0.webp" alt="Trending Design 2" />
      <img src="/TheStyle/images.jpg" alt="Trending Design 2" />
      <img src="/TheStyle/wircbgiecz1c1a4wrlbs.png" alt="Trending Design 2" />
      <img src="/TheStyle/il_794xN.6479298676_ragh.avif" alt="Trending Design 2" />

      

    </div>
    {/* Add more designs as needed */}
  </div>
</div>








<div style={{marginTop : '200px'}}>
<h1 style={{color: '#012d5d',textAlign : 'center',textTransform : 'uppercase',marginBottom : '150px'}}>Reviews</h1>

</div>


             <br />

             <div style={{backgroundColor : " #38cbbb", height : 30, width : 30}}></div>
             <div style={{backgroundColor : " #012d5d", height : 30, width : 30}}></div>
             <div style={{backgroundColor : " #ffffff", height : 30, width : 30}}></div>
                 
                 {/*
                              #87CEEB
             #FFFFFF
             #D3D3D3
             #A9A9A9
             #333333
                 */}


    </div>
   )


}