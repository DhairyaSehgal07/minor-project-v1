import { useState } from "react";
import { Link } from "react-router-dom";

const LandingScreen = () => {
  const [showModal, setShowModal] = useState(false);

  const handleSignUpClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <main className="mx-auto my-8 max-w-80 md:max-w-7xl">
        <div className="mx-auto w-full border-4 text-center md:w-[60%]">
          <div className="m-8 p-2">
            <h1 className="m-4 text-2xl md:text-4xl">Welcome User!!</h1>
            <h2 className="text-xl">
              {" This is the landing screen for cold-storage-app."}
            </h2>

            <ul className="m-4 list-disc p-4 text-left md:text-xl lg:ml-44 ">
              <li>Register</li>
              <li>Login</li>
              <li>View profile details</li>
              <li>Update profile details</li>
            </ul>

            <h2 className="text-lg md:text-2xl">
              {" Get started by signing up or logging in"}
            </h2>
            <div className="m-8 flex flex-col justify-center gap-8 md:flex-row md:gap-14">
              <button
                onClick={handleSignUpClick}
                className="rounded-lg bg-gray-800 px-8 py-2 text-white shadow-lg md:text-lg"
              >
                {"Sign up"}
              </button>

              <Link to="/farmer/login">
                <button className="rounded-lg bg-gray-800 px-8 py-2 text-white shadow-lg md:text-lg">
                  {"Sign in"}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white w-[50%] p-8 rounded-lg relative">
            {/* Close icon */}
            <button
              onClick={closeModal}
              className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {/* Modal content */}
            <div className="flex gap-16 justify-center items-center">
              <section className="p-4">
                <div className="flex flex-col justify-center items-center">
                  <h1 className="text-3xl">Are you a farmer ?</h1>
                  <p className="text-lg my-2 tracking-wide ">
                    By registering as a farmer, you will be able to see nearby
                    cold storage owners and you can choose where you want to
                    store your crop.
                  </p>
                  <Link to="/farmer/register">
                    <button className="rounded-lg mt-2 bg-gray-800 px-8 py-2 text-white shadow-lg md:text-lg">
                      {"Register as farmer"}
                    </button>
                  </Link>
                </div>
              </section>
              <section>
                <div className="border-r border-2 border-gray-400 h-56"></div>
              </section>
              <section className="p-4">
                <div className="flex flex-col justify-center items-center">
                  <h1 className="text-3xl">Are you a store-owner? </h1>
                  <p className="text-lg my-2 tracking-wide">
                    By registering as a store-owner, you will be able to see the
                    requests from different farmers who want to store the crop
                    in your storage.
                  </p>
                  <Link to="/store-admin/register">
                    <button className="rounded-lg bg-gray-800 px-8 py-2 mt-2 text-white shadow-lg md:text-lg">
                      {"Register as owner"}
                    </button>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LandingScreen;
