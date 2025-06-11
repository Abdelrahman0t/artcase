'use client';

import React, { useEffect, useState, useRef } from 'react';
import Layoutt from '../fyp/layout';
import styles1 from '../createrubber/rubber.module.css'; // Import the CSS module
import Link from 'next/link';

export default function testing(){
return(
    <Layoutt>
    <div className={styles1.sevedcontainr}>
        <div className={styles1.savedimgdiv}>
        <img className={styles1.clearimg} src="https://res.cloudinary.com/daalfrqob/image/upload/v1736136268/blob_hon82u.png" alt="rubber case" />
        </div>

        <div className={styles1.sevedinfos}>

        <h1>preview : </h1>

        <h2>model : iphone 14</h2>
        <h2>price : 25$</h2>

        <h3>Created By : abdelrahman</h3>
        
        <h3>type : customed rubber case</h3>
            <h3>product id : 44</h3>
            


            <h3 style={{color : "var(--thirdColor)", fontWeight : "bolder",textTransform : "uppercase"}}>In Stock</h3>
            <div className={styles1.savedbuttons}>
            
            
    
    <button><span>Add to Chart</span></button>
    
    
    <button className={`${styles1.transparent} ${styles1.fab}`}><span>Leave It for Now</span></button>
    <button style={{background : "red"}}><span>Delete</span></button>
    <button><span>Post It On Your Profile</span></button>
    <Link style={{width:'100%'}} href={`/ordernow/5`}><button style={{width:'100%'}} className={styles1.order_now}><span>Order Now</span></button></Link>

            </div>

           
        </div>
        
    </div>
    </Layoutt>

)
}