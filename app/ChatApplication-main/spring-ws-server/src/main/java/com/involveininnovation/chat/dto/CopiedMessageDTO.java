package com.involveininnovation.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CopiedMessageDTO {
    private String sender;
    private String content;
}