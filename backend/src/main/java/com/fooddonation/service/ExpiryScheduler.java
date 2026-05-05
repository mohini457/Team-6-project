package com.fooddonation.service;

import com.fooddonation.entity.Donation;
import com.fooddonation.entity.DonationStatus;
import com.fooddonation.repository.DonationRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExpiryScheduler {

    private final DonationRepository donationRepository;

    public ExpiryScheduler(DonationRepository donationRepository) {
        this.donationRepository = donationRepository;
    }

    @Scheduled(fixedRate = 60000) // Run every minute
    public void markExpiredDonations() {
        List<Donation> pendingDonations = donationRepository.findByStatus(DonationStatus.PENDING);
        LocalDateTime now = LocalDateTime.now();

        for (Donation donation : pendingDonations) {
            if (donation.getBestBefore().isBefore(now)) {
                donation.setStatus(DonationStatus.EXPIRED);
                donationRepository.save(donation);
            }
        }
    }
}
