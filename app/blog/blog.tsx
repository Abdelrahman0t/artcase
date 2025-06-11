
'use client';
import { useState, useEffect,useRef } from 'react';
import styles from './blog.module.css';

import Layout from '../fyp/layout';
import styles1 from '../explore/explore.module.css';
const BlogPage = () => {
  const images = [
    'Leonardo_Phoenix_09_A_series_of_visually_striking_and_vibrant_1.jpg',
    'Leonardo_Phoenix_09_A_fit_and_stylish_male_model_in_his_midtwe_0.jpg',
    'Leonardo_Phoenix_09_Vibrant_highquality_images_depicting_whims_2.jpg',
    'Leonardo_Phoenix_10_Create_warm_and_inviting_images_showcasing_1.jpg',
    'Leonardo_Phoenix_10_A_modern_minimalist_background_with_a_subt_1.jpg',
    'photo_2025-01-02_01-03-00.jpg',
]; // Replace with your image URLs
    const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <Layout>
<div className={styles.container}>
  {/* Hero Section */}
  <div className={styles1.sliderContainer}>
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={styles1.image}
                        style={{
                            backgroundImage: `url(${image})`,
                            opacity: currentIndex === index ? 1 : 0,
                            zIndex: currentIndex === index ? 1 : 0,
                        }}
                    />
                ))}

                <div className={styles1.dotsContainer}>
                    {images.map((_, index) => (
                        <div
                            key={index}
                            className={`${styles1.dot} ${currentIndex === index ? styles1.activeDot : ''}`}
                            onClick={() => setCurrentIndex(index)} // Set image when dot is clicked
                        />
                    ))}
                </div>
            </div>

  {/* Popular Articles Section */}
  <section className={styles.popularArticlesSection}>
    <h2>Popular Blog Posts</h2>
    <div className={styles.articlesLayout}>
      {/* Large Article */}
      <div className={styles.largeArticle}>
        <img src="TheStyle/cb4c1f9b29db6ac199182f606ffae519.jpg" alt="Phone Case Design" />
        <h3>How Custom Phone Cases Are Transforming Personalization</h3>
        <p>
          At ArtCase, we believe that a phone case is more than just protection; it's a form of self-expression. Explore how customizable designs are changing the way people personalize their devices.
        </p>
      </div>
      {/* Smaller Articles */}
      <div className={styles.smallArticles}>
        <div className={styles.articleCard}>
          <img src="Leonardo_Phoenix_09_A_fit_and_stylish_male_model_in_his_midtwe_3.jpg" alt="Phone Accessories" />
          <div className={styles.articleContent}>
            <h4>Top Trends in Custom Phone Case Designs for 2025</h4>
            <p>
              Explore the hottest design trends that are taking over the phone case market this year.
            </p>
          </div>
        </div>
        <div className={styles.articleCard}>
          <img src="20170731105857-businessteam-meeting-teamwork.webp" alt="Personalized Case" />
          <div className={styles.articleContent}>
            <h4>The Science of Protective Phone Cases: More Than Just Looks</h4>
            <p>
              A custom phone case isn't just about style—it's about protecting your device. Learn the science behind phone case protection.
            </p>
          </div>
        </div>
        <div className={styles.articleCard}>
          <img src="photo_2025-01-02_01-03-00.jpg" alt="Custom Art" />
          <div className={styles.articleContent}>
            <h4>How to Create Your Own Custom Phone Case with ArtCase</h4>
            <p>
              Our easy-to-use design tool lets you personalize your phone case in minutes. Here’s how to get started with ArtCase.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* Latest Blog Posts Section */}
  <section className={styles.lastedSection}>
    <h2>Latest Blog Posts</h2>
    <div className={styles.articlesGrid}>
      <div className={styles.articleCard1}>
        <img src="TheStyle/b420e7a967a1eeaa3ff23039572fa44a.jpg" alt="Custom Design" />
        <h3>Creating Your Unique Style: Custom Phone Cases for Everyone</h3>
        <span>Thursday, Jan 8 2024</span>
      </div>

      <div className={styles.articleCard1}>
        <img src="TheStyle/templaate.png" alt="Phone Case Collection" />
        <h3>Exploring Our Latest Customizable Phone Case Collection</h3>
        <span>Thursday, Jan 8 2024</span>
      </div>
      <div className={styles.articleCard1}>
        <img src="TheStyle/catsanddogs.png" alt="Personalized Phone Accessories" />
        <h3>Designing Your Dream Phone Case: ArtCase’s Customization Process</h3>
        <span>Thursday, Jan 8 2024</span>
      </div>

      <div className={styles.articleCard1}>
        <img src="TheStyle/NewProject.png" alt="Protective Cases" />
        <h3>The Best Protective Cases for Your Phone: Custom & Durable</h3>
        <span>Thursday, Jan 8 2024</span>
      </div>
      <div className={styles.articleCard1}>
        <img src="TheStyle/Leonardo_Phoenix_A_sleek_modern_black_phone_case_with_a_matte_2.jpg" alt="Sleek Design" />
        <h3>Elegance in Simplicity: Minimalist Custom Phone Cases</h3>
        <span>Thursday, Jan 8 2024</span>
      </div>
      <div className={styles.articleCard1}>
        <img src="f491e298118cb46974f7f0c3f8d6c95f.jpg" alt="Artistic Cases" />
        <h3>Art Meets Function: How Custom Art Can Elevate Your Phone Case</h3>
        <span>Thursday, Jan 8 2024</span>
      </div>
    </div>
  </section>

  {/* Customization Projects Section */}
  <section className={styles.projectsSection}>
    <h2 className={styles.sectionTitle}>Discover ArtCase Customization Projects</h2>
    <div className={styles.projectsGrid}>
      {/* First Project Card (Large) */}
      <div className={styles.projectCard}>
        <img src="12bbeb2db2c2cbe68aa77e51cb187ac5.jpg" alt="Custom Artwork" />
        <h3>Bringing Your Vision to Life: Custom Art for Your Phone Case, Whatever The Design Is </h3>
        <p>
          Learn how ArtCase collaborates with artists and designers to bring your unique vision to life on a custom phone case.
        </p>
      </div>
      {/* Other Project Cards (Smaller) */}
      <div className={styles.projectCard}>
        <img src="3eb62e7bd7b5600e9e762199940fd037.jpg" alt="Custom Phone Cases" />
        <h3>Eco-Friendly Customization: Sustainable Materials for Your Phone Case</h3>
        <p>
          Discover how ArtCase is reducing its carbon footprint with sustainable phone case materials.
        </p>
      </div>
      <div className={styles.projectCard}>
        <img src="TheStyle/natural-minimalism-with-green-smartphone.jpg" alt="Personalized Design" />
        <h3>From Concept to Creation: The Journey of Your Custom Phone Case</h3>
        <p>
          Explore the process of designing and creating your own custom phone case with ArtCase.
        </p>
      </div>
    </div>
  </section>
</div>

</Layout>
  );
};

export default BlogPage;
