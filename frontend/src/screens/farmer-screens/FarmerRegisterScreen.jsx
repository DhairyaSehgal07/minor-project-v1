import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState(["", "", "", ""]);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [image, setImage] = useState("");

  const handleChange = (index, value) => {
    const newOtp = [...phoneOtp];
    newOtp[index] = value;
    setPhoneOtp(newOtp);
    // Move focus to the next input field after entering a digit
    if (index < phoneOtp.length - 1 && value !== "") {
      document.getElementById(`phoneotp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move focus to the previous input field if the Backspace key is pressed on an empty input field
    if (e.key === "Backspace" && index > 0 && phoneOtp[index] === "") {
      document.getElementById(`phoneotp-${index - 1}`).focus();
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("Submit handler running");
  };

  const handlePhoneVerifyClick = () => {
    console.log("verify phone clicked");
    setShowPhoneOtp(true);
  };

  const handlePhoneOtpSubmit = () => {
    const otpString = phoneOtp.join(""); // Merge the digits into a single string
    console.log(otpString);

    if (otpString === "5678") {
      console.log("Phone verification successful");
      setIsPhoneVerified(true);
      setShowPhoneOtp(false);
    } else {
      setIsPhoneVerified(false);
      alert("The entered phone OTP is wrong. Please try again!");
      console.error("Wrong phone OTP entered");
    }
  };

  const handlePhoneOtpNotReceived = () => {
    console.log("phone otp not received");
  };

  useEffect(() => {
    if (
      name.length > 0 &&
      address.length > 0 &&
      password.length > 0 &&
      confirmPassword.length > 0 &&
      isPhoneVerified
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [name, address, password, confirmPassword, isPhoneVerified]);

  const submitImage = () => {
    const data = new FormData();
    data.append("file", image);
  };

  return (
    <>
      <main className=" mx-auto  my-8  max-w-80 md:max-w-7xl ">
        <Link to="/">
          <h1 className="text-md my-4 ml-4 inline-block rounded-lg bg-gray-800 px-2 py-1 text-white   md:text-2xl ">
            Go Back
          </h1>
        </Link>
        <div className=" mx-auto  w-full border-4 md:w-[60%]">
          <form onSubmit={submitHandler} className="m-2 mx-auto p-2 md:p-10 ">
            <h1 className="text-2xl font-medium">Register here</h1>
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              <div className=" sm:col-span-6 sm:ml-1 ">
                <label
                  htmlFor="name"
                  className="text-md block font-medium leading-6 text-gray-900"
                >
                  Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    className="block w-full flex-1 rounded-md  border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Enter your name "
                  />
                </div>
              </div>

              <div className=" sm:col-span-6 sm:ml-1 ">
                <label
                  htmlFor="address"
                  className="text-md block font-medium leading-6 text-gray-900"
                >
                  Address
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    autoComplete="address"
                    className="block w-full flex-1 rounded-md  border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Enter your Home address"
                  />
                </div>
              </div>

              <div className="sm:col-span-6 sm:ml-1">
                <label
                  htmlFor="mobile"
                  className="text-md block font-medium leading-6 text-gray-900"
                >
                  Mobile Number
                </label>
                <p>(Please verify your mobile Number before proceeding)</p>
                <div className="mt-2">
                  <input
                    type="tel"
                    name="mobile"
                    id="mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    autoComplete="tel"
                    maxLength="10"
                    className="block w-full flex-1 rounded-md  border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Enter your mobile number"
                  />
                </div>

                <button
                  onClick={handlePhoneVerifyClick}
                  disabled={mobile.length !== 10} // Disable button if mobile number length is not 10
                  className={`p-2 rounded-md mt-4 shadow-md ${
                    mobile.length !== 10 && "opacity-50 cursor-not-allowed"
                  } ${
                    isPhoneVerified ? "bg-green-500 text-white" : "bg-gray-300"
                  }`}
                  type="button"
                >
                  {isPhoneVerified ? "Phone Verified" : "Verify Phone"}
                </button>

                {showPhoneOtp && (
                  <>
                    <div className="sm:col-span-6 sm:ml-1">
                      <p>
                        A 4 digit otp has been sent to <strong>{mobile}</strong>
                      </p>

                      <div className="  flex gap-4">
                        <div>
                          {phoneOtp.map((digit, index) => (
                            <input
                              key={index}
                              id={`phoneotp-${index}`}
                              type="text"
                              maxLength="1"
                              autoComplete="off"
                              className="border-2 w-10 m-1 mt-4 h-10 text-center"
                              value={digit}
                              onChange={(e) =>
                                handleChange(index, e.target.value)
                              }
                              onKeyDown={(e) => handleKeyDown(index, e)}
                            />
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={handlePhoneOtpSubmit}
                          className="bg-gray-600 text-white p-2 h-[50%] mt-4  rounded-md shadow-md"
                        >
                          submit
                        </button>
                      </div>

                      <br></br>
                      <button
                        type="button"
                        onClick={handlePhoneOtpNotReceived}
                        className="text-blue-600 "
                      >
                        Did not receive otp?
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="sm:col-span-6 sm:ml-1">
                <label
                  htmlFor="profilePhoto"
                  className="text-md block font-medium leading-6 text-gray-900"
                >
                  Select Profile Photo
                </label>
                <div className="mt-2 flex items-center">
                  <input
                    type="file"
                    id="profilePhoto"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="mr-2"
                  />
                  <button onClick={submitImage}></button>
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

              <div className="sm:col-span-6 sm:ml-1">
                <label
                  htmlFor="confirmpassword"
                  className="text-md block font-medium leading-6 text-gray-900"
                >
                  Confirm Password
                </label>
                <div className="mt-2">
                  <input
                    type="password"
                    name="confirmpassword"
                    id="confirmpassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="confirmpassword"
                    className="block w-full flex-1 rounded-md  border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              {/* {isLoading && <Loader />} */}

              <div className="sm:col-span-4">
                <div className="mt-2">
                  <button
                    type="submit"
                    className={`rounded-lg px-8 py-2 text-white shadow-lg md:text-lg ${
                      buttonDisabled
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gray-800 hover:bg-gray-700"
                    }`}
                    disabled={buttonDisabled}
                  >
                    {"Sign Up"}
                  </button>
                </div>
              </div>

              <div className="sm:col-span-4">
                <div className="mt-2">
                  <h2 className="text-md">Already a user ? </h2>
                  <Link className="text-md" to="/farmer/login">
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default RegisterScreen;
