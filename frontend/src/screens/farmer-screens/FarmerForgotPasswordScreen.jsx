import { useState } from "react";
import { Link } from "react-router-dom";

const FarmerForgotPasswordScreen = () => {
  const [mobileNumber, setMobileNumber] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("Submit handler running");
  };
  return (
    <>
      <main className=" mx-auto  my-8  max-w-80 md:max-w-7xl">
        <Link to="/farmer/login">
          <h1 className="text-md my-4 ml-4 inline-block rounded-lg bg-gray-800 px-2 py-1 text-white   md:text-2xl ">
            Go Back
          </h1>
        </Link>
        <div className=" mx-auto  w-full border-4 md:w-[60%]">
          <form onSubmit={submitHandler} className="m-2 mx-auto p-2 md:p-10">
            <h1 className="text-2xl font-medium">Enter your phone number</h1>
            <p className="mt-2  tracking-wide">
              We will find your phone number in our database , if your profile
              exists then a link will be sent to that mobile number to reset
              your password
            </p>
            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
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
            </div>
            <button
              type="submit"
              onClick={submitHandler}
              className="rounded-lg ml-1 bg-gray-800 mt-4 px-8 py-2 text-white shadow-lg md:text-lg"
            >
              {"Submit"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default FarmerForgotPasswordScreen;
