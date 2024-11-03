import { Outlet } from 'react-router-dom'
import Header from '../../components/Header/Header'
import TabSelection from '../../components/TabSelection/TabSelection'
import { TAB_SELECTION_HEIGHT } from '../../constants/Tabs'
import { useState } from 'react';

export default function Layout() {
  const [headerIsVisible, setHeaderIsVisible] = useState(true);

  return (
    <>
      <Header isVisible={headerIsVisible} setIsVisible={setHeaderIsVisible} />
      <div className={`h-${TAB_SELECTION_HEIGHT} hidden md:block`}></div>
      <Outlet />
      <TabSelection headerIsVisible={headerIsVisible} />
      <div className={`${TAB_SELECTION_HEIGHT} md:hidden`}></div>
    </>
  )
}
