import React, { useState } from "react";

const Blogs = () => {
  
  const [blogs] = useState([
    {
      _id: 1,
      title: "Summer Fashion Trends 2025",
      content:
        "Discover the latest summer trends with cool shades, light fabrics, and comfy outfits perfect for hot days.",
      img: "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    },
    {
      _id: 2,
      title: "Best Hoodies for This Winter",
      content:
        "Check out our collection of cozy hoodies that keep you warm while looking stylish throughout the season.",
      img: "https://images.pexels.com/photos/6311655/pexels-photo-6311655.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    },
    {
      _id: 3,
      title: "Top T-Shirt Styles You Need",
      content:
        "From graphic tees to plain classics, explore the most popular T-shirt styles trending this year.",
      img: "https://images.pexels.com/photos/3765114/pexels-photo-3765114.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    },
  ]);

  return (
    <div className="max-w-6xl mx-auto p-6 sm:mt-[10%] md:mt-[8%]">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Blogs</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="border rounded-lg shadow-md hover:shadow-xl transition-shadow bg-white"
          >
            <img
              src={blog.img}
              alt={blog.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-600 text-sm">{blog.content}</p>
              <button className="mt-3 text-green-700 font-semibold hover:underline">
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
