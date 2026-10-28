import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Vui lòng nhập email")
        .email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    remember: z.boolean().optional(),
});

// Luật kiểm tra dữ liệu form đăng ký, khớp RegisterRequest của identity-service.
export const registerSchema = z
    .object({
        fullName: z.string().trim().min(1, "Vui lòng nhập họ và tên"),
        email: z
            .string()
            .trim()
            .min(1, "Vui lòng nhập email")
            .email("Email không hợp lệ"),
        phone: z.string().trim().optional().or(z.literal("")),
        password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
        confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu nhập lại không khớp",
        path: ["confirmPassword"],
    });

// Quên mật khẩu: BE chỉ gửi mã qua email.
export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Vui lòng nhập email")
        .email("Email không hợp lệ"),
});

// Đặt mật khẩu mới sau khi xác nhận mã: cùng luật mật khẩu với đăng ký (tối thiểu 6 ký tự).
export const resetPasswordSchema = z
    .object({
        newPassword: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
        confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Mật khẩu nhập lại không khớp",
        path: ["confirmPassword"],
    });
