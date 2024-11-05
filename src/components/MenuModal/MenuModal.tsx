import { observer } from "mobx-react-lite";

export function MenuModalContentComponent() {
  return (
    <>
      {/* Modal Header */}
      <h2 className="text-lg font-semibold p-6 border-b border-gray-200">Menu</h2>

      {/* Modal Body */}
      <div className="p-6 text-gray-700">Other stuff</div>
    </>
  )
}

const MenuModalContent = observer(() => {
  return <MenuModalContentComponent />
});

export default MenuModalContent;
