"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './newui.module.css';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaComment, FaShoppingCart, FaMobile, FaTag, FaCalendarAlt, FaDollarSign, FaUpload, FaMobileAlt, FaEye, FaLock, FaShare, FaArrowRight, FaPlane, FaUndo, FaMapMarkerAlt, FaEnvelope, FaInstagram, FaTiktok, FaPinterest } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
}

const CountUp: React.FC<CountUpProps> = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const startValue = 0;
    const endValue = end;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const currentCount = Math.floor(progress * (endValue - startValue) + startValue);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);

  return (
    <span ref={countRef}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

interface Comment {
  author: string;
  avatar: string;
  text: string;
  date: string;
}

interface Post {
  title: string;
  artist: string;
  image: string;
  price: number;
  date: string;
  model: string;
  type: string;
  likes: number;
  favorites: number;
  description: string;
  tags: string[];
  comments: Comment[];
}
export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const totalCards = 8; // Total number of cards
  const [totalSlides, setTotalSlides] = useState(2);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const calculateTotalSlides = () => {
      if (sliderRef.current) {
        const containerWidth = sliderRef.current.offsetWidth;
        const cardWidth = 300;
        const gap = 30;
        const padding = 40;
        const visibleCards = Math.max(1, Math.floor((containerWidth - padding) / (cardWidth + gap)));
        const calculatedSlides = Math.ceil(totalCards / visibleCards);
        setTotalSlides(calculatedSlides);
      }
    };

    calculateTotalSlides();
    window.addEventListener('resize', calculateTotalSlides);
    return () => window.removeEventListener('resize', calculateTotalSlides);
  }, []);

  const scrollToSlide = (index: number) => {
    if (sliderRef.current) {
      const containerWidth = sliderRef.current.offsetWidth;
      const cardWidth = 300;
      const gap = 30;
      const padding = 40;
      const visibleCards = Math.floor((containerWidth - padding) / (cardWidth + gap));
      const slideWidth = (cardWidth * visibleCards) + (gap * (visibleCards - 1));
      
      sliderRef.current.scrollTo({
        left: index * slideWidth,
        behavior: 'smooth'
      });
      setCurrentSlide(index);
    }
  };

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      scrollToSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      scrollToSlide(currentSlide - 1);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (sliderRef.current) {
        const containerWidth = sliderRef.current.offsetWidth;
        const cardWidth = 300;
        const gap = 30;
        const padding = 40;
        const visibleCards = Math.floor((containerWidth - padding) / (cardWidth + gap));
        const slideWidth = (cardWidth * visibleCards) + (gap * (visibleCards - 1));
        const scrollLeft = sliderRef.current.scrollLeft;
        
        // Calculate current slide based on scroll position
        const currentSlideIndex = Math.floor(scrollLeft / slideWidth);
        setCurrentSlide(currentSlideIndex);
      }
    };

    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', handleScroll);
      return () => slider.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (comment.trim()) {
      // Add comment logic here
      setComment('');
    }
  };

  return (
    <div>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Transform Your Phone into 
              <span className={styles.highlight}> Art</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Create custom phone cases that reflect your unique style. 
              Express yourself with our easy-to-use design platform.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/newdesign" className={styles.primaryButton}>
                <i className="fas fa-palette"></i>
                Start Creating
              </Link>
              <Link href="/newexplore" className={styles.secondaryButton}>
                <i className="fas fa-compass"></i>
                Explore Designs
              </Link>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>
                  <CountUp end={10} suffix="K+" />
                </span>
                <span className={styles.statLabel1}>Active Artists</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>
                  <CountUp end={50} suffix="K+" />
                </span>
                <span className={styles.statLabel1}>Designs Created</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>
                  <CountUp end={4.9} duration={1500} />
                </span>
                <span className={styles.statLabel1}>User Rating</span>
              </div>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.imageContainer}>
              <img 
                src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" 
                alt="Custom Phone Case Design" 
                className={styles.mainImage}
              />
              <div className={styles.floatingBadge}>
                <i className="fas fa-star"></i>
                <span>Trending Design</span>
              </div>
              <div className={styles.imageOverlay}>
                <div className={styles.overlayContent}>
                  <span className={styles.overlayText}>Custom Made</span>
                  <span className={styles.overlayPrice}>From $29.99</span>
                </div>
              </div>
            </div>
            <div className={styles.imageDecoration}>
              <div className={styles.decorationCircle}></div>
              <div className={styles.decorationSquare}></div>
              <div className={styles.decorationDots}></div>
            </div>
          </div>
        </div>
      </div>

      <section className={styles.tutorialSection}>
        <div className={styles.tutorialDecoration}>
          <div className={styles.tutorialHexagon}></div>
          <div className={styles.tutorialTriangle}></div>
          <div className={styles.tutorialWave}></div>
          <div className={styles.tutorialDiamond}></div>
       
          <div className={styles.tutorialSpiral}></div>
        </div>
        <div className={styles.tutorialHeader}>
          <motion.h2 
            className={styles.tutorialTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Create Your <span className={styles.highlight2}>Perfect</span> Case
          </motion.h2>
          <motion.p 
            className={styles.tutorialSubtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A simple journey to your custom phone case
          </motion.p>
        </div>

        <div className={styles.tutorialTimeline}>
          <motion.div 
            className={styles.timelineStep}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className={styles.timelineContent}>
              <div className={styles.timelineIcon}>
                <FaUpload />
              </div>
              <div className={styles.timelineInfo}>
                <h3>Upload</h3>
                <p>Select your favorite artwork or photo</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className={styles.timelineStep}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className={styles.timelineContent}>
              <div className={styles.timelineIcon}>
                <FaMobileAlt />
              </div>
              <div className={styles.timelineInfo}>
                <h3>Select</h3>
                <p>Choose your phone model and case style</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className={styles.timelineStep}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className={styles.timelineContent}>
              <div className={styles.timelineIcon}>
                <FaEye />
              </div>
              <div className={styles.timelineInfo}>
                <h3>Customize</h3>
                <p>Adjust size, position, and effects</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className={styles.timelineStep}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className={styles.timelineContent}>
              <div className={styles.timelineIcon}>
                <FaLock />
              </div>
              <div className={styles.timelineInfo}>
                <h3>Checkout</h3>
                <p>Secure payment and order confirmation</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className={styles.timelineStep}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className={styles.timelineContent}>
              <div className={styles.timelineIcon}>
                <FaShare />
              </div>
              <div className={styles.timelineInfo}>
                <h3>Share</h3>
                <p>Show off your unique design</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className={styles.tutorialCTA}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link href="/create" className={styles.tutorialButton}>
            Start Customizing Now
            <FaArrowRight />
          </Link>
        </motion.div>
      </section>

      <section className={styles.artistsSection}>
        <div className={styles.artistsDecoration}>
          <div className={styles.artistsShape + ' ' + styles.artistsShape1}></div>
          <div className={styles.artistsShape + ' ' + styles.artistsShape2}></div>
          <div className={styles.artistsShape + ' ' + styles.artistsShape3}></div>
          <div className={styles.artistsShape + ' ' + styles.artistsShape4}></div>
        </div>
        <div className={styles.artistsHeader}>
          <motion.h2 
            className={styles.artistsTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Featured Creators
          </motion.h2>
          <motion.p 
            className={styles.artistsSubtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Meet the talented artists behind our most popular designs
          </motion.p>
        </div>

        <div className={styles.artistsGrid}>
          {[
            {
              name: "Sarah Johnson",
              role: "Digital Artist",
              avatar: "/inspiration/e66ea461e14e113f67aa0b34db419404.jpg",
              designs: 156,
              followers: "12.5K",
              preview: "/inspiration/8f012ceef13164d10874500bc3245e97.jpg",
              description: "Specializing in minimalist and geometric patterns",
              tags: ["Minimalist", "Geometric", "Modern"]
            },
            {
              name: "Mike Chen",
              role: "Illustrator",
              avatar: "/inspiration/e66ea461e14e113f67aa0b34db419404.jpg",
              designs: 89,
              followers: "8.2K",
              preview: "/inspiration/18047dbb6494e5d97d6f62af6f31eef8.jpg",
              description: "Creating vibrant, pop-art inspired designs",
              tags: ["Pop Art", "Colorful", "Bold"]
            },
            {
              name: "Emma Davis",
              role: "Photographer",
              avatar: "/inspiration/e66ea461e14e113f67aa0b34db419404.jpg",
              designs: 203,
              followers: "15.7K",
              preview: "/inspiration/78b810f2635b6acf8d44c6b454e18675.jpg",
              description: "Nature and landscape photography expert",
              tags: ["Nature", "Landscape", "Photo  "]
            },
            {
              name: "Alex Rivera",
              role: "Graphic Designer",
              avatar: "/inspiration/e66ea461e14e113f67aa0b34db419404.jpg",
              designs: 124,
              followers: "9.8K",
              preview: "/inspiration/7da75b936527242f951d903feff2940e.jpg",
              description: "Typography and abstract art specialist",
              tags: ["Typography", "Abstract", "Modern"]
            }
          ].map((artist, index) => (
            <motion.div
              key={artist.name}
              className={styles.artistCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <div className={styles.artistPreview}>
                <img src={artist.preview} alt={`${artist.name}'s work`} />
                <div className={styles.artistOverlay}>
                  <div className={styles.artistStats}>
                    <div className={styles.stat}>
                      <span className={styles.statValue}>{artist.designs}</span>
                      <span className={styles.statLabel}>Designs</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statValue}>{artist.followers}</span>
                      <span className={styles.statLabel}>Followers</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.artistContent}>
                <div className={styles.artistHeader}>
                  <img 
                    src={artist.avatar} 
                    alt={artist.name} 
                    className={styles.artistAvatar}
                  />
                  <div className={styles.artistInfo}>
                    <h3 className={styles.artistName}>{artist.name}</h3>
                    <span className={styles.artistRole}>{artist.role}</span>
                  </div>
                </div>
                <p className={styles.artistDescription}>{artist.description}</p>
                <div className={styles.artistTags}>
                  {artist.tags.map((tag, i) => (
                    <span key={i} className={styles.artistTag}>#{tag}</span>
                  ))}
                </div>
                <button className={styles.viewProfileBtn}>
                  View Portfolio
                  <FaArrowRight />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      <div className={styles.featuredSectionWrapper}>
        <div className={styles.featuredSection}>
          <div className={styles.featuredDecoration}>
            <div className={styles.featuredShape1}></div>
            <div className={styles.featuredShape2}></div>
            <div className={styles.featuredShape3}></div>
            <div className={styles.featuredShape4}></div>
            <div className={styles.featuredShape5}></div>
          </div>
          <motion.div 
            className={styles.featuredHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.sectionTitle}>Featured Designs</h2>
            <p className={styles.sectionSubtitle}>Discover our most popular and trending phone case designs, crafted by talented artists from around the world</p>
          </motion.div>
          <div className={styles.sliderNav}>
            <motion.button 
              className={styles.sliderButton} 
              onClick={prevSlide}
              disabled={currentSlide === 0}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <i className="fas fa-chevron-left"></i>
            </motion.button>
            <motion.button 
              className={styles.sliderButton} 
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <i className="fas fa-chevron-right"></i>
            </motion.button>
          </div>
          <motion.div 
            className={styles.cardsGrid} 
            ref={sliderRef}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className={styles.cards} onClick={() => handlePostClick({
              title: "Abstract Harmony",
              artist: "Sarah Johnson",
              image: "https://res.cloudinary.com/daalfrqob/image/upload/v1749667935/blob_iucqwq.png",
              price: 29.99,
              date: "2024-03-15",
              model: "iPhone 14 Pro",
              type: "Slim Case",
              likes: 1200,
              favorites: 856,
              description: "A mesmerizing blend of vibrant colors and fluid shapes that creates a sense of movement and harmony. This design captures the essence of abstract art while maintaining a modern, minimalist aesthetic. Perfect for those who appreciate contemporary art and want to make a bold statement with their phone case.\n\nThe case features a premium matte finish that enhances the colors and provides a comfortable grip. The design is printed using high-quality UV printing technology, ensuring long-lasting vibrancy and durability.",
              tags: ["Abstract", "Modern", "Minimalist", "Colorful", "Artistic"],
              comments: [
                {
                  author: "John Doe",
                  avatar: "/inspiration/e66ea461e14e113f67aa0b34db419404.jpg",
                  text: "Amazing design! Love the colors.",
                  date: "2024-03-16"
                }
              ]
            })}>
              <div className={styles.imgBack}>
                <img className={styles.clearW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1749121893/blob_cgahne.png" alt="Abstract Art" />
                <div className={styles.imageStats}>
                  <div className={styles.statRow}>
                    <button className={styles.statButton} title="Like">
                      <i className="fas fa-heart"></i>
                      <span className={styles.statCount}>1.2k</span>
                    </button>
                    <button className={styles.statButton} title="Save">
                      <i className="fas fa-bookmark"></i>
                      <span className={styles.statCount}>856</span>
                    </button>
                  </div>
                  <div className={styles.price}>$29.99</div>
                </div>
              </div>
              <div className={styles.cardsContent}>
                <h3 className={styles.title}>Abstract Harmony</h3>
                <div className={styles.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles.discprofile_pic} />
                  <span>By Sarah Johnson</span>
                </div>
                <button className={styles.btn5}>Add to Cart - $29.99</button>
              </div>
            </div>

            <div className={styles.cards}>
              <div className={styles.imgBack}>
                <img className={styles.clearW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1738845356/blob_ucogn2.png" alt="Geometric Pattern" />
                <div className={styles.imageStats}>
                  <div className={styles.statRow}>
                    <button className={`${styles.statButton} ${styles.liked}`} title="Liked">
                      <i className="fas fa-heart"></i>
                      <span className={styles.statCount}>2.4k</span>
                    </button>
                    <button className={`${styles.statButton} ${styles.favorited}`} title="Saved">
                      <i className="fas fa-bookmark"></i>
                      <span className={styles.statCount}>1.2k</span>
                    </button>
                  </div>
                  <div className={styles.price}>$34.99</div>
                </div>
              </div>
              <div className={styles.cardsContent}>
                <h3 className={styles.title}>Geometric Harmony</h3>
                <div className={styles.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles.discprofile_pic} />
                  <span>By Mike Chen</span>
                </div>
                <button className={styles.btn5}>Add to Cart - $34.99</button>
              </div>
            </div>

            <div className={styles.cards}>
              <div className={styles.imgBack}>
                <img className={styles.clearW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1749793488/blob_xjnlap.png" alt="Abstract Design" />
              </div>
              <div className={styles.cardsContent}>
                <h3 className={styles.title}>Abstract Waves</h3>
                <div className={styles.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles.discprofile_pic} />
                  <span>By Sarah Johnson</span>
                </div>
                <button className={styles.btn5}>Add to Cart - $29.99</button>
              </div>
            </div>

            <div className={styles.cards}>
              <div className={styles.imgBack}>
                <img className={styles.rubberW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1739123536/blob_kljyhd.png" alt="Geometric Pattern" />
              </div>
              <div className={styles.cardsContent}>
                <h3 className={styles.title}>Geometric Harmony</h3>
                <div className={styles.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles.discprofile_pic} />
                  <span>By Mike Chen</span>
                </div>
                <button className={styles.btn5}>Add to Cart - $34.99</button>
              </div>
            </div>
            <div className={styles.cards}>
              <div className={styles.imgBack}>
                <img className={styles.rubberW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1749667935/blob_iucqwq.png" alt="Geometric Pattern" />
              </div>
              <div className={styles.cardsContent}>
                <h3 className={styles.title}>Geometric Harmony</h3>
                <div className={styles.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles.discprofile_pic} />
                  <span>By Mike Chen</span>
                </div>
                <button className={styles.btn5}>Add to Cart - $34.99</button>
              </div>
            </div>
            <div className={styles.cards}>
              <div className={styles.imgBack}>
                <img className={styles.rubberW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1749667935/blob_iucqwq.png" alt="Geometric Pattern" />
              </div>
              <div className={styles.cardsContent}>
                <h3 className={styles.title}>Geometric Harmony</h3>
                <div className={styles.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles.discprofile_pic} />
                  <span>By Mike Chen</span>
                </div>
                <button className={styles.btn5}>Add to Cart - $34.99</button>
              </div>
            </div>
            <div className={styles.cards}>
              <div className={styles.imgBack}>
                <img className={styles.rubberW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1749667935/blob_iucqwq.png" alt="Geometric Pattern" />
              </div>
              <div className={styles.cardsContent}>
                <h3 className={styles.title}>Geometric Harmony</h3>
                <div className={styles.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles.discprofile_pic} />
                  <span>By Mike Chen</span>
                </div>
                <button className={styles.btn5}>Add to Cart - $34.99</button>
              </div>
            </div>
            <div className={styles.cards}>
              <div className={styles.imgBack}>
                <img className={styles.rubberW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1749667935/blob_iucqwq.png" alt="Geometric Pattern" />
              </div>
              <div className={styles.cardsContent}>
                <h3 className={styles.title}>Geometric Harmony</h3>
                <div className={styles.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles.discprofile_pic} />
                  <span>By Mike Chen</span>
                </div>
                <button className={styles.btn5}>Add to Cart - $34.99</button>
              </div>
            </div>
            <div className={styles.cards}>
              <div className={styles.imgBack}>
                <img className={styles.rubberW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1749667935/blob_iucqwq.png" alt="Geometric Pattern" />
              </div>
              <div className={styles.cardsContent}>
                <h3 className={styles.title}>Geometric Harmony</h3>
                <div className={styles.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles.discprofile_pic} />
                  <span>By Mike Chen</span>
                </div>
                <button className={styles.btn5}>Add to Cart - $34.99</button>
              </div>
            </div>

            <div className={styles.cards}>
              <div className={styles.imgBack}>
                <img className={styles.clearW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1749793488/blob_xjnlap.png" alt="Abstract Design" />
              </div>
              <div className={styles.cardsContent}>
                <h3 className={styles.title}>Ocean Breeze</h3>
                <div className={styles.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles.discprofile_pic} />
                  <span>By Alex Rivera</span>
                </div>
                <button className={styles.btn5}>Add to Cart - $31.99</button>
              </div>
            </div>
          </motion.div>
          <motion.div 
            className={styles.sliderDots}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {[...Array(totalSlides)].map((_, index) => (
              <motion.div
                key={index}
                className={`${styles.dot} ${currentSlide === index ? styles.active : ''}`}
                onClick={() => scrollToSlide(index)}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              />
            ))}
          </motion.div>
        </div>
      </div>


      <section className={styles.benefitsSection}>
        <div className={styles.benefitsDecoration}>
          <div className={styles.benefitsShape1}></div>
          <div className={styles.benefitsShape2}></div>
          <div className={styles.benefitsShape3}></div>
        </div>
        
        <motion.div 
          className={styles.benefitsHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.benefitsTitle}>
            Unlock <span className={styles.highlight2}>Exclusive</span> Benefits
          </h2>
          <p className={styles.benefitsSubtitle}>
            Join our community and enjoy special rewards for your creativity
          </p>
        </motion.div>

        <div className={styles.benefitsGrid}>
          <motion.div 
            className={styles.benefitCard}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.benefitImage}>
              <img src="/inspiration/893b756bfce5669f1cd39e39001234a0.jpg" alt="Early Access" />
              <div className={styles.benefitOverlay}>
                <span className={styles.benefitBadge}>New</span>
              </div>
            </div>
            <div className={styles.benefitContent}>
              <h3>Early Access</h3>
              <p>Be the first to try new features and exclusive designs</p>
              <ul className={styles.benefitList}>
                <li>Preview upcoming collections</li>
                <li>Test new customization tools</li>
                <li>Shape future features</li>
              </ul>
            </div>
          </motion.div>

          <motion.div 
            className={styles.benefitCard}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className={styles.benefitImage}>
              <img src="/inspiration/a9297bfffd3d208ec4dd05fdf8b84e1a.jpg" alt="Rewards Program" />
              <div className={styles.benefitOverlay}>
                <span className={styles.benefitBadge}>Popular</span>
              </div>
            </div>
            <div className={styles.benefitContent}>
              <h3>Rewards Program</h3>
              <p>Earn points for every action and redeem for exclusive perks</p>
              <ul className={styles.benefitList}>
                <li>Points for purchases</li>
                <li>Bonus for referrals</li>
                <li>Special member discounts</li>
              </ul>
            </div>
          </motion.div>

          <motion.div 
            className={styles.benefitCard}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className={styles.benefitImage}>
              <img src="/inspiration/cc74a43b9d2fd92c9af6f9bf9f7c750f.jpg" alt="Community Benefits" />
              <div className={styles.benefitOverlay}>
                <span className={styles.benefitBadge}>Featured</span>
              </div>
            </div>
            <div className={styles.benefitContent}>
              <h3>Community Benefits</h3>
              <p>Connect with fellow creators and grow together</p>
              <ul className={styles.benefitList}>
                <li>Exclusive workshops</li>
                <li>Collaboration opportunities</li>
                <li>Design challenges</li>
              </ul>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className={styles.benefitsCTA}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link href="/signup" className={styles.benefitsButton}>
            Join Now
            <FaArrowRight />
          </Link>
          <p className={styles.benefitsNote}>
            Start earning rewards from your first purchase
          </p>
        </motion.div>
      </section>

      <section className={styles.shippingSection}>
        <div className={styles.shippingHeader}>
          <motion.h2 
            className={styles.shippingTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Shipping & Shopping Info
          </motion.h2>
          <motion.p 
            className={styles.shippingSubtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We make shopping with us easy and secure, with fast shipping and hassle-free returns
          </motion.p>
        </div>

        <div className={styles.shippingGrid}>
          <motion.div 
            className={styles.shippingCard}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className={styles.shippingIcon}>
              <FaPlane />
            </div>
            <h3>Fast Global Shipping</h3>
            <p>Free shipping on orders over $50. International delivery within 5-7 business days.</p>
          </motion.div>

          <motion.div 
            className={styles.shippingCard}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className={styles.shippingIcon}>
              <FaLock />
            </div>
            <h3>Secure Payment</h3>
            <p>Multiple payment options with SSL encryption for your peace of mind.</p>
          </motion.div>

          <motion.div 
            className={styles.shippingCard}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className={styles.shippingIcon}>
              <FaUndo />
            </div>
            <h3>Easy Returns</h3>
            <p>30-day return policy. No questions asked, we make returns simple.</p>
          </motion.div>

          <motion.div 
            className={styles.shippingCard}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className={styles.shippingIcon}>
              <FaMapMarkerAlt />
            </div>
            <h3>Track Your Order</h3>
            <p>Real-time tracking updates from order to delivery at your doorstep.</p>
          </motion.div>
        </div>
      </section>

      <section className={styles.newsletterSection}>
        <div className={styles.newsletterContainer}>
          <div className={styles.newsletterContent}>
            <motion.h2 
              className={styles.newsletterTitle}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Stay Inspired. Never Miss a Drop.
            </motion.h2>
            <motion.p 
              className={styles.newsletterSubtitle}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Be the first to hear about new case designs, artist collabs, and exclusive discounts.
            </motion.p>
          </div>
          <motion.form 
            className={styles.newsletterForm}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onSubmit={(e) => {
              e.preventDefault();
              // Add sparkle effect
              const form = e.currentTarget;
              for (let i = 0; i < 10; i++) {
                const sparkle = document.createElement('div');
                sparkle.className = styles.sparkle;
                sparkle.style.left = `${Math.random() * 100}%`;
                sparkle.style.top = `${Math.random() * 100}%`;
                form.appendChild(sparkle);
                setTimeout(() => sparkle.remove(), 1000);
              }
            }}
          >
            <div className={styles.newsletterInputWrapper}>
              <FaEnvelope className={styles.newsletterIcon} />
              <input 
                type="email" 
                className={styles.newsletterInput}
                placeholder="Enter your email"
                required
              />
            </div>
            <motion.button 
              className={styles.newsletterButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join the Creative Club
            </motion.button>
          </motion.form>
        </div>
      </section>

      {selectedPost && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalLeft}>
              {/* "https://res.cloudinary.com/daalfrqob/image/upload/v1749793488/blob_xjnlap.png"*/}
              <img src={selectedPost.image} alt={selectedPost.title} className={`${styles.postImage} ${styles.postImagerubber}`} />
            </div>
            
            <div className={styles.modalRight}>
              <div className={styles.modalHeader}>
                <h2>{selectedPost.title}</h2>
                <button className={styles.closeButton} onClick={handleCloseModal}>×</button>
              </div>
              
              <div className={styles.modalBody}>
                <div className={styles.creatorInfo}>
                  <div className={styles.creatorHeader}> 
                    <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt={selectedPost.artist} className={styles.creatorAvatar} />
                   {/* */}

                    <div className={styles.creatorDetails}>
                      <span className={styles.creatorName}>{selectedPost.artist}</span>
                      <span className={styles.creatorUsername}>@sarahjohnson</span>
                    </div>
                  </div>
                  <div className={styles.userDescription}>
                    <p className={styles.userDescriptionText}>
                      "This design was inspired by the harmony of geometric shapes and natural elements. I wanted to create something that feels both modern and organic, perfect for those who appreciate minimalist aesthetics with a touch of personality."
                    </p>
                  </div>
                </div>

                <div className={styles.postDescription}>
                  <div className={styles.descriptionHeader}>
                    <h3 className={styles.descriptionTitle}>Case Description</h3>
                  </div>
                  <p className={styles.descriptionText}>{selectedPost.description}</p>

                  <div className={styles.descriptionTags}>
                    {selectedPost.tags.map((tag, index) => (
                      <span key={index} className={styles.tag}>#{tag}</span>
                    ))}
                  </div>
                </div>

                <div className={styles.postInfo}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>
                      <FaCalendarAlt />
                    </div>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Posted on</span>
                      <span className={styles.infoValue}>{selectedPost.date}</span>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>
                      <FaMobile />
                    </div>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Phone Model</span>
                      <span className={styles.infoValue}>{selectedPost.model}</span>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>
                      <FaTag />
                    </div>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Case Type</span>
                      <span className={styles.infoValue}>{selectedPost.type}</span>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>
                      <FaDollarSign />
                    </div>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Price</span>
                      <span className={styles.infoValue}>${selectedPost.price}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.interactionBar}>
                  <button className={`${styles.interactionButton} ${isLiked ? styles.active : ''}`} onClick={handleLike}>
                    {isLiked ? <FaHeart /> : <FaRegHeart />}
                    <span className={styles.interactionCount}>{selectedPost.likes}</span>
                  </button>
                  <button className={`${styles.interactionButton} ${isSaved ? styles.active : ''}`} onClick={handleSave}>
                    {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                    <span className={styles.interactionCount}>{selectedPost.favorites}</span>
                  </button>
                  <button className={styles.addToCartButton}>
                    <FaShoppingCart />
                    Add to Cart - ${selectedPost.price}
                  </button>
                </div>

                <div className={styles.commentsSection}>
                  <div className={styles.commentsHeader}>
                    <h3>Comments</h3>
                    <span className={styles.commentCount}>{selectedPost.comments.length}</span>
                  </div>
                  <form className={styles.commentInput} onSubmit={handleComment}>
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button type="submit">Submit</button>
                  </form>

                  <div className={styles.commentsList}>
                    {selectedPost.comments.map((comment, index) => (
                      <div key={index} className={styles.comment}>
                        <img src={comment.avatar} alt={comment.author} className={styles.commentAvatar} />
                        <div className={styles.commentContent}>
                          <div className={styles.commentHeader}>
                            <span className={styles.commentAuthor}>{comment.author}</span>
                            <span className={styles.commentDate}>{comment.date}</span>
                          </div>
                          <p className={styles.commentText}>{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}