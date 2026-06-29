"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const SECTION_MAP = [
  { prefix: '/cadastrodoador', section: 'green'  },
  { prefix: '/doacao',         section: 'orange' },
  { prefix: '/estoque',        section: 'red'    },
  { prefix: '/retirada',       section: 'red'    },
];

export default function SectionTheme() {
  const pathname = usePathname();

  useEffect(() => {
    const match = SECTION_MAP.find(s => pathname?.startsWith(s.prefix));
    document.documentElement.setAttribute('data-section', match?.section ?? 'blue');
  }, [pathname]);

  return null;
}
