"use client";
import Layout from '../fyp/layout';
/*
import styles from '../fyp/fyp.module.css';
*/
import styles from './about.module.css'
export default function About(){
    return(
        <>
        <Layout>
        <div className={`${styles.intro} d-flex align-items-start`}>

<div className={styles.textContent}>
    <h1 className="mb-3">
      GET TO KNOW THE<span style={{color : 'var(--thirdColor)'}} > ARTCASE </span> TEAM AND JOURNEY
    </h1>

    <h2 >
    At ArtCase, we believe your phone case is more than just protection—it's an expression of your personality. 
    Our platform empowers you to design, customize, and discover unique phone cases that reflect your style, passions, and creativity.
    </h2>


    </div>
    <div className='col-3 d-flex align-items-start' style={{height : '200px'}}>
  
    <div className="col-3 d-flex align-items-start" style={{ height: '200px' }}>

</div>


    </div>
    </div>
       
        <div className={styles.secaboutcont}>
        <h1 style={{width : "100%",textAlign : "center", color : 'var(--secondColor)'}}>ABOUT US</h1>
             <div className={`${styles.sec1} d-flex  justify-content-between align-items-center `}  >
             
                <div  className={styles.text1}>
                  
                  <h1 style={{textAlign : 'center',color : 'rgb(255, 255, 255)'}} className='mb-3'>Who Are We</h1>
                  <h3 >Discover multible Of Defferant Cases That May Help You Create Your Own Mood, Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nisi itaque reprehenderit, voluptatem id quae soluta atque voluptatum hic est praesentium inventore quo odit nostrum labore aliquid accusamus totam maiores. Blanditiis?</h3>
                 
                  </div>
                  <div className={styles.image_wrapper}>
    <img

      src="/TheStyle/15c4b5ac0660b6d0ec007d91cd78f726.jpg"
      alt="About Us"
    />
  </div>
  

            </div>


            <div className={`${styles.sec1} d-flex  justify-content-between align-items-center `}  >
            <div className={styles.image_wrapper2}>
<img


src="/TheStyle/34c2af97c0eb6d9f627cdc2dc564a06b.jpg"
alt="About Us"
/>
</div>

<div  className={styles.text2}>
<h1 style={{textAlign : 'center',color : 'white'}} className='mb-3'>What Is Our Purpose</h1>
  <h3 >Discover multible Of Defferant Cases That May Help You Create Your Own Mood, Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nisi itaque reprehenderit, voluptatem id quae soluta atque voluptatum hic est praesentium inventore quo odit nostrum labore aliquid accusamus totam maiores. Blanditiis?</h3>
 
  </div>



</div>
</div>

<div style={{marginTop:"50px"}}>
<h1 style={{width : "100%",textAlign : "center", color : 'var(--secondColor)'}}>OUR TEAM</h1>
<div className={styles.team}>


  <div className={`${styles.teamCard} `}>
     <img src="TheStyle/photo_2025-05-21_16-15-38.jpg" alt="" />

   <div className={styles.teamdesc}>
    <h2>Mohammed</h2>
    <h4>Designing Team Leader</h4>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis magnam fuga saepe voluptates explicabo sequi quia, provident doloribus! Beatae iusto, consequatur iure vitae officia ipsa quas accusantium est eius ipsum!</p>

   </div>
   <div className={styles.icone}>
   <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-linkedin"></i>
  </a>

  {/* Instagram */}
  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-instagram"></i>
  </a>

  {/* Facebook */}
  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-facebook" ></i>
  </a>

  {/* Gmail */}
  <a href="mailto:your-email@gmail.com" target="_blank" rel="noopener noreferrer">
    <i className="fas fa-envelope"></i>
  </a>
   </div>
  </div>


  <div className={`${styles.teamCard}`}>
    <img src="TheStyle/photo_2025-05-21_16-15-32.jpg" alt="" />

  <div className={styles.teamdesc}>
    <h2>Abdelrahman</h2>
    <h4>Sails Team Leader</h4>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis magnam fuga saepe voluptates explicabo sequi quia, provident doloribus! Beatae iusto, consequatur iure vitae officia ipsa quas accusantium est eius ipsum!</p>

  </div>
  <div className={styles.icone}>
   <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-linkedin"></i>
  </a>

  {/* Instagram */}
  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-instagram"></i>
  </a>

  {/* Facebook */}
  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-facebook" ></i>
  </a>

  {/* Gmail */}
  <a href="mailto:your-email@gmail.com" target="_blank" rel="noopener noreferrer">
    <i className="fas fa-envelope"></i>
  </a>
   </div>

  </div>


  <div className={`${styles.teamCard} `}>
  <img src="TheStyle/photo_2025-05-21_16-15-34.jpg" alt="" />
  <div className={styles.teamdesc}>
    <h2>Hanaan</h2>
    <h4>Marketing Team Leader</h4>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis magnam fuga saepe voluptates explicabo sequi quia, provident doloribus! Beatae iusto, consequatur iure vitae officia ipsa quas accusantium est eius ipsum!</p>
  </div>

  <div className={styles.icone}>
   <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-linkedin"></i>
  </a>

  {/* Instagram */}
  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-instagram"></i>
  </a>

  {/* Facebook */}
  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-facebook" ></i>
  </a>

  {/* Gmail */}
  <a href="mailto:your-email@gmail.com" target="_blank" rel="noopener noreferrer">
    <i className="fas fa-envelope"></i>
  </a>
   </div>
  </div>


  <div className={`${styles.teamCard} `}>
  <img src="TheStyle/photo_2025-05-21_16-15-36.jpg" alt="" />
  <div className={styles.teamdesc}>
    <h2>Adham</h2>
    <h4>Tech Team Leader</h4>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis magnam fuga saepe voluptates explicabo sequi quia, provident doloribus! Beatae iusto, consequatur iure vitae officia ipsa quas accusantium est eius ipsum!</p>

  </div>

  <div className={styles.icone}>
   <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-linkedin"></i>
  </a>

  {/* Instagram */}
  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-instagram"></i>
  </a>

  {/* Facebook */}
  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-facebook" ></i>
  </a>

  {/* Gmail */}
  <a href="mailto:your-email@gmail.com" target="_blank" rel="noopener noreferrer">
    <i className="fas fa-envelope"></i>
  </a>
   </div>
  </div>


</div>

</div>

        </Layout>
        </>
    )
}