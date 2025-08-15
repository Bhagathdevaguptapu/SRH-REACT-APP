package com.cfg.srh.dto;

import lombok.Data;

@Data
public class CommentDTO {
    private Integer ticketId;
    private String commenterRole;
    private String commenterName;
    private String commentText;
}
