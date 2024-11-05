import { useModals } from "../router"

export default function Self() {
  const modals = useModals()

  return (
    <div className={`fixed inset-0 z-50 flex`}>
      {/* Backdrop */}
      <div
        onClick={() => { modals.close() }}
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity opacity-100`}
      ></div>

      {/* Modal Content */}
      <div
        className={`fixed right-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out translate-x-0`}
      >
        {/* Close Button */}
        <button
          onClick={() => { modals.close() }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          &times;
        </button>

        {/* Modal Header */}
        <h2 className="text-lg font-semibold p-6 border-b border-gray-200">Menu</h2>

        {/* Modal Body */}
        <div className="p-6 text-gray-700">Other stuff</div>
      </div>
    </div>
  )
}