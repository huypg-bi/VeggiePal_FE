import { useId } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCreateComment, useUpdateComment } from "@/features/blog/hooks/useCommentMutations";
import { commentSchema } from "@/features/blog/schema";

const fieldClass =
  "w-full resize-y rounded-2xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-subtle focus:border-brand/40 focus:ring-2 focus:ring-brand/15 aria-[invalid=true]:border-destructive/50 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-destructive/20";

export default function CommentComposer({
  blogId,
  targetType = "BLOG",
  targetId,
  parentCommentId,
  commentId,
  initialContent = "",
  placeholder = "Viết bình luận của bạn...",
  autoFocus = false,
  onDone,
  onCancel,
}) {
  const resolvedTargetId = targetId ?? blogId;
  const fieldId = useId();
  const isEdit = commentId != null;
  const createComment = useCreateComment();
  const updateComment = useUpdateComment();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: initialContent },
  });

  const onSubmit = async ({ content }) => {
    try {
      if (isEdit) {
        await updateComment.mutateAsync({
          commentId,
          targetType,
          targetId: resolvedTargetId,
          blogId: resolvedTargetId,
          content,
        });
        toast.success("Đã cập nhật bình luận");
      } else {
        await createComment.mutateAsync({
          targetType,
          targetId: resolvedTargetId,
          blogId: resolvedTargetId,
          parentCommentId,
          content,
        });
        // Video kiểm duyệt đồng bộ; blog có thể duyệt bất đồng bộ nên thông báo cho khớp.
        toast.success(
          targetType === "VIDEO"
            ? "Đã gửi bình luận"
            : "Đã gửi bình luận. Nếu chưa thấy hiện ra, bình luận đang chờ kiểm duyệt."
        );
      }
      reset({ content: "" });
      onDone?.();
    } catch (error) {
      setError("root", { message: error.message });
    }
  };

  const errorMessage = errors.content?.message ?? errors.root?.message;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <label htmlFor={fieldId} className="sr-only">
        {isEdit ? "Sửa bình luận" : "Bình luận"}
      </label>
      <textarea
        id={fieldId}
        rows={isEdit || parentCommentId ? 2 : 3}
        autoFocus={autoFocus}
        placeholder={placeholder}
        aria-invalid={Boolean(errors.content)}
        className={fieldClass}
        {...register("content")}
      />

      {errorMessage && (
        <p className="mt-2 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      <div className="mt-2 flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={isSubmitting}>
            Hủy
          </Button>
        )}
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {isEdit ? "Lưu" : parentCommentId ? "Gửi phản hồi" : "Gửi bình luận"}
        </Button>
      </div>
    </form>
  );
}
