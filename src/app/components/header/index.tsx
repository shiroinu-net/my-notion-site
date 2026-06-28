'use client'
import styles from './style.module.scss'
import { useEffect, useState } from 'react';
import Nav from './nav';
import { AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const sectionIds = ['top', 'profile', 'events', 'works', 'contact'] as const;
const sectionHrefs: Record<string, string> = {
  top: '/',
  profile: '/#profile',
  events: '/#events',
  works: '/#works',
  contact: '/#contact',
};

function getActiveSectionFromPathname(pathname: string): string {
  if (pathname.startsWith('/events')) return '/#events';
  if (pathname.startsWith('/works')) return '/#works';
  return pathname;
}

export default function Header() {

  const [isActive, setIsActive] = useState(false);
  const [activeSection, setActiveSection] = useState('/');
  const pathname = usePathname();

  useEffect(() => {
    if (isActive) setIsActive(false);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== '/') {
      setActiveSection(getActiveSectionFromPathname(pathname));
      return;
    }

    const handleScroll = () => {
      const threshold = window.innerHeight * 0.4;
      let current = '/';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= threshold) {
          current = sectionHrefs[id];
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return (
    <>
    <div className={styles.main}>

      <div className={styles.header}>
        <div onClick={() => {setIsActive(!isActive)}} className={styles.button}>
          <div className={`${styles.burger} ${isActive ? styles.burgerActive : ""}`}></div>
        </div>
      </div>

    </div>
    <AnimatePresence mode="wait">
      {isActive && <Nav activeSection={activeSection} onClose={() => setIsActive(false)} />}
    </AnimatePresence>
    </>
  )
}
