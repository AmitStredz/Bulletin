import axios from "axios";
import React, { useEffect, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { MutatingDots } from "react-loader-spinner";
import { useParams } from "react-router-dom";

export default function UserPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const [newComment, setNewComment] = useState("");
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [isErrorModal, setIsErrorModal] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [activeCommentSection, setActiveCommentSection] = useState(false);

  const { username } = useParams();

  const access = localStorage.getItem("access");

  useEffect(() => {
    console.log("searParam: ", username);
    fetchUser();
  }, []);

  useEffect(() => {
    console.log("userData: ", userData);
  }, [userData]);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://bulletin-xi93.onrender.com/user/alumni/?username=${username}`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
            "Content-Type": "application/json",
          },
        }
      );

      //   console.log("fetchUser response: ", response.data);
      if (response?.data) {
        setUserData(response?.data);
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle liking a post
  const handleLike = async (postId) => {
    try {
      // Assuming your API accepts a POST request to like a post
      const response = await axios.post(
        `https://bulletin-xi93.onrender.com/user/posts/${postId}/like/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access}`,
            "Content-Type": "application/json",
          },
        }
      );

      fetchUser();
      // Update local state to reflect new like count
      //   setPosts((prevPosts) =>
      //     prevPosts.map((post) =>
      //       post.id === postId
      //         ? { ...post, likes: response.data.likes_count }
      //         : post
      //     )
      //   );
    } catch (error) {
      console.error("Error liking post:", error);
      setErrorText("Error liking post.");
      setIsErrorModal(true);
    }
  };

  // Handle adding a new comment to a post
  const handleComment = async (postId) => {
    if (!newComment.trim()) {
      setErrorText("Comment cannot be empty.");
      setIsErrorModal(true);
      return;
    }

    const access = localStorage.getItem("access");
    if (!access) {
      setErrorText("Access key not found.");
      setIsErrorModal(true);
      return;
    }
    setIsCommentLoading(true);

    const data = { comment_text: newComment };

    console.log("data: ", data);

    try {
      const response = await axios.post(
        `https://bulletin-xi93.onrender.com/user/posts/${postId}/comments/create/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${access}`,
            "Content-Type": "application/json",
          },
        }
      );

      fetchUser();
      // setUserData((prevPosts) =>
      //   prevPosts.map((post) =>
      //     post.id === postId
      //       ? { ...post, comments: [...post.comments, response.data] }
      //       : post
      //   )
      // );

      // Clear the comment input
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      setErrorText("Error adding comment.");
      setIsErrorModal(true);
    } finally {
      setIsCommentLoading(false);
    }
  };

  return (
    <div className="w-screen h-full flex text-white">
      {!isLoading ? (
        <div className="flex flex-col gap-5 w-screen h-full p-5">
          {userData?.alumni ? (
            <div className="flex gap-3">
              <div className="flex flex-col gap-2 items-center justify-center bg-white bg-opacity-15 p-5 rounded-2xl">
                {userData?.alumni?.profile_picture_url ? (
                  <img
                    src={userData?.alumni?.profile_picture_url}
                    alt="profile"
                    className="w-28 h-28 rounded-full object-cover"
                  />
                ) : (
                  <RxAvatar size={60} />
                )}
                <div>
                  <span className="text-[20px]">
                    {userData?.alumni?.username}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="flex flex-col text-slate-300 font-extralight">
                  <span>
                    Company:{" "}
                    <span className="font-bold text-white">
                      {userData?.alumni?.company}
                    </span>
                  </span>
                  <div className="w-[1px] bg-white "></div>
                  <span>
                    Designation:{" "}
                    <span className="font-bold text-white">
                      {userData?.alumni?.designation}
                    </span>
                  </span>
                  <div className="w-[1px] bg-white "></div>

                  <span>
                    Age: <span className="font-bold text-white">21</span>
                  </span>
                  <div className="w-[1px] bg-white "></div>
                  {/* <span>
                    Gender: <span className="font-bold text-white">Male</span>
                  </span> */}
                  <div className="w-[1px] bg-white "></div>

                  <span>
                    E-mail:{" "}
                    <span className="font-bold text-white">
                      {userData?.alumni?.email}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex w-full justify-between">
              <span className="text-white">No UserData found...</span>
            </div>
          )}
          <div className="w-full h-[1px] bg-white"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {userData?.posts?.length > 0 ? (
              userData?.posts?.map((post, index) => (
                <div
                  key={post?.post.id}
                  className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4"
                >
                  {/* <div className="flex items-center space-x-4">
                  <RxAvatar size={50} />

                  <span className="font-semibold">
                    {post?.alumni?.username}
                  </span>
                </div> */}
                  {post?.post?.image_link ? (
                    <div className="flex w-full max-h-96 justify-center items-center object-contain bg-black bg-opacity-30 p-1 rounded-lg overflow-hidden">
                      <img
                        src={post?.post?.image_link}
                        alt="Post Content"
                        className="object-contain aspect-auto"
                      />
                    </div>
                  ) : (
                    post?.post?.video_link && (
                      <video
                        controls
                        src={post?.post?.video_link}
                        className="w-full h-auto rounded-lg"
                      />
                    )
                  )}
                  <div className="flex justify-between">
                    <div className="flex flex-col gap-2">
                      <p>{post?.post?.description}</p>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleLike(post?.post?.id)}
                          className="text-yellow-300 hover:text-yellow-400"
                        >
                          ❤️{" "}
                          {post?.post?.likes_count > 0
                            ? post?.post?.likes_count
                            : 0}{" "}
                          Likes
                        </button>
                        <button
                          className="text-yellow-300 hover:text-yellow-400"
                          onClick={() =>
                            setActiveCommentSection(post?.post?.id)
                          }
                        >
                          💬 {post?.post?.comments?.length || 0} Comments
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <span className="text-[12px]">
                        {new Date(post?.post?.posted_date).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Comment section */}
                  <div className="space-y-2">
                    {post?.post?.comments?.length > 0 ? (
                      post?.post?.comments
                        ?.slice(-3)
                        .reverse()
                        .map((comment, index) => (
                          <div className="flex gap-2 p-2 rounded-lg bg-black bg-opacity-20 w-full">
                            {comment?.alumni?.profile_picture_url ? (
                              <img
                                src={comment?.alumni?.profile_picture_url}
                                alt="profile"
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <RxAvatar size={30} />
                            )}
                            {/* <div className="w-">
                              <RxAvatar size={30} />
                            </div> */}
                            <div className="flex flex-col gap- w-full">
                              <div className="flex justify-between">
                                <span className="text-[16px] font-semibold">
                                  {comment?.alumni_username}
                                </span>
                                <div className="flex gap-2 items-center justify-center">
                                  <span className="text-[10px] sm:text-[12px] text-slate-400">
                                    {new Date(
                                      comment?.posted_date
                                    ).toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                      hour12: true, // For AM/PM format
                                    })}
                                  </span>
                                  <div className="flex w-[1px] h-[80%] bg-slate-200 "></div>

                                  <span className="text-[10px] sm:text-[12px] text-slate-400">
                                    {new Date(
                                      comment?.posted_date
                                    ).toLocaleString("en-GB", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <p
                                  key={index}
                                  className="text-[14px]  text-gray-400"
                                >
                                  {comment?.comment_text}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <span>No comments...</span>
                    )}
                    {activeCommentSection === post?.post?.id && (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="w-full p-2 rounded-md bg-gray-700 text-white"
                          placeholder="Write a comment..."
                        />
                        <button
                          onClick={() => handleComment(post?.post?.id)}
                          className="px-4 py-2 bg-yellow-300 text-black rounded-md hover:bg-yellow-400"
                        >
                          {isCommentLoading ? "Loading" : "Comment"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div>No posts found...</div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex w-full justify-center">
          <MutatingDots
            visible={true}
            height="100"
            width="100"
            color="#4fa94d"
            secondaryColor="#4fa94d"
            radius="12.5"
            ariaLabel="mutating-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      )}
    </div>
  );
}
