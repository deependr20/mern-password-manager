import React, { useState, useEffect } from "react";
import "remixicon/fonts/remixicon.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Manager = () => {
  const [eye, setEye] = useState(false)
  const [passwords, setPasswords] = useState([]); // State to store the passwords fetched from backend
  const [visiblePasswords, setVisiblePasswords] = useState([]);

  const [formData, setFormData] = useState({
    url: "",
    user1name: "",
    password: "",
  });

  const delay = (d) => {
    return new Promise((resolve) => setTimeout(resolve, d));
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
  
    await delay(1000); // Simulates a delay of 1 second (for loading effect, etc.)
  
    // Send the new password data to the backend to save it
    try {
      const response = await fetch('http://localhost:5000/api/savePassword', {
        method: 'POST', // HTTP method for creating new data
        headers: {
          'Content-Type': 'application/json', // Specifies the type of data being sent (JSON)
        },
        body: JSON.stringify(formData), // Sends the form data as a JSON string in the request body
      });
  
      await response.json(); // Parses the JSON response from the server
      
      // console.log(response)   //ok is response object m h
      if (response.ok) {
        toast.success("Password saved successfully!"); // Display a success toast message
        setPasswords([...passwords, formData]); // Update the passwords list
        setVisiblePasswords([...visiblePasswords, false]); // Add visibility control
        setFormData({ url: "", username: "", password: "" }); // Reset form fields
      } else {
        toast.error('Failed to save password'); // Display an error toast message
      }
    } catch (error) {
      toast.error('Error saving password'); // Display a toast message for the error
      console.error('Error:', error); // Log the error for debugging
    }
  };

  // Function to delete a password by ID
  const deletePassword = async (id, index) => {
    try {
      const response = await fetch(`http://localhost:5000/api/deletePassword/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success("Password deleted successfully!");
        const updatedPasswords = passwords.filter((_, i) => i !== index);
        setPasswords(updatedPasswords); // Update passwords after deletion
        setVisiblePasswords(visiblePasswords.filter((_, i) => i !== index)); // Update visibility control
      } else {
        toast.error("Failed to delete password");
      }
    } catch (error) {
      toast.error("Error deleting password");
      console.error("Error:", error);
    }
  };

  // Fetch passwords on component mount
  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/getPasswords');
        const result = await response.json();

        if (response.ok) {
          setPasswords(result);
          setVisiblePasswords(result.map(() => false)); // Set initial visibility to hidden
        } else {
          toast.error('Failed to fetch passwords');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPasswords();
  }, []);

  // Toggle password visibility
  const togglePasswordVisibility = (index) =>
    setVisiblePasswords((prev) =>
      prev.map((v, i) => (i === index ? !v : v))
    );

  return(
    <div className="max-w-screen-lg mb-16 mx-auto mt-16 border">
      <div className="text-center pb-4">
        <h1 className="text-gray-600 font-semibold text-4xl">
          Pass<span className="text-orange-300">OP</span>
        </h1>
        <p className="text-lg font-semibold">Your Own Password Manager</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full items-center gap-y-5 sm:px-0 px-8"
      >
        <input
          name="url"
          value={formData.url}
          onChange={handleChange}
          className="bg-white border text-gray-600 px-3 outline-none rounded-full py-[3px] sm:w-[60%] w-full"
          placeholder="Enter Website URL"
          required
        />
        <div className="sm:w-[60%] w-full flex gap-5 items-center">
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="border text-gray-600 bg-white outline-none px-3 rounded-full py-[3px] sm:w-[75%] w-full"
            placeholder="Enter Username"
            required
          />
          <div className="sm:w-[25%] w-full flex relative items-center">
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border text-gray-600 bg-white w-full placeholder:text-sm placeholder:font-semibold outline-none px-3 rounded-full py-[3px]"
              placeholder="Enter Password"
              type={eye ? "text" : "password"}
              required
            />
            <i
              onClick={() => setEye(!eye)}
              className={`absolute right-2 text-gray-500 hover:text-gray-600 cursor-pointer ${
                eye ? "ri-eye-fill" : "ri-eye-off-fill"
              }`}
            />
          </div>
        </div>
        <button
          type="submit"
          className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-8 py-2 text-center mt-3"
        >
          Save
        </button>
      </form>

      <div className="w-full mt-8">
        <h2 className="text-xl px-3 md:px-0 text-zinc-600 mb-3 font-semibold">
          Your Passwords
        </h2>
        {passwords.length === 0 ? (
          <div>No passwords to show</div>
        ) : (
          <table className="table-auto w-full">
            <thead className="bg-green-800 text-white p-4">
              <tr>
                <th className="py-2">URL</th>
                <th>Username</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-green-200">
              {passwords.map((item, index) => (
                <tr key={index}>
                  <td className="text-center w-32 border py-2">{item.url}</td>
                  <td className="text-center w-32 border py-2">{item.username}</td>
                  <td className="text-center w-32 border py-2 relative">
                    {visiblePasswords[index] ? item.password : "••••••••"}
                    <i
                      onClick={() => togglePasswordVisibility(index)}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-600 cursor-pointer ${
                        visiblePasswords[index]
                          ? "ri-eye-fill"
                          : "ri-eye-off-fill"
                      }`}
                    />
                  </td>
                  <td className="text-center w-32 border py-2">
                    <button
                      onClick={() => deletePassword(item._id, index)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Manager;
  