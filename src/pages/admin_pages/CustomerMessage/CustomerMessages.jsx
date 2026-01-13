import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

/**
 * CustomerMessages Component
 * - Displays customer messages in a table
 * - Allows viewing message details in a modal
 * - Dynamically updates Read/Unread status
 * - Allows replying to messages via email
 * - Allows deleting messages
 */
const CustomerMessages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");


  // Fetch all messages on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/contact");
        const sortedMessages = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setMessages(sortedMessages);
      } catch (error) {
        console.error("Failed to fetch messages", error.message);
        toast.error("Failed to load messages");
      }
    };

    fetchMessages();
  }, []);

  /**
   * Open a message in modal
   * Updates status to Read if it was Unread
   */
  const openMessage = async (message) => {
    setSelectedMessage(message);
    setShowReply(false);

    if (message.status === "Unread") {
      try {
        await axios.put(`http://localhost:5000/api/contact/${message._id}`, {
          status: "Read",
        });

        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === message._id ? { ...msg, status: "Read" } : msg
          )
        );
      } catch (error) {
        console.error("Failed to update message status", error.message);
        toast.error("Failed to update message status");
      }
    }
  };

  // Close modal
  const closeModal = () => {
    setSelectedMessage(null);
    setShowReply(false);
    setReplyText("");
  };

  // Delete message
  const deleteMessage = async (messageId) => {
    try {
      await axios.delete(`http://localhost:5000/api/contact/${messageId}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      closeModal();
      toast.success("Message deleted successfully");
    } catch (error) {
      console.error("Failed to delete message", error.message);
      toast.error("Failed to delete message");
    }
  };

  // Send reply
  const sendReply = async (firstName) => {
    if (!replyText.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/contact/reply", {
        firstName: firstName,
        email: selectedMessage.email,
        message: replyText,
        subject: `Reply to your message`,
      });

      toast.success("Reply sent successfully!");
      setShowReply(false);
      setReplyText("");
    } catch (error) {
      console.error("Failed to send reply", error);
      toast.error("Failed to send reply");
    }
  };

  return (
    <div className="p-6 text-black min-h-screen">
      <Toaster position="top-right" />

      <h2 className="text-3xl font-semibold mb-6">Customer Messages</h2>

      <div className="overflow-x-auto border rounded-lg shadow-md">
        <table className="min-w-full border-collapse divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Message</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Status</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {messages.map((msg) => (
              <tr
                key={msg._id}
                onClick={() => openMessage(msg)}
                className={`cursor-pointer transition duration-200 hover:bg-gray-50 ${
                  msg.status === "Unread" ? "font-semibold bg-yellow-50" : ""
                }`}
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm">{msg.firstName} {msg.lastName}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">{msg.email}</td>
                <td className="px-4 py-3 text-sm truncate max-w-xs">{msg.message}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">{new Date(msg.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3 text-center text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      msg.status === "Read"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {msg.status}
                  </span>
                </td>
              </tr>
            ))}

            {messages.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">No messages found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 relative shadow-lg animate-fade-in">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-black text-xl font-bold hover:text-gray-600"
            >
              ✕
            </button>

            <h3 className="text-2xl font-semibold mb-4 border-b pb-2">Message Details</h3>

            <div className="space-y-3 text-black text-sm">
              <p><strong>Name:</strong> {selectedMessage.firstName} {selectedMessage.lastName}</p>
              <p><strong>Email:</strong> {selectedMessage.email}</p>
              <p><strong>Date:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}</p>
              <p><strong>Message:</strong></p>
              <div className="border rounded-lg p-3 bg-gray-50 break-words">{selectedMessage.message}</div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-wrap gap-2 justify-between">
              <button
                onClick={() => setShowReply(!showReply)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Reply
              </button>
              <button
                onClick={() => deleteMessage(selectedMessage._id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>

            {/* Reply Form */}
            {showReply && (
              <div className="mt-4">
                <textarea
                  className="w-full border rounded-lg px-3 py-2 resize-none"
                  rows="4"
                  placeholder="Type your reply here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <button
                  onClick={() => sendReply(selectedMessage.firstName)}
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerMessages;
