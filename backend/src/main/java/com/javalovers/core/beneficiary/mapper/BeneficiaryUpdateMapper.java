package com.javalovers.core.beneficiary.mapper;

import com.javalovers.core.beneficiary.domain.dto.request.BeneficiaryFormDTO;
import com.javalovers.core.beneficiary.domain.entity.Beneficiary;
import org.springframework.stereotype.Service;

@Service
public class BeneficiaryUpdateMapper {

    public void update(Beneficiary beneficiary, BeneficiaryFormDTO beneficiaryFormDTO) {

        beneficiary.setFullName(beneficiaryFormDTO.fullName());
        beneficiary.setCpf(beneficiaryFormDTO.cpf());
        beneficiary.setPhone(beneficiaryFormDTO.phone());
        beneficiary.setEmail(beneficiaryFormDTO.email());
        beneficiary.setNif(beneficiaryFormDTO.nif());
        beneficiary.setAddress(beneficiaryFormDTO.address());
        beneficiary.setBeneficiaryStatus(beneficiaryFormDTO.beneficiaryStatus());
        beneficiary.setWithdrawalLimit(beneficiaryFormDTO.withdrawalLimit());
    }
}
