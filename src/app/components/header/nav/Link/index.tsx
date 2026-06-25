import styles from './style.module.scss';
import { motion } from 'framer-motion';
import { slide, scale } from '../../anim';

interface Props {
  data: {
    title: string;
    href: string;
    index: number;
  };
  isActive: boolean;
  setSelectedIndicator: (href: string) => void;
  onClose: () => void;
}

const basePath = process.env.NODE_ENV === 'production' ? '/my-notion-site' : '';

export default function Index({data, isActive, setSelectedIndicator, onClose}: Props) {

    const { title, href, index} = data;
    const fullHref = `${basePath}${href}`;

    return (
      <motion.div className={styles.link} onMouseEnter={() => {setSelectedIndicator(href)}} custom={index} variants={slide} initial="initial" animate="enter" exit="exit">
        <motion.div variants={scale} animate={isActive ? "open" : "closed"} className={styles.indicator}></motion.div>
        <a href={fullHref} onClick={onClose}>{title}</a>
      </motion.div>
    )
  }
