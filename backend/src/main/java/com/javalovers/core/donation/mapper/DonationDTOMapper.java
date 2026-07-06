package com.javalovers.core.donation.mapper;

import com.javalovers.core.donation.domain.dto.response.DonationDTO;
import com.javalovers.core.donation.domain.entity.Donation;
import com.javalovers.core.donor.mapper.DonorDTOMapper;
import com.javalovers.core.appuser.mapper.AppUserDTOMapper;
import com.javalovers.core.itemdonated.domain.dto.response.ItemDonatedDTO;
import com.javalovers.core.item.mapper.ItemDTOMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DonationDTOMapper {

    private final DonorDTOMapper donorDTOMapper;
    private final AppUserDTOMapper appUserDTOMapper;
    private final ItemDTOMapper itemDTOMapper;

    public DonationDTO convert(Donation donation) {
        if(donation == null) return null;

        List<ItemDonatedDTO> items = donation.getItems() != null ?
                donation.getItems().stream()
                        .map(itemDonated -> new ItemDonatedDTO(
                                itemDonated.getItemDonatedId(),
                                null,
                                itemDTOMapper.convert(itemDonated.getItem()),
                                itemDonated.getQuantity()
                        ))
                        .collect(Collectors.toList())
                : List.of();

        return new DonationDTO(
                donation.getDonationId(),
                donation.getDonationDate(),
                appUserDTOMapper.convert(donation.getReceiverUser()),
                donorDTOMapper.convert(donation.getDonor()),
                items
        );
    }

}
