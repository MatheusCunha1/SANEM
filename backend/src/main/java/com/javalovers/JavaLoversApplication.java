package com.javalovers;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class JavaLoversApplication {

    public static void main(String[] args) {
        SpringApplication.run(JavaLoversApplication.class, args);
        // BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // String senhaOriginal = "123456";
        // String senhaCodificada = encoder.encode(senhaOriginal);
        // String hashSalvo = "$2a$10$ztgDa98UZFt2qAoiyJlr1uhoMCTOgEOmELuLEuAtcDGB7jqFF4VE.";
        // System.out.println("Hash gerado: " + senhaCodificada);
        // boolean isValida = encoder.matches(senhaOriginal, hashSalvo);
        // System.out.println("Senha correta: " + isValida);
    }
}
