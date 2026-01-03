import Link from 'next/link';

export default function Footer({ lang }: { lang: string }) {
  return (
    <footer className="bg-amina-white border-t border-amina-beige/50 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center">
        
        <h2 className="text-xl font-serif font-bold tracking-widest mb-6">AMINA</h2>
        
        <nav className="flex gap-6 mb-8 text-xs uppercase tracking-widest text-amina-muted">
          <Link href={`/${lang}/collection`}>Collection</Link>
          <Link href={`/${lang}/about`}>Brand Story</Link>
          <Link href={`/${lang}/contact`}>Customer Care</Link>
        </nav>

        <p className="text-[10px] text-amina-muted uppercase tracking-wide">
          © {new Date().getFullYear()} AMINA Clothing Brand.
        </p>
      </div>
    </footer>
  );
}