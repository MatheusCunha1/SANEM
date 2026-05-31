package com.javalovers.core.appuser.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {

  private final JdbcTemplate jdbcTemplate;

  @Override
  public void run(String... args) throws Exception {
    log.info("Iniciando verificação do banco de dados...");

    // Verificar se existem usuários
    Integer userCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM app_user", Integer.class);

    if (userCount == 0) {
      log.info("Banco vazio detectado. Executando scripts de inicialização...");
      executeScript("db/script-create-tables.sql");
      executeScript("db/script-insert-values.sql");
      log.info("Scripts de inicialização executados com sucesso!");
    } else {
      log.info("Banco já possui {} usuários. Pulando inicialização.", userCount);
    }

    // Verificar e adicionar coluna issue_date na tabela card se não existir
    checkAndAddIssueDateColumn();

    // Verificar e remover coluna category_id da tabela item se existir
    checkAndRemoveCategoryIdColumn();

    // Verificar e adicionar coluna deleted_at na tabela app_user se não existir
    checkAndAddDeletedAtColumn();

    // Verificar e adicionar colunas email e nif na tabela beneficiary
    checkAndAddBeneficiaryColumns();

    // Verificar e adicionar colunas de reset de senha na tabela app_user
    checkAndAddPasswordResetColumns();
  }

  private void checkAndAddIssueDateColumn() {
    try {
      // Verificar se a coluna issue_date existe na tabela card
      String checkColumnSql = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS " +
          "WHERE TABLE_SCHEMA = DATABASE() " +
          "AND TABLE_NAME = 'card' " +
          "AND COLUMN_NAME = 'issue_date'";

      Integer columnExists = jdbcTemplate.queryForObject(checkColumnSql, Integer.class);

      if (columnExists == null || columnExists == 0) {
        log.info("Coluna issue_date não encontrada na tabela card. Adicionando...");
        jdbcTemplate.execute("ALTER TABLE card ADD COLUMN issue_date TIMESTAMP(6) NULL");
        log.info("Coluna issue_date adicionada com sucesso!");
      } else {
        log.debug("Coluna issue_date já existe na tabela card.");
      }
    } catch (Exception e) {
      log.warn("Erro ao verificar/adicionar coluna issue_date: {}", e.getMessage());
      // Não lançar exceção para não impedir a inicialização da aplicação
    }
  }

  private void checkAndRemoveCategoryIdColumn() {
    try {
      // Verificar se a coluna category_id existe na tabela item
      String checkColumnSql = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS " +
          "WHERE TABLE_SCHEMA = DATABASE() " +
          "AND TABLE_NAME = 'item' " +
          "AND COLUMN_NAME = 'category_id'";

      Integer columnExists = jdbcTemplate.queryForObject(checkColumnSql, Integer.class);

      if (columnExists != null && columnExists > 0) {
        log.info("Coluna category_id encontrada na tabela item. Removendo...");

        // Primeiro, verificar e remover a foreign key constraint se existir
        String checkFkSql = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS " +
            "WHERE CONSTRAINT_SCHEMA = DATABASE() " +
            "AND TABLE_NAME = 'item' " +
            "AND CONSTRAINT_NAME = 'fk_item_category' " +
            "AND CONSTRAINT_TYPE = 'FOREIGN KEY'";

        Integer fkExists = jdbcTemplate.queryForObject(checkFkSql, Integer.class);

        if (fkExists != null && fkExists > 0) {
          try {
            jdbcTemplate.execute("ALTER TABLE item DROP FOREIGN KEY fk_item_category");
            log.info("Foreign key fk_item_category removida com sucesso!");
          } catch (Exception e) {
            log.warn("Erro ao remover foreign key fk_item_category: {}", e.getMessage());
          }
        } else {
          log.debug("Foreign key fk_item_category não existe.");
        }

        // Depois, remover a coluna
        jdbcTemplate.execute("ALTER TABLE item DROP COLUMN category_id");
        log.info("Coluna category_id removida com sucesso!");
      } else {
        log.debug("Coluna category_id não existe na tabela item.");
      }
    } catch (Exception e) {
      log.warn("Erro ao verificar/remover coluna category_id: {}", e.getMessage());
      // Não lançar exceção para não impedir a inicialização da aplicação
    }
  }

  private void checkAndAddDeletedAtColumn() {
    String[] tables = {"app_user", "profile", "beneficiary", "card", "category", "item",
        "donor", "donation", "withdrawal", "item_donated", "item_withdrawn", "withdrawal_limit_config"};

    for (String table : tables) {
      try {
        String checkSql = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS " +
            "WHERE TABLE_SCHEMA = DATABASE() " +
            "AND TABLE_NAME = '" + table + "' " +
            "AND COLUMN_NAME = 'deleted_at'";

        Integer exists = jdbcTemplate.queryForObject(checkSql, Integer.class);
        if (exists == null || exists == 0) {
          jdbcTemplate.execute("ALTER TABLE " + table + " ADD COLUMN deleted_at DATETIME NULL");
          log.info("Coluna deleted_at adicionada na tabela {}.", table);
        }
      } catch (Exception e) {
        log.warn("Erro ao verificar/adicionar deleted_at na tabela {}: {}", table, e.getMessage());
      }
    }
  }

  private void checkAndAddBeneficiaryColumns() {
    String[][] columns = {
        {"beneficiary", "email", "VARCHAR(160) NULL"},
        {"beneficiary", "nif", "VARCHAR(30) NULL"}
    };

    for (String[] col : columns) {
      try {
        String checkSql = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS " +
            "WHERE TABLE_SCHEMA = DATABASE() " +
            "AND TABLE_NAME = '" + col[0] + "' " +
            "AND COLUMN_NAME = '" + col[1] + "'";

        Integer exists = jdbcTemplate.queryForObject(checkSql, Integer.class);
        if (exists == null || exists == 0) {
          jdbcTemplate.execute("ALTER TABLE " + col[0] + " ADD COLUMN " + col[1] + " " + col[2]);
          log.info("Coluna {} adicionada na tabela {}.", col[1], col[0]);
        }
      } catch (Exception e) {
        log.warn("Erro ao adicionar coluna {} em {}: {}", col[1], col[0], e.getMessage());
      }
    }
  }

  private void checkAndAddPasswordResetColumns() {
    try {
      String checkResetToken = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS " +
          "WHERE TABLE_SCHEMA = DATABASE() " +
          "AND TABLE_NAME = 'app_user' " +
          "AND COLUMN_NAME = 'reset_token'";

      Integer resetTokenExists = jdbcTemplate.queryForObject(checkResetToken, Integer.class);
      if (resetTokenExists == null || resetTokenExists == 0) {
        jdbcTemplate.execute("ALTER TABLE app_user ADD COLUMN reset_token VARCHAR(100) NULL");
        log.info("Coluna reset_token adicionada na tabela app_user.");
      }

      String checkResetExpiry = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS " +
          "WHERE TABLE_SCHEMA = DATABASE() " +
          "AND TABLE_NAME = 'app_user' " +
          "AND COLUMN_NAME = 'reset_token_expiry'";

      Integer resetExpiryExists = jdbcTemplate.queryForObject(checkResetExpiry, Integer.class);
      if (resetExpiryExists == null || resetExpiryExists == 0) {
        jdbcTemplate.execute("ALTER TABLE app_user ADD COLUMN reset_token_expiry DATETIME NULL");
        log.info("Coluna reset_token_expiry adicionada na tabela app_user.");
      }
    } catch (Exception e) {
      log.warn("Erro ao verificar/adicionar colunas de reset de senha: {}", e.getMessage());
    }
  }

  private void executeScript(String scriptPath) {
    try {
      String script = Files.readString(Paths.get(scriptPath));
      String[] statements = script.split(";");

      for (String statement : statements) {
        statement = statement.trim();
        if (!statement.isEmpty() && !statement.startsWith("--")) {
          try {
            jdbcTemplate.execute(statement);
          } catch (Exception e) {
            log.warn("Erro ao executar statement: {}", statement.substring(0, Math.min(50, statement.length())));
          }
        }
      }
    } catch (IOException e) {
      log.error("Erro ao ler script: {}", scriptPath, e);
    }
  }
}
