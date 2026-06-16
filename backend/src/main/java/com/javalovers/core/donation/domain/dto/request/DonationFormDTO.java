package com.javalovers.core.donation.domain.dto.request;

import jakarta.validation.constraints.NotNull;

import java.util.Date;
import java.util.List;

public record DonationFormDTO(

        @NotNull
        Date donationDate,

        @NotNull
        Long receiverUserId,
        Long donorId,
        List<DonationItemDTO> items
) {
    public record DonationItemDTO(
            Long itemId,
            Integer quantity
    ) {
    }
}
