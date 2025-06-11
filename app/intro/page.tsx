'use client';

import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Home.module.css';
import Link from 'next/link';




export default function Intro(){
    return (
        <>
                <header className={styles.header}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>ArtCase</div>
          <nav className={styles.nav}>
            <button className={styles.navButton}>About</button>
            <button className={styles.navButton}>Blog</button>
            <Link href='/login' style={{'color' : "inherit",'textDecoration' : 'none'}}> <button className={styles.btn5}>Log In</button></Link>
            <Link href='/register' style={{'color' : "inherit",'textDecoration' : 'none'}}><button className={styles.Mainbtn5} >Sign In</button></Link>
      
          </nav>
        </header>
        <div className={`${styles.intro} d-flex align-items-start`}>
         
        </div>
        
        </>
    )
}







/*
export default function Intro() {
    return (
      <>
        <header className={styles.header}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>ArtCase</div>
          <nav className={styles.nav}>
            <button className={styles.navButton}>About</button>
            <button className={styles.navButton}>Blog</button>
            <Link href='/login' style={{'color' : "inherit",'textDecoration' : 'none'}}> <button className={styles.btn5}>Log In</button></Link>
            <Link href='/register' style={{'color' : "inherit",'textDecoration' : 'none'}}><button className={styles.Mainbtn5} >Sign In</button></Link>
      
          </nav>
        </header>
        <div className={`${styles.intro} d-flex align-items-start`}>
          <div className={styles.textContent}>
            <h1 className="mb-3" style={{ fontSize: '36px' }}>
              WELCOME TO THE <span style={{color : 'rgba(5, 220, 199, 0.848)'}}> ARTCASE </span>
            </h1>
            <h3 className="mb-3" style={{ fontSize: '24px', opacity: 0.7 }}>
              Create your own phone case with your desired design and make your phone your own art.
            </h3>
            <p style={{ fontSize: '16px', opacity: 0.7, lineHeight: '1.2' }}>
              Browse through our extensive gallery for inspiration or upload your own artwork to make something truly unique.
            </p>
            <div style={{ marginTop: '30px' }}>
              <button className={`${styles.Mainbtn5}`}>Get Started</button>
              <button
                className={`${styles.btn5}`}
                style={{ marginLeft: 30, marginTop: 20 }}
              >
                Continue
              </button>
              <button
                className={`${styles.btn5}`}
                style={{
                  marginLeft: 30,
                  marginTop: 20,
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1px solid white',
                }}
              >
                Explore Designs
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  */
