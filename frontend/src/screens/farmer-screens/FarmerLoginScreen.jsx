import { useState } from "react";
import { Link } from "react-router-dom";

const FarmerLoginScreen = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("Submit handler running");
  };

  const handleRegisterClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <main className="mx-auto my-8 max-w-80 md:max-w-7xl">
        <Link to="/">
          <h1 className="text-md my-4 ml-4 inline-block rounded-lg bg-gray-800 px-2 py-1 text-white   md:text-2xl ">
            Go Back
          </h1>
        </Link>
        <div className="mx-auto w-full border-4 md:w-[60%]">
          <form onSubmit={submitHandler} className="m-2 mx-auto p-2 md:p-10">
            <h1 className="text-2xl font-medium">Login here</h1>
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              <div className="sm:col-span-6 sm:ml-1">
                <label
                  htmlFor="mobile"
                  className="text-md block font-medium leading-6 text-gray-900"
                >
                  Mobile Number
                </label>

                <div className="mt-2">
                  <input
                    type="tel"
                    name="mobile"
                    id="mobile"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    autoComplete="tel"
                    maxLength="10"
                    className="block w-full flex-1 rounded-md  border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Enter your mobile number"
                  />
                </div>
              </div>

              <div className="sm:col-span-6 sm:ml-1">
                <label
                  htmlFor="password"
                  className="text-md block font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="password"
                    className="block w-full flex-1 rounded-md  border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <div className="mt-6">
                <button
                  type="submit"
                  className="rounded-lg bg-gray-800 px-8 py-2 text-white shadow-lg md:text-lg"
                >
                  {"Sign in"}
                </button>
              </div>
            </div>

            <div className="sm:col-span-4 flex justify-between items-center">
              <div className="mt-2 ml-1">
                <h2 className="text-md">Not a user ? </h2>
                <button className="text-md" onClick={handleRegisterClick}>
                  Register
                </button>
              </div>
              <div>
                <Link to="/farmer/forgot-password">
                  <button className="text-md">Forgot Password?</button>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          {/* Modal content */}
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

export default FarmerLoginScreen;
