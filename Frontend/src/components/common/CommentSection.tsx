import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MessageCircle, Trash2, CornerDownRight, Loader2, Send } from "lucide-react";
import type { RootState } from "@/redux/store";
import {
  getBinhLuan,
  taoBinhLuan,
  xoaBinhLuan,
  type BinhLuanDTO,
} from "@/services/commentService";

interface Props {
  maSanPham: number;
}

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const Avatar = ({ ten, avatar }: { ten: string; avatar?: string }) => {
  if (avatar) {
    return <img src={avatar} alt={ten} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />;
  }
  return (
    <div className="w-8 h-8 rounded-full bg-[#4E6A4E] flex items-center justify-center
                    text-white text-xs font-bold flex-shrink-0">
      {ten.charAt(0).toUpperCase()}
    </div>
  );
};

const CommentSection = ({ maSanPham }: Props) => {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const currentEmail = useSelector((s: RootState) => s.auth.user?.email);

  const [comments, setComments] = useState<BinhLuanDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Form bình luận gốc
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Trả lời
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);

  const fetchComments = () => {
    setLoading(true);
    getBinhLuan(maSanPham)
      .then((res) => {
        const data = (res as unknown as { data: { data: BinhLuanDTO[] } }).data?.data
          || (res as unknown as { data: BinhLuanDTO[] }).data
          || [];
        setComments(Array.isArray(data) ? data : []);
      })
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchComments(); }, [maSanPham]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      await taoBinhLuan({ maSanPham, noiDung: newComment.trim(), maBinhLuanCha: null });
      setNewComment("");
      fetchComments();
    } catch { /* ignore */ }
    finally { setSubmitting(false); }
  };

  const handleSubmitReply = async (maBinhLuanCha: number) => {
    if (!replyText.trim()) return;
    setReplySubmitting(true);
    try {
      await taoBinhLuan({ maSanPham, noiDung: replyText.trim(), maBinhLuanCha });
      setReplyText("");
      setReplyingTo(null);
      fetchComments();
    } catch { /* ignore */ }
    finally { setReplySubmitting(false); }
  };

  const handleDelete = async (maBinhLuan: number) => {
    if (!confirm("Xóa bình luận này?")) return;
    try {
      await xoaBinhLuan(maBinhLuan);
      fetchComments();
    } catch { /* ignore */ }
  };

  const totalCount = comments.reduce((acc, c) => acc + 1 + (c.traLoi?.length ?? 0), 0);

  return (
    <div className="mt-10 border-t border-[#E5E5E5] pt-8">
      {/* Tiêu đề */}
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-[#49613E]" />
        <h2 className="text-[22px] font-bold text-[#1A1C19]">
          Bình luận ({totalCount})
        </h2>
      </div>

      {/* Form bình luận mới */}
      {isAuthenticated ? (
        <div className="flex gap-3 mb-8">
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Viết bình luận của bạn..."
              rows={3}
              maxLength={1000}
              className="w-full border border-[#E5E5E5] rounded-xl px-4 py-3 text-sm
                         focus:outline-none focus:ring-2 focus:ring-[#49613E]/30 resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-400">{newComment.length}/1000</span>
              <button
                onClick={handleSubmitComment}
                disabled={submitting || !newComment.trim()}
                className="flex items-center gap-2 bg-[#49613E] hover:bg-[#3a4d31] text-white
                           px-5 py-2 rounded-full text-sm font-semibold transition
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting
                  ? <Loader2 size={14} className="animate-spin" />
                  : <Send size={14} />}
                Gửi
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-[#F9FAF4] rounded-xl text-sm text-gray-500 text-center">
          <a href="/login" className="text-[#49613E] font-semibold hover:underline">
            Đăng nhập
          </a>{" "}
          để bình luận về sản phẩm này.
        </div>
      )}

      {/* Danh sách bình luận */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#49613E]" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          Chưa có bình luận nào. Hãy là người đầu tiên!
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.maBinhLuan}>
              {/* Bình luận gốc */}
              <div className="flex gap-3">
                <Avatar ten={comment.tenNguoiDung} avatar={comment.avatarNguoiDung} />
                <div className="flex-1">
                  <div className="bg-[#F9FAF4] rounded-2xl rounded-tl-none px-4 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-[#1A1C19]">
                        {comment.tenNguoiDung}
                      </span>
                      {comment.emailNguoiDung === currentEmail && (
                        <button onClick={() => handleDelete(comment.maBinhLuan)}
                          className="text-gray-400 hover:text-red-500 transition">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-[#444] leading-relaxed">{comment.noiDung}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-1 px-1">
                    <span className="text-xs text-gray-400">
                      {comment.thoiGianTao ? formatTime(comment.thoiGianTao) : ""}
                    </span>
                    {isAuthenticated && (
                      <button
                        onClick={() => {
                          setReplyingTo(replyingTo === comment.maBinhLuan ? null : comment.maBinhLuan);
                          setReplyText("");
                        }}
                        className="text-xs text-[#49613E] font-semibold hover:underline flex items-center gap-1"
                      >
                        <CornerDownRight size={12} /> Trả lời
                      </button>
                    )}
                  </div>

                  {/* Form trả lời */}
                  {replyingTo === comment.maBinhLuan && (
                    <div className="mt-3 flex gap-2">
                      <div className="flex-1">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Trả lời ${comment.tenNguoiDung}...`}
                          rows={2}
                          maxLength={1000}
                          autoFocus
                          className="w-full border border-[#E5E5E5] rounded-xl px-3 py-2 text-sm
                                     focus:outline-none focus:ring-2 focus:ring-[#49613E]/30 resize-none"
                        />
                        <div className="flex justify-end gap-2 mt-1">
                          <button
                            onClick={() => { setReplyingTo(null); setReplyText(""); }}
                            className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5
                                       border border-gray-200 rounded-full"
                          >
                            Hủy
                          </button>
                          <button
                            onClick={() => handleSubmitReply(comment.maBinhLuan)}
                            disabled={replySubmitting || !replyText.trim()}
                            className="text-xs bg-[#49613E] text-white px-4 py-1.5 rounded-full
                                       font-semibold disabled:opacity-50 flex items-center gap-1"
                          >
                            {replySubmitting
                              ? <Loader2 size={12} className="animate-spin" />
                              : <Send size={12} />}
                            Gửi
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Danh sách trả lời */}
                  {comment.traLoi && comment.traLoi.length > 0 && (
                    <div className="mt-3 space-y-3 pl-4 border-l-2 border-[#E5E5E5]">
                      {comment.traLoi.map((reply) => (
                        <div key={reply.maBinhLuan} className="flex gap-3">
                          <Avatar ten={reply.tenNguoiDung} avatar={reply.avatarNguoiDung} />
                          <div className="flex-1">
                            <div className="bg-white border border-[#E5E5E5] rounded-2xl rounded-tl-none px-4 py-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-semibold text-[#1A1C19]">
                                  {reply.tenNguoiDung}
                                </span>
                                {reply.emailNguoiDung === currentEmail && (
                                  <button onClick={() => handleDelete(reply.maBinhLuan)}
                                    className="text-gray-400 hover:text-red-500 transition">
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                              <p className="text-sm text-[#444] leading-relaxed">{reply.noiDung}</p>
                            </div>
                            <span className="text-xs text-gray-400 mt-1 px-1 block">
                              {reply.thoiGianTao ? formatTime(reply.thoiGianTao) : ""}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
