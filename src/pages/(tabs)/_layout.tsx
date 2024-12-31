import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Header from '../../components/Header/Header'
import TabSelection from '../../components/TabSelection/TabSelection'
import { TAB_SELECTION_HEIGHT } from '../../domains/ui/tabs'

export default function Layout() {
  const [headerIsVisible, setHeaderIsVisible] = useState(true);

  return (
    <>
      <Header isVisible={headerIsVisible} setIsVisible={setHeaderIsVisible} />
      <div className={`h-${TAB_SELECTION_HEIGHT} hidden md:block`}></div>{/* Use the space for tabs at the top for md+ */}
      <div className='min-h-[calc(100vh-128px)] p-2'>
        <Outlet />
      </div>
      <TabSelection headerIsVisible={headerIsVisible} />
      <div className={`h-${TAB_SELECTION_HEIGHT} md:hidden`}></div>{/* Use the space for tabs at the bottom for <md */}
    </>
  )
}
