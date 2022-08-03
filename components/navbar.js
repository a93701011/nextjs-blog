import navStyles from './navbar.module.css';
import Link from 'next/link';

export default function Navbar({name}) {
    return (
<div className={navStyles.topnav}>
        <name>{name}</name>
        <input id="menu-toggle" className={navStyles.menutoggle} type="checkbox" />
        <label className={navStyles.menubuttoncontainer} for="menu-toggle">
          <div className={navStyles.menubutton}></div>
        </label>
        <ul className={navStyles.menu}>
          <li> <Link href="/"><a>Work</a></Link></li>
          <li> <Link href="/about"><a>About</a></Link></li>
          <li> <Link href="/art"><a>Art</a></Link></li>
        </ul>
      </div>
    )}