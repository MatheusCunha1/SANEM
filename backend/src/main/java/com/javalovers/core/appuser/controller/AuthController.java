package com.javalovers.core.appuser.controller;

import com.javalovers.core.appuser.domain.dto.request.ForgotPasswordDTO;
import com.javalovers.core.appuser.domain.dto.request.LoginRequestDTO;
import com.javalovers.core.appuser.domain.dto.request.ResetPasswordDTO;
import com.javalovers.core.appuser.domain.dto.response.LoginResponseDTO;
import com.javalovers.core.appuser.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody @Valid LoginRequestDTO loginRequest) {
    try {
      LoginResponseDTO response = authService.authenticate(loginRequest);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      System.err.println("Erro no login: " + e.getMessage());
      e.printStackTrace();
      return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
  }

  @PostMapping("/validate")
  public ResponseEntity<Boolean> validateToken(@RequestHeader("Authorization") String token) {
    try {
      boolean isValid = authService.validateToken(token);
      return ResponseEntity.ok(isValid);
    } catch (Exception e) {
      return ResponseEntity.ok(false);
    }
  }

  @PostMapping("/forgot-password")
  public ResponseEntity<?> forgotPassword(@RequestBody @Valid ForgotPasswordDTO forgotPasswordDTO) {
    try {
      String token = authService.generatePasswordResetToken(forgotPasswordDTO.email());
      return ResponseEntity.ok(Map.of(
          "message", "Token de recuperação gerado com sucesso.",
          "token", token
      ));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
  }

  @PostMapping("/reset-password")
  public ResponseEntity<?> resetPassword(@RequestBody @Valid ResetPasswordDTO resetPasswordDTO) {
    try {
      authService.resetPassword(resetPasswordDTO.token(), resetPasswordDTO.newPassword());
      return ResponseEntity.ok(Map.of("message", "Senha redefinida com sucesso."));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
  }
}
