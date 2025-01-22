import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [write, setWrite] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [posts, setPosts] = useState([]);

  // Fetch posts from the MySQL database
  useEffect(() => {
    axios
      .get(
        "https://finalprojectbackend-hdb3dma8bgamgdcq.southeastasia-01.azurewebsites.net/posts"
      )
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the posts:", error);
      });
  }, []);

  function handleWrite() {
    setWrite(!write);
  }

  function handlePost(event) {
    event.preventDefault();
    const newPost = {
      from,
      to,
      content: postContent,
      date: new Date().toISOString().split("T")[0],
    };

    // Send the new post to the backend
    axios
      .post(
        "https://finalprojectbackend-hdb3dma8bgamgdcq.southeastasia-01.azurewebsites.net/posts",
        newPost
      )
      .then((response) => {
        setPosts([response.data, ...posts]); // Add the new post to the list
        setPostContent("");
        setFrom("");
        setTo("");
      })
      .catch((error) => {
        console.error("There was an error posting the message:", error);
      });
  }

  return (
    <div>
      <header>
        <h1>PUP Freedom Wall</h1>
        <div className="pup-meaning">
          Polytechnic University of the Philippines
        </div>
        <button onClick={handleWrite}>WRITE</button>
      </header>

      {write && (
        <main>
          <form onSubmit={handlePost}>
            <label htmlFor="To">To:</label>
            <select id="To" value={to} onChange={(e) => setTo(e.target.value)}>
              <option value="" disabled>
                Select recipient
              </option>
              <option value="Director">Director</option>
              <option value="Professor">Professor</option>
              <option value="Student">Student</option>
            </select>

            <label htmlFor="From">From:</label>
            <input
              id="From"
              type="text"
              placeholder="Please use codename"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />

            <label htmlFor="date">
              Date: {new Date().toISOString().split("T")[0]}
            </label>

            <label htmlFor="Message">Message:</label>
            <textarea
              id="Message"
              placeholder="Write your message here"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            ></textarea>

            <button type="submit">POST</button>
          </form>
        </main>
      )}

      <div className="post-list">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <div className="post-header">
              <div className="from-to">
                <p>
                  <strong>From:</strong> {post.from_name}
                </p>
                <p>
                  <strong>To:</strong> {post.to_name}
                </p>
              </div>
              <div className="date">
                <small>{post.date.split("T")[0]}</small>
              </div>
            </div>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
