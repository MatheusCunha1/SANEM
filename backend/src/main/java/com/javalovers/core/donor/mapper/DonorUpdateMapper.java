package com.javalovers.core.donor.mapper;

import com.javalovers.core.donor.domain.dto.request.DonorFormDTO;
import com.javalovers.core.donor.domain.entity.Donor;
import org.springframework.stereotype.Service;

@Service
public class DonorUpdateMapper {

    public void update(Donor donor, DonorFormDTO donorFormDTO){
        donor.setName(donorFormDTO.name());
        donor.setCpfCnpj(donorFormDTO.cpfCnpj());
        donor.setContact(donorFormDTO.contact());
        donor.setPhone(donorFormDTO.phone());
        donor.setAddress(donorFormDTO.address());
        donor.setNumber(donorFormDTO.number());
        donor.setComplement(donorFormDTO.complement());
        donor.setNeighborhood(donorFormDTO.neighborhood());
        donor.setReferencePoint(donorFormDTO.referencePoint());
    }
}
