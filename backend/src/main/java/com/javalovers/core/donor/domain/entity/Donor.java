package com.javalovers.core.donor.domain.entity;

import com.javalovers.common.entity.SoftDeletable;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "donor")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Donor implements SoftDeletable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "donor_id")
    private Long donorId;

    @NotNull
    @Column(name = "name")
    private String name;

    @Column(name = "cpf_cnpj", unique = true)
    private String cpfCnpj;

    @NotNull
    @Column(name = "contact")
    private String contact;

    @Column(name = "phone")
    private String phone;

    @Column(name = "address")
    private String address;

    @Column(name = "number")
    private String number;

    @Column(name = "complement")
    private String complement;

    @Column(name = "neighborhood")
    private String neighborhood;

    @Column(name = "reference_point")
    private String referencePoint;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

}
