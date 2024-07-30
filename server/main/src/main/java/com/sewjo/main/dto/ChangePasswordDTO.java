package com.sewjo.main.dto;

import jakarta.validation.constraints.NotNull;

public class ChangePasswordDTO {
    @NotNull
    private String confirmPassword;
    @NotNull
    private String oldPassword;
    @NotNull
    private String newPassword;

    public String getNewPassword() {
        return newPassword;
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    @Override
    public String toString() {
        return "ChangePasswordDTO{" +
                "oldPassword='" + oldPassword + '\'' +
                ", newPassword='" + newPassword + '\'' +
                ", confirmPassword='" + confirmPassword + '\'' +
                '}';
    }
    // Getters and setters
}
