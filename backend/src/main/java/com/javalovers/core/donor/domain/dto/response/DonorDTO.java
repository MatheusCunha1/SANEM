package com.javalovers.core.donor.domain.dto.response;

public record DonorDTO(
        Long donorId,
        String name,
        String cpfCnpj,
        String contact,
        String phone,
        String address,
        String number,
        String complement,
        String neighborhood,
        String referencePoint
) {
}
