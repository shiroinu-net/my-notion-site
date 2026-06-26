import React, { useState } from 'react'
import styles from './style.module.scss';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { menuSlide } from '../anim';
import Link from './Link';
import Curve from './Curve';
import Footer from './Footer';

const navItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Profile",
    href: "/#profile",
  },
  {
    title: "Events",
    href: "/#events",
  },
  {
    title: "Works",
    href: "/#works",
  },
  {
    title: "Contact",
    href: "/#contact",
  },
]

interface NavProps {
  onClose: () => void;
}

export default function Index({ onClose }: NavProps) {

  const pathname = usePathname();
  const getCurrentHref = () => {
    if (typeof window !== 'undefined' && window.location.hash) {
      return pathname + window.location.hash;
    }
    return pathname;
  };
  const [selectedIndicator, setSelectedIndicator] = useState(getCurrentHref);

  return (
    <motion.div variants={menuSlide} initial="initial" animate="enter" exit="exit" className={styles.menu}>
       <div className={styles.body}>
            <div onMouseLeave={() => {setSelectedIndicator(getCurrentHref())}} className={styles.nav}>
                    <div className={styles.header}>
                        <p>Menu</p>
                    </div>
                    {
                      navItems.map( (data, index) => {
                        return <Link key={index} data={{...data, index}} isActive={selectedIndicator == data.href} setSelectedIndicator={setSelectedIndicator} onClose={onClose}></Link>
                      })
                    }
            </div>
            <Footer />
        </div>
        <Curve />
    </motion.div>
  )
}
