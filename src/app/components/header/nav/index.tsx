import React, { useState, useEffect } from 'react'
import styles from './style.module.scss';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { menuSlide, slide } from '../anim';
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
  activeSection: string;
}

export default function Index({ onClose, activeSection }: NavProps) {

  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(activeSection);

  useEffect(() => {
    setSelectedIndicator(activeSection);
  }, [activeSection]);

  return (
    <motion.div variants={menuSlide} initial="initial" animate="enter" exit="exit" className={styles.menu}>
       <div className={styles.body}>
            <div onMouseLeave={() => {setSelectedIndicator(activeSection)}} className={styles.nav}>
                    <div className={styles.header}>
                        <p>Menu</p>
                    </div>
                    {
                      navItems.map( (data, index) => {
                        const linkEl = (
                          <Link key={index} data={{...data, index}} isActive={selectedIndicator == data.href} setSelectedIndicator={setSelectedIndicator} onClose={onClose} />
                        );

                        const subHref =
                          data.href === '/#events' && pathname.startsWith('/events') ? '/events' :
                          data.href === '/#works'  && pathname.startsWith('/works')  ? '/works'  :
                          null;

                        if (subHref) {
                          const subLabel = subHref === '/events' ? 'all events' : 'all works';
                          return (
                            <React.Fragment key={index}>
                              {linkEl}
                              <motion.div
                                custom={index + 0.5}
                                variants={slide}
                                initial="initial"
                                animate="enter"
                                exit="exit"
                                style={{ paddingLeft: 36, marginTop: -4 }}
                              >
                                <a
                                  href={subHref}
                                  onClick={onClose}
                                  style={{
                                    fontFamily: "'Space Mono', monospace",
                                    fontSize: 15,
                                    fontStyle: 'italic',
                                    letterSpacing: '.1em',
                                    color: 'var(--rs-slate3)',
                                  }}
                                >
                                  ↳ {subLabel}
                                </a>
                              </motion.div>
                            </React.Fragment>
                          );
                        }

                        return linkEl;
                      })
                    }
            </div>
            <Footer />
        </div>
        <Curve />
    </motion.div>
  )
}
