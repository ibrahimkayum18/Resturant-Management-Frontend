
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const CustomerMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const axiosPublic = useAxiosPublic();

  // 🔹 Status Badge (same style as AllCustomers)
  const StatusBadge = ({ status }) => {
    const isRead = status === "Read";

    return (
      <div className="flex items-center gap-2">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isRead ? "bg-green-700" : "bg-yellow-600"
          }`}
        />
        <span className="text-sm">{status}</span>
      </div>
    );
  };

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axiosPublic.get("/api/contact");
        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setMessages(sorted);
      } catch {
        toast.error("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [axiosPublic]);

  // Open message
  const openMessage = async (msg) => {
    setSelectedMessage(msg);
    setShowReply(false);

    if (msg.status === "Unread") {
      await axiosPublic.put(`/api/contact/${msg._id}`, {
        status: "Read",
      });

      setMessages((prev) =>
        prev.map((m) =>
          m._id === msg._id ? { ...m, status: "Read" } : m
        )
      );
    }
  };

  const closeModal = () => {
    setSelectedMessage(null);
    setShowReply(false);
    setReplyText("");
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    await axiosPublic.delete(`/api/contact/${id}`);
    setMessages((prev) => prev.filter((m) => m._id !== id));
    closeModal();
    toast.success("Message deleted");
  };

  const sendReply = async () => {
    if (!replyText.trim()) return toast.error("Reply cannot be empty");

    await axiosPublic.post("/api/contact/reply", {
      firstName: selectedMessage.firstName,
      email: selectedMessage.email,
      subject: "Reply to your message",
      message: replyText,
    });

    toast.success("Reply sent");
    setShowReply(false);
    setReplyText("");
  };

  if (loading) {
    return (
      <div className="p-6 text-center font-semibold">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 text-black max-w-7xl mx-auto">
      <Toaster position="top-right" />

      <h2 className="text-3xl font-bold mb-5">
        Customer Messages
      </h2>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Message</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {messages.map((msg) => (
              <tr
                key={msg._id}
                onClick={() => openMessage(msg)}
                className={`border-t cursor-pointer hover:bg-gray-50 ${
                  msg.status === "Unread" ? "bg-yellow-50 font-semibold" : ""
                }`}
              >
                <td className="px-4 py-3">
                  {msg.firstName} {msg.lastName}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {msg.email}
                </td>

                <td className="px-4 py-3 truncate max-w-xs">
                  {msg.message}
                </td>

                <td className="px-4 py-3 text-sm text-gray-500">
                  {new Date(msg.createdAt).toLocaleString()}
                </td>

                <td className="px-4 py-3">
                  <StatusBadge status={msg.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {messages.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No messages found
          </div>
        )}
      </div>

      {/* ================= MOBILE LIST (LIKE ALL CUSTOMERS) ================= */}
      <div className="md:hidden bg-white rounded-xl shadow divide-y">
        {messages.map((msg) => (
          <div
            key={msg._id}
            onClick={() => openMessage(msg)}
            className="p-4 flex justify-between items-start gap-3 cursor-pointer"
          >
            <div className="min-w-0">
              <p className="font-semibold truncate">
                {msg.firstName} {msg.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {msg.email}
              </p>
              <p className="text-sm mt-1 truncate">
                {msg.message}
              </p>
              <StatusBadge status={msg.status} />
            </div>

            <span className="text-xs text-gray-400 whitespace-nowrap">
              {new Date(msg.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-xl font-bold"
            >
              ✕
            </button>

            <h3 className="text-2xl font-semibold mb-4 border-b pb-2">
              Message Details
            </h3>

            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {selectedMessage.firstName} {selectedMessage.lastName}</p>
              <p><strong>Email:</strong> {selectedMessage.email}</p>
              <p><strong>Date:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}</p>

              <div className="border rounded-lg p-3 bg-gray-50 mt-2">
                {selectedMessage.message}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowReply(!showReply)}
                className="flex-1 bg-black text-white py-2 rounded-lg"
              >
                Reply
              </button>
              <button
                onClick={() => deleteMessage(selectedMessage._id)}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg"
              >
                Delete
              </button>
            </div>

            {showReply && (
              <div className="mt-4">
                <textarea
                  rows="4"
                  className="w-full border rounded-lg p-3"
                  placeholder="Write reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <button
                  onClick={sendReply}
                  className="mt-2 w-full bg-green-600 text-white py-2 rounded-lg"
                >
                  Send Reply
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
