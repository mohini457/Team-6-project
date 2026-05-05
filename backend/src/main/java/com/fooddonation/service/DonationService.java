package com.fooddonation.service;

import com.fooddonation.dto.DonationRequest;
import com.fooddonation.entity.Donation;
import com.fooddonation.entity.DonationStatus;
import com.fooddonation.entity.User;
import com.fooddonation.repository.DonationRepository;
import com.fooddonation.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;

@Service
public class DonationService {

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public DonationService(DonationRepository donationRepository, UserRepository userRepository, SimpMessagingTemplate messagingTemplate) {
        this.donationRepository = donationRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public Donation createDonation(DonationRequest request, String donorEmail) {
        User donor = userRepository.findByEmail(donorEmail).orElseThrow();
        Donation donation = new Donation();
        donation.setFoodType(request.getFoodType());
        donation.setQuantity(request.getQuantity());
        donation.setBestBefore(request.getBestBefore());
        donation.setImageUrl(request.getImageUrl());
        donation.setLatitude(request.getLatitude());
        donation.setLongitude(request.getLongitude());
        donation.setDonor(donor);
        donation.setStatus(DonationStatus.PENDING);

        Donation savedDonation = donationRepository.save(donation);

        // Notify nearby volunteers via WebSocket
        messagingTemplate.convertAndSend("/topic/donations", "New donation available: " + savedDonation.getId());

        return savedDonation;
    }

    public List<Donation> getMyDonations(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return donationRepository.findByDonorIdOrderByCreatedAtDesc(user.getId());
    }

    public List<Donation> getNearbyDonations(Double lat, Double lng, Double radius) {
        // Find nearby pending donations (radius in km)
        return donationRepository.findNearbyPendingDonations(lat, lng, radius);
    }

    @Transactional
    public Donation claimDonation(Long donationId, String volunteerEmail) {
        // Use pessimistic write lock to prevent race conditions
        Donation donation = donationRepository.findByIdWithPessimisticLock(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        if (donation.getStatus() != DonationStatus.PENDING) {
            throw new RuntimeException("Donation is no longer available.");
        }

        User volunteer = userRepository.findByEmail(volunteerEmail).orElseThrow();
        donation.setVolunteer(volunteer);
        donation.setStatus(DonationStatus.ACCEPTED);

        // Generate OTP
        String otp = String.format("%04d", new Random().nextInt(10000));
        donation.setPickupOtp(otp);

        return donationRepository.save(donation);
    }

    @Transactional
    public Donation pickupDonation(Long donationId, String otp, String volunteerEmail) {
        Donation donation = donationRepository.findById(donationId).orElseThrow();

        if (donation.getStatus() != DonationStatus.ACCEPTED) {
            throw new RuntimeException("Donation is not in ACCEPTED state.");
        }
        if (!donation.getVolunteer().getEmail().equals(volunteerEmail)) {
            throw new RuntimeException("Not authorized to pickup this donation.");
        }
        if (!donation.getPickupOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP.");
        }

        donation.setStatus(DonationStatus.PICKED_UP);
        return donationRepository.save(donation);
    }

    @Transactional
    public Donation deliverDonation(Long donationId, String volunteerEmail) {
        Donation donation = donationRepository.findById(donationId).orElseThrow();

        if (donation.getStatus() != DonationStatus.PICKED_UP) {
            throw new RuntimeException("Donation is not in PICKED_UP state.");
        }
        if (!donation.getVolunteer().getEmail().equals(volunteerEmail)) {
            throw new RuntimeException("Not authorized to deliver this donation.");
        }

        donation.setStatus(DonationStatus.DELIVERED);
        return donationRepository.save(donation);
    }
    
    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }
}
