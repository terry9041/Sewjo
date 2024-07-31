package com.sewjo.main.dto;

/**
 * UserDTO
 */
public class UserDTO {
    private Long id;
    private String userName;
    private String email;
    private Long imageId;

    public UserDTO() {
    }

    public UserDTO(Long id, String userName, String email) {
        this.id = id;
        this.userName = userName;
        this.email = email;
        this.imageId = null;
    }

    public Long getImageId(){
        return imageId;
    }

    public void setImageId(Long imageId){
        this.imageId = imageId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

}
