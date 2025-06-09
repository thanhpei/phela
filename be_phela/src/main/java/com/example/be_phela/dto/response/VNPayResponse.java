package com.example.be_phela.dto.response;

import lombok.Data;

import java.io.Serializable;

@Data
public class VNPayResponse implements Serializable {
    public String status;
    public String message;
    public String url;
}