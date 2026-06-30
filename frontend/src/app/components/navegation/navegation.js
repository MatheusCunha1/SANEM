"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './navegation.module.css';
import { FaHome, FaUserPlus, FaBoxes, FaHandHoldingHeart, FaUsers, FaChartBar, FaCog, FaUser, FaQuestionCircle, FaShoppingCart, FaIdCard, FaGift } from 'react-icons/fa';
import SectionTheme from './SectionTheme';

const menuItems = [
  { label: 'Home',          href: '/home',                    icon: <FaHome />,            color: 'blue'   },
  { label: 'Estoque',       href: '/estoque',                 icon: <FaBoxes />,           color: 'red'    },
  { label: 'Retirada',      href: '/retirada',                icon: <FaShoppingCart />,    color: 'red'    },
  { label: 'Doações',       href: '/doacao',                  icon: <FaGift />,            color: 'orange' },
  { label: 'Doadores',      href: '/cadastrodoador/lista',    icon: <FaHandHoldingHeart />,color: 'green'  },
  { label: 'Beneficiários', href: '/cadastrobeneficiario/lista', icon: <FaUsers />,        color: 'blue'   },
];

const otherItems = [
  { label: 'Cartões',       href: '/cartoes',       icon: <FaIdCard />,       color: 'blue'  },
  { label: 'Relatórios',    href: '/relatorios',    icon: <FaChartBar />,     color: 'blue'  },
  { label: 'Configurações', href: '/configuracoes', icon: <FaCog />,          color: 'blue'  },
  { label: 'Usuários',      href: '/usuarios',      icon: <FaUser />,         color: 'blue'  },
  { label: 'Ajuda',         href: '/ajuda',         icon: <FaQuestionCircle />, color: 'blue'},
];

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === '/home') return pathname === '/home';
    const base = href.replace('/lista', '');
    return pathname?.startsWith(base);
  };

  const renderItem = ({ label, href, icon, color }) => (
    <Link
      key={href}
      href={href}
      className={`${styles.menuItem} ${isActive(href) ? `${styles.active} ${styles[`active_${color}`]}` : ''}`}
    >
      {icon} {label}
    </Link>
  );

  return (
    <>
    <SectionTheme />
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <Image src="/logo-sanem.svg" alt="Sanem" width={80} height={80} />
        <div className={styles.logoText}></div>
      </div>
      <div className={styles.sectionTitle}>MENU</div>
      <nav className={styles.menuSection}>
        {menuItems.map(renderItem)}
      </nav>
      <div className={styles.sectionTitle}>OTHERS</div>
      <nav className={styles.menuSection}>
        {otherItems.map(renderItem)}
      </nav>
    </aside>
    </>
  );
}
