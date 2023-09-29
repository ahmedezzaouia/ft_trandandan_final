import { useState } from "react";


export default function CreateChannal() {
  const [showModal, setShowModal] = useState(false);


  return (
    <div>
      <button className="" onClick={() => setShowModal(true)}>
        <svg
          className="fill-current h-4 w-4 opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2v4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
        </svg>
      </button>

      {showModal && (
        <div className=" fixed inset-0 flex items-center justify-center z-50 ml-96">
          <div className="bg-slate-800 rounded-2xl p-5 w-96">
            <span className="font-bold text-white "> Name of channel</span>
            <div className="flex items-center justify-between">
              <input type="text" 
                placeholder="name of channel"
                className="bg-slate-900 w-full my-5 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800"
              />
            </div>

              {/* type of channel */}
              <div className="flex items-center">
                <div className="mx-5">
                  <input type="radio" name="type" value="public" />
                  <label  className="text-white">Public</label>
                </div>
                <div>
                  <input type="radio" name="type" value="private" />
                  <label  className="text-white">Private</label>
                </div>
                <div>
                  <input type="radio" name="type" value="protected" />
                  <label  className="text-white">Protected</label>
                </div>
              </div>
                <div className="flex justify-end mt-5">
                  <button
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg mr-2"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg"
                    onClick={() => setShowModal(false)}  
                  >
                    Save

                  </button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}
