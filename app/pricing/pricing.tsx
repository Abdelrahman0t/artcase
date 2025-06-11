"use client";
import Layout from "../fyp/layout";
import styles from "./pricing.module.css";

export default function Pricing() {
    return (
        <Layout>
            <div className={styles.pricingContainer}>
                <h1 className={styles.heading}>Choose the Perfect Plan for You</h1>
                <p className={styles.subheading}>
                    Start your creative journey today with a plan that fits your needs!
                </p>
                <div className={styles.cardsContainer}>
                    {[
                        {
                            title: "Basic Plan",
                            description: "Perfect for individuals starting out.",
                            features: [
                                "1 Phone Case Design",
                                "Standard Shipping",
                                "Basic Support",
                                "Access to Design Templates",
                                "Community Forum Access",
                                "Monthly Design Challenges",
                                "Basic Photo Filters",
                            ],
                            price: "9.99DZ/month",
                            buttonText: "Get Started",
                            icon: "/icons/basic-icon.png",
                        },
                        {
                            title: "Pro Plan",
                            description: "Great for hobbyists and enthusiasts.",
                            features: [
                                "3 Phone Case Designs",
                                "Priority Shipping",
                                "Priority Support",
                                "Exclusive Design Tutorials",
                                "Access to Premium Templates",
                                "Advanced Photo Editing Tools",
                                "Early Access to New Features",
                                "Monthly Giveaways",
                            ],
                            price: "19.99DZ/month",
                            buttonText: "Choose Pro",
                            icon: "/icons/pro-icon.png",
                        },
                        {
                            title: "Premium Plan",
                            description: "Ideal for businesses or creators.",
                            features: [
                                "Unlimited Phone Case Designs",
     
                                "VIP Support",

                                "Lifetime Access to New Features",
                                "Custom Branding Options",
                                "Access to Exclusive Collaborations",
                                "Personalized Marketing Assistance",
                            ],
                            price: "49.99DZ/month",
                            buttonText: "Go Premium",
                            icon: "/icons/premium-icon.png",
                        },
                    ].map((plan, index) => (
                        <div key={index} className={styles.card}>
                            <div
                                className={styles.icon}
                                style={{
                                    backgroundImage: `url(${plan.icon})`,
                                }}
                            ></div>
                            <h2 className={styles.title}>{plan.title}</h2>
                            <p className={styles.description}>{plan.description}</p>
                            <ul className={styles.features}>
                                {plan.features.map((feature, idx) => (
                                    <li key={idx}>{feature}</li>
                                ))}
                            </ul>
                            <p className={styles.price}>{plan.price}</p>
                            <button className={styles.button}>{plan.buttonText}</button>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
