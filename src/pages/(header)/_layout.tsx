import { Outlet } from 'react-router-dom'
import Header from '../../components/Header/Header'
import { useState } from 'react';

export default function Layout() {
  const [headerIsVisible, setHeaderIsVisible] = useState(true);

  return (
    <>
      <Header isVisible={headerIsVisible} setIsVisible={setHeaderIsVisible} />
      <Outlet />
    </>
  )
}
